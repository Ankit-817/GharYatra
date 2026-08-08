"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
import PropertyMap from "../components/PropertyMap"
import NearbyProperties from "../components/NearbyProperties"

const PropertyDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: user?.first_name + " " + user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    message: "",
  })

  useEffect(() => {
    fetchProperty()
  }, [id])

  useEffect(() => {
    if (user) {
      setContactForm((prev) => ({
        ...prev,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone: user.phone || "",
      }))
    }
  }, [user])

  const fetchProperty = async () => {
    try {
      const response = await api.get(`/properties/${id}/`)
      setProperty(response.data)
    } catch (error) {
      console.error("Error fetching property:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async () => {
    if (!user) {
      navigate("/login")
      return
    }

    setPurchasing(true)
    try {
      const response = await api.post(`/properties/${id}/purchase/`)

      // Update property status locally
      setProperty((prev) => ({
        ...prev,
        is_sold: true,
      }))

      setShowBuyModal(false)
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Purchase error:", error)
      setShowBuyModal(false)
      setShowErrorModal(true)
    } finally {
      setPurchasing(false)
    }
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    // Simulate sending contact message
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setShowContactModal(false)
    alert("Message sent successfully! The seller will contact you soon.")
  }

  const handleContactFormChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
        <p className="text-gray-600">The property you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-6xl mx-auto">
        {/* Property Sold Banner */}
        {property.is_sold && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span className="font-semibold text-lg">🏠 This property has been SOLD!</span>
            </div>
            <p className="mt-2">This property is no longer available for purchase.</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Property Image */}
          <div className="space-y-4 relative">
            {property.is_sold && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center z-10">
                <div className="bg-red-600 text-white px-8 py-4 rounded-xl transform -rotate-12 shadow-2xl">
                  <span className="text-2xl font-bold">SOLD</span>
                </div>
              </div>
            )}

            {property.image ? (
              <img
                src={property.image || "/placeholder.svg"}
                alt={property.title}
                className={`w-full h-96 object-cover rounded-xl shadow-lg ${property.is_sold ? "filter grayscale" : ""}`}
              />
            ) : (
              <div
                className={`w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center ${property.is_sold ? "filter grayscale" : ""}`}
              >
                <span className="text-gray-500 text-lg">No Image Available</span>
              </div>
            )}

            {/* Property Gallery Placeholder */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-20 bg-gray-100 rounded-lg flex items-center justify-center ${property.is_sold ? "filter grayscale" : ""}`}
                >
                  <span className="text-xs text-gray-400">Photo {i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">{property.title}</h1>
              <div className="flex items-center space-x-2 text-gray-600 mb-4">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span className="text-lg">{property.location}</span>
              </div>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-4xl font-bold text-blue-600">Rs.{property.price?.toLocaleString()}</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    property.is_sold ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                  }`}
                >
                  {property.is_sold ? "SOLD" : "Available"}
                </span>
              </div>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{property.bedrooms}</div>
                <div className="text-gray-600 text-sm">Bedrooms</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{property.bathrooms}</div>
                <div className="text-gray-600 text-sm">Bathrooms</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{property.area}</div>
                <div className="text-gray-600 text-sm">Sq Ft</div>
              </div>
            </div>

            {/* Property Type */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">Property Type</h3>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                {property.property_type}
              </span>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>
            )}

            {/* Owner Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold mb-3">Listed By</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {property.owner?.first_name?.charAt(0)}
                  {property.owner?.last_name?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {property.owner?.first_name} {property.owner?.last_name}
                  </p>
                  {property.owner?.phone && <p className="text-gray-600 text-sm">📞 {property.owner.phone}</p>}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                onClick={() => setShowBuyModal(true)}
                disabled={property.is_sold}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  property.is_sold
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                }`}
              >
                {property.is_sold ? "🏠 Sold" : "💰 Buy Now"}
              </button>
              <button
                onClick={() => setShowContactModal(true)}
                disabled={property.is_sold}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                  property.is_sold
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                }`}
              >
                📞 Contact Seller
              </button>
            </div>
          </div>
        </div>

        {/* Property Location Map */}
        <div className="mb-8">
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">📍 Property Location</h2>
            <PropertyMap properties={[property]} height="400px" showControls={false} />
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-800">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span className="font-medium">{property.location}</span>
              </div>
              <p className="text-blue-700 text-sm mt-1">
                Click the marker above to see more details about this location
              </p>
            </div>
          </div>
        </div>

        {/* Nearby Properties */}
        <div className="mb-8">
          <div className="card">
            <NearbyProperties currentProperty={property} />
          </div>
        </div>
      </div>

      {/* Buy Now Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirm Purchase</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to purchase <strong>{property.title}</strong> for{" "}
                <span className="text-blue-600 font-bold">Rs.{property.price?.toLocaleString()}</span>?
              </p>

              <div className="bg-blue-50 p-4 rounded-xl mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Property Price:</span>
                  <span className="font-semibold">Rs.{property.price?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Processing Fee:</span>
                  <span className="font-semibold">Rs.500</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="font-bold text-blue-600">
                    Rs.{(Number(property.price) + 500).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50"
                >
                  {purchasing ? "Processing..." : "Confirm Purchase"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Seller Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Seller</h2>
              <p className="text-gray-600">Send a message to the property owner</p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleContactFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactFormChange}
                  rows="4"
                  placeholder="Hi, I'm interested in this property. Please contact me with more details."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 Purchase Successful!</h2>
              <p className="text-gray-600 mb-6">
                Congratulations! You have successfully purchased this property. The property has been marked as sold and
                removed from available listings.
              </p>

              <div className="bg-green-50 p-4 rounded-xl mb-6">
                <h3 className="font-semibold text-green-800 mb-2">What happens next:</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Property is now marked as SOLD</li>
                  <li>• You'll receive a confirmation email shortly</li>
                  <li>• Legal documentation will be prepared</li>
                  <li>• Property keys will be arranged for transfer</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  navigate("/profile")
                }}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300"
              >
                View My Purchases
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Purchase Failed</h2>
              <p className="text-gray-600 mb-6">
                We're sorry, but your purchase request couldn't be processed at this time. This could be due to:
              </p>

              <div className="bg-red-50 p-4 rounded-xl mb-6 text-left">
                <ul className="text-sm text-red-700 space-y-2">
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span>You may have already made a purchase request for this property</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span>The property might have been sold recently</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span>Network connection issues</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span>You cannot purchase your own property</span>
                  </li>
                </ul>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowErrorModal(false)
                    setShowBuyModal(true)
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PropertyDetail
