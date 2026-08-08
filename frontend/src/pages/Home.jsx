"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Home = () => {
  const { user } = useAuth()

  return (
    <div>
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden -mx-4 -mt-8 mb-16">
        {/* Background with gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"></div>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="text-center text-white">
            {/* Animated Badge */}
            <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 mb-8 animate-pulse">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              <span className="text-sm font-medium">🏆 #1 Real Estate Platform</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Find Your
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Dream Home
              </span>
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl mb-10 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Discover the perfect property from our extensive collection of premium homes, luxury apartments, and prime
              commercial spaces across the country.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link
                to="/properties"
                className="group relative bg-white text-blue-600 hover:bg-gray-50 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                <span className="relative z-10">🏠 Browse Properties</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </Link>

              {!user ? (
                <Link
                  to="/signup"
                  className="group relative border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 backdrop-blur-sm bg-white bg-opacity-10"
                >
                  <span className="relative z-10">✨ Get Started Free</span>
                </Link>
              ) : (
                <Link
                  to="/add-property"
                  className="group relative border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 backdrop-blur-sm bg-white bg-opacity-10"
                >
                  <span className="relative z-10">📝 List Your Property</span>
                </Link>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-blue-200">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm">4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Verified Properties</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Secure Transactions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-yellow-400 bg-opacity-20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-12 h-12 bg-green-400 bg-opacity-20 rounded-full animate-ping"></div>
      </section>

      {/* Enhanced Features Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Why Choose Us
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Trusted Real Estate Partner</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We provide the best real estate experience with our comprehensive services and expert guidance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Wide Selection</h3>
            <p className="text-gray-600 leading-relaxed">
              Choose from thousands of verified properties across different locations and price ranges with detailed
              information and high-quality photos.
            </p>
          </div>

          <div className="group card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4H19V9Z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Best Prices</h3>
            <p className="text-gray-600 leading-relaxed">
              Get the best deals with competitive pricing, transparent transactions, and no hidden fees. Save thousands
              on your next purchase.
            </p>
          </div>

          <div className="group card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Secure Process</h3>
            <p className="text-gray-600 leading-relaxed">
              Safe and secure buying process with verified listings, trusted sellers, legal protection, and 24/7
              customer support.
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="relative bg-gradient-to-r from-blue-50 to-indigo-50 -mx-4 px-4 py-16 mb-16 overflow-hidden">
        <div className="absolute inset-0 bg-white bg-opacity-50"></div>
        <div className="relative container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Thousands</h2>
            <p className="text-gray-600">Join our growing community of satisfied customers</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                1000+
              </div>
              <div className="text-gray-600 font-medium">Properties Listed</div>
            </div>
            <div className="group">
              <div className="text-4xl lg:text-5xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                500+
              </div>
              <div className="text-gray-600 font-medium">Happy Customers</div>
            </div>
            <div className="group">
              <div className="text-4xl lg:text-5xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                50+
              </div>
              <div className="text-gray-600 font-medium">Cities Covered</div>
            </div>
            <div className="group">
              <div className="text-4xl lg:text-5xl font-bold text-orange-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-gray-600 font-medium">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="text-center">
        <div className="relative card max-w-4xl mx-auto overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-5"></div>
          <div className="relative p-8 md:p-12">
            {user ? (
              <>
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">
                    {user.first_name?.charAt(0)}
                    {user.last_name?.charAt(0)}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Welcome back, {user.first_name}! 👋
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Ready to manage your properties or discover new investment opportunities?
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    to="/profile"
                    className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    🏠 View My Properties
                  </Link>
                  <Link
                    to="/add-property"
                    className="btn-secondary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    ➕ List New Property
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Ready to Find Your Perfect Home? 🏡
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Join thousands of satisfied customers who found their dream properties through our platform.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    to="/properties"
                    className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    🔍 Start Browsing
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-secondary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    ✨ Create Account
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
