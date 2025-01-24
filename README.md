# Vision Invoice Parser

A modern Next.js web application that leverages computer vision to automatically extract and analyze key information from invoice images with confidence scoring.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.2-blueviolet)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)

## 🚀 Features

- 📊 Automatic extraction of invoice data:
  - Total amount
  - Tax amount
  - Date and time
  - Merchant details (name, address, contact info)
  - Currency information
- 💯 Confidence scoring for each extracted field
- 🎨 Modern UI built with Next.js and Tailwind CSS
- 📱 Responsive design
- 🔒 Secure API key management

## 🛠️ Prerequisites

Before running this application, make sure you have:

- Node.js 18.x or later
- npm or yarn package manager
- An API key for the vision service

## 🏃‍♂️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vision-invoice-parser.git
   cd vision-invoice-parser
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

## 🚀 Production Deployment

To deploy the application for production:

1. **Build the application**
   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Start the production server**
   ```bash
   npm run start
   # or
   yarn start
   ```

## 💻 Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Form Handling**: FormData
- **Icons**: Lucide React

## 📝 API Usage

The application expects an API key for authentication. You can input your API key in the web interface or set it as an environment variable.

Example API response structure:
```typescript
interface ExtractedData {
  totalAmount: { value: number; confidence: number };
  taxAmount: { value: number; confidence: number };
  dateTime: { value: string; confidence: number };
  merchantName: { value: string; confidence: number };
  // ... other fields
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

If you have any questions or suggestions, please open an issue in the repository.
