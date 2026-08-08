"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import MapSearch from "../components/MapSearch"

const AddProperty = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    property_type: "house",
    bedrooms: "",
    bathrooms: "",
    area: "",
  })
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = (e) => {
    setImage(e.target.files[0])
  }

  const handleLocationSelect = (location) => {
    setSelectedLocation(location)
    setFormData({
      ...formData,
      location: location.address,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const submitData = new FormData()

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value)
      })

      // Append image if selected
      if (image) {
        submitData.append("image", image)
      }

      // Append location coordinates if available
      if (selectedLocation && selectedLocation.lat && selectedLocation.lng) {
        submitData.append("latitude", selectedLocation.lat)
        submitData.append("longitude", selectedLocation.lng)
      }

      const response = await api.post("/properties/", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      navigate("/profile")
    } catch (error) {
      console.error("Error adding property:", error)
      setError(error.response?.data?.message || "Failed to add property")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8">
            <h1 className="text-4xl font-bold text-white mb-2">Add New Property</h1>
            <p className="text-blue-100 text-lg">Fill in the details to list your property</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-6 rounded-lg mb-8 animate-pulse">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Basic Information</h2>
                  <p className="text-gray-600 text-sm">Provide essential details about your property</p>
                </div>

                <div className="group">
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-3">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 bg-gray-50 focus:bg-white"
                    required
                    placeholder="Enter property title"
                  />
                </div>

                <div className="group">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-3">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 bg-gray-50 focus:bg-white resize-none"
                    placeholder="Describe your property in detail..."
                  />
                </div>
              </div>

              {/* Property Details Section */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Property Details</h2>
                  <p className="text-gray-600 text-sm">Specify the key characteristics of your property</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="group">
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-3">
                      Price (INR) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 bg-gray-50 focus:bg-white"
                        required
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="property_type" className="block text-sm font-semibold text-gray-700 mb-3">
                      Property Type
                    </label>
                    <select
                      id="property_type"
                      name="property_type"
                      value={formData.property_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                    >
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="condo">Condo</option>
                      <option value="commercial">Commercial</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="group">
                    <label htmlFor="bedrooms" className="block text-sm font-semibold text-gray-700 mb-3">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      id="bedrooms"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 bg-gray-50 focus:bg-white"
                      min="0"
                      placeholder="0"
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="bathrooms" className="block text-sm font-semibold text-gray-700 mb-3">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      id="bathrooms"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 bg-gray-50 focus:bg-white"
                      min="0"
                      step="0.5"
                      placeholder="0"
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="area" className="block text-sm font-semibold text-gray-700 mb-3">
                      Area (sq ft)
                    </label>
                    <input
                      type="number"
                      id="area"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 bg-gray-50 focus:bg-white"
                      min="0"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Location</h2>
                  <p className="text-gray-600 text-sm">Pin your property's exact location</p>
                </div>

                <div className="group">
                  <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-3">
                    Property Location *
                  </label>
                  <div className="relative">
                    <MapSearch
                      onLocationSelect={handleLocationSelect}
                      placeholder="Search for property address or type manually..."
                    />
                  </div>
                  
                  {selectedLocation && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl animate-fadeIn">
                      <div className="flex items-center space-x-2 text-green-800 mb-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                        <span className="font-semibold">Location Selected</span>
                      </div>
                      <p className="text-green-700 font-medium mb-1">{selectedLocation.address}</p>
                      {selectedLocation.lat && selectedLocation.lng && (
                        <p className="text-green-600 text-sm">
                          Coordinates: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {!selectedLocation && (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 bg-gray-50 focus:bg-white"
                      placeholder="Or type address manually"
                      required
                    />
                  )}
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Property Images</h2>
                  <p className="text-gray-600 text-sm">Upload high-quality images to showcase your property</p>
                </div>

                <div className="group">
                  <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-3">
                    Property Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 bg-gray-50 focus:bg-white cursor-pointer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Upload one image of your property (JPG, PNG, etc.)
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      <span>Adding Property...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Property
                    </div>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddProperty