import { useState } from 'react'
import Head from 'next/head'
import type { SetStateAction } from 'react'

interface ExtractedData {
  totalAmount: { value: number; confidence: number };
  taxAmount: { value: number; confidence: number };
  dateTime: { value: string; confidence: number };
  merchantName: { value: string; confidence: number };
  merchantAddress: { value: string; confidence: number };
  currencyCode: { value: string; confidence: number };
  merchantCountry: { value: string; confidence: number };
  merchantState: { value: string; confidence: number };
  merchantCity: { value: string; confidence: number };
  merchantPostalCode: { value: string; confidence: number };
  merchantPhone: { value: string; confidence: number };
  merchantEmail: { value: string | null; confidence: number };
}

interface ApiResponse {
  data: ExtractedData;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setResult(null)

      const formData = new FormData()
      formData.append('file', file)
      if (apiKey) {
        formData.append('apiKey', apiKey)
      }

      const response = await fetch('/api/parse-invoice', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to process invoice')
      }

      setResult(data)
    } catch (err) {
      console.error('Error in submission:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while processing the invoice')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Head>
        <title>Construction Invoice Reader</title>
        <meta name="description" content="Extract information from construction invoices" />
      </Head>

      <nav className="bg-yellow-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🏗️</span>
            <h1 className="text-2xl font-bold">Colligium Invoice Reader</h1>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <span className="text-3xl">🏢</span>
            <h2 className="text-3xl font-bold text-gray-800">
              Construction Invoice Scanner
            </h2>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8 border-t-4 border-yellow-600">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  API Key (optional)
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Enter your API key or leave blank for default"
                />
              </div>

              <div className="bg-amber-50 p-6 rounded-lg border-2 border-dashed border-yellow-400">
                <label className="block text-gray-700 font-semibold mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">📄</span>
                    <span>Upload Invoice</span>
                  </div>
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full text-gray-600"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: PDF, JPG, JPEG, PNG (Max size: 10MB)
                </p>
              </div>

              <button
                type="submit"
                disabled={!file || loading}
                className="w-full bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-700 disabled:bg-gray-400 transition duration-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Parse Invoice'}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}

            {result && result.data && (
              <div className="mt-8 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="bg-yellow-600 text-white py-4 px-6 rounded-t-lg">
                  <h3 className="text-xl font-bold">Extracted Information</h3>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-amber-50 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-800 mb-3">Merchant Details</h4>
                        <div className="space-y-2 text-gray-600">
                          <p><span className="font-semibold">Name:</span> {result.data.merchantName.value}</p>
                          <p><span className="font-semibold">Address:</span> {result.data.merchantAddress.value}</p>
                          <p><span className="font-semibold">Phone:</span> {result.data.merchantPhone.value || 'N/A'}</p>
                          <p><span className="font-semibold">Email:</span> {result.data.merchantEmail.value || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="bg-amber-50 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-800 mb-3">Location</h4>
                        <div className="space-y-2 text-gray-600">
                          <p><span className="font-semibold">City:</span> {result.data.merchantCity.value}</p>
                          <p><span className="font-semibold">State:</span> {result.data.merchantState.value}</p>
                          <p><span className="font-semibold">Country:</span> {result.data.merchantCountry.value}</p>
                          <p><span className="font-semibold">Postal Code:</span> {result.data.merchantPostalCode.value}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-amber-50 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-800 mb-3">Invoice Details</h4>
                        <div className="space-y-3 text-gray-600">
                          <p><span className="font-semibold">Date:</span> {formatDate(result.data.dateTime.value)}</p>
                          <p><span className="font-semibold">Currency:</span> {result.data.currencyCode.value}</p>
                          <p className="text-lg"><span className="font-semibold">Tax Amount:</span> {formatCurrency(result.data.taxAmount.value, result.data.currencyCode.value)}</p>
                          <p className="text-xl font-bold text-yellow-600">
                            <span className="font-semibold">Total Amount:</span> {formatCurrency(result.data.totalAmount.value, result.data.currencyCode.value)}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">
                          Data extraction confidence levels range from {Math.min(...Object.values(result.data).map(item => item.confidence * 100))}% to {Math.max(...Object.values(result.data).map(item => item.confidence * 100))}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}