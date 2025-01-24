import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import https from 'https';

// This configuration is required to parse form data
export const config = {
  api: {
    bodyParser: false,
  },
};

const VISION_PARSER_API_URL = 'https://api.visionparser.com/parse/image/file';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('API route started');

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let tempFilePath: string | null = null;

  try {
    // Check for API key in environment variables
    const apiKey = process.env.VISION_PARSER_API_KEY;
    if (!apiKey) {
      throw new Error('Vision Parser API key not configured');
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    console.log('Processing form data');
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: MAX_FILE_SIZE,
    });

    // Parse form data
    const [fields, files] = await new Promise<[formidable.Fields<string>, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    console.log('Form data processed', { fields });

    if (!files.file || !Array.isArray(files.file) || files.file.length === 0) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = files.file[0];
    tempFilePath = file.filepath;

    console.log('Preparing API request');
    const formData = new FormData();
    formData.append('file', fs.createReadStream(file.filepath));
    formData.append('response_type', 'simple');

    // Create custom Axios instance with proper configuration
    const instance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    });

    console.log('Sending request to Vision Parser API');
    const response = await instance.post(
      VISION_PARSER_API_URL,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'api_key': apiKey,
          'Content-Type': 'multipart/form-data',
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }
    );

    console.log('API response received');

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error in API route:', error);

    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        response: error.response?.data,
        status: error.response?.status,
      });
      return res.status(error.response?.status || 500).json({
        message: 'Error processing invoice',
        error: error.response?.data?.detail || error.message,
      });
    }

    return res.status(500).json({
      message: 'Error processing invoice',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  } finally {
    // Clean up temporary file
    if (tempFilePath) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (error) {
        console.error('Error deleting temp file:', error);
      }
    }
  }
}