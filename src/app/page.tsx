import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            PromoLink
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create beautiful link pages for your affiliate offers with tracking
          </p>
          
          <div className="space-x-4">
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
            >
              Get Started
            </Link>
            <Link
              href="/auth"
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">1. Create Links</h3>
              <p className="text-gray-600">Add your affiliate links with tracking</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">2. Share Your Page</h3>
              <p className="text-gray-600">Get your personal promolink.com/username</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">3. Track Clicks</h3>
              <p className="text-gray-600">Monitor performance in your dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
