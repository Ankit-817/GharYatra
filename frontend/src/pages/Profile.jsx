"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"

const Profile = () => {
  const { user } = useAuth()
  const [userProperties, setUserProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProperty, setEditingProperty] = useState(null)
  const [editFormData, setEditFormData] = useState({})

  useEffect(() => {
    fetchUserProperties()
  }, [])

  const fetchUserProperties = async () => {
    try {
      const response = await api.get("/properties/my-properties/")
      setUserProperties(response.data)
    } catch (error) {
      console.error("Error fetching user properties:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (property) => {
    setEditingProperty(property.id)
    setEditFormData({
      title: property.title,
      description: property.description || "",
      price: property.price,
      location: property.location,
      property_type: property.property_type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
    })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await api.put(`/properties/${editingProperty}/`, editFormData)

      // Update the property in the local state
      setUserProperties(
        userProperties.map((prop) => (prop.id === editingProperty ? { ...prop, ...response.data } : prop)),
      )

      setEditingProperty(null)
      setEditFormData({})
      alert("Property updated successfully!")
    } catch (error) {
      console.error("Error updating property:", error)
      alert("Failed to update property. Please try again.")
    }
  }

  const handleEditCancel = () => {
    setEditingProperty(null)
    setEditFormData({})
  }

  const handleDelete = async (propertyId, propertyTitle) => {
    if (window.confirm(`Are you sure you want to delete "${propertyTitle}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/properties/${propertyId}/`)

        // Remove the property from local state
        setUserProperties(userProperties.filter((prop) => prop.id !== propertyId))
        alert("Property deleted successfully!")
      } catch (error) {
        console.error("Error deleting property:", error)
        alert("Failed to delete property. Please try again.")
      }
    }
  }

  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="card mb-8">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <p className="text-gray-900">{user?.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="text-gray-900">{user?.phone || "Not provided"}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Account Statistics</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Properties Listed</span>
                <span className="font-semibold">{userProperties.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Member Since</span>
                <span className="font-semibold">
                  {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Account Status</span>
                <span className="font-semibold text-green-600">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Properties</h2>
          <a href="/add-property" className="btn-primary">
            Add New Property
          </a>
        </div>

        {userProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏠</div>
            <p className="text-gray-600 mb-4 text-lg">You haven't listed any properties yet.</p>
            <a href="/add-property" className="btn-primary">
              List Your First Property
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProperties.map((property) => (
              <div key={property.id} className="property-card">
                {/* Property Image */}
                {property.image ? (
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}

                <div className="p-4">
                  {/* Edit Form */}
                  {editingProperty === property.id ? (
                    <form onSubmit={handleEditSubmit} className="space-y-3">
                      <input
                        type="text"
                        name="title"
                        value={editFormData.title}
                        onChange={handleEditFormChange}
                        className="input-field text-sm"
                        placeholder="Property Title"
                        required
                      />
                      <input
                        type="text"
                        name="location"
                        value={editFormData.location}
                        onChange={handleEditFormChange}
                        className="input-field text-sm"
                        placeholder="Location"
                        required
                      />
                      <input
                        type="number"
                        name="price"
                        value={editFormData.price}
                        onChange={handleEditFormChange}
                        className="input-field text-sm"
                        placeholder="Price"
                        required
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          name="bedrooms"
                          value={editFormData.bedrooms}
                          onChange={handleEditFormChange}
                          className="input-field text-sm"
                          placeholder="Bedrooms"
                        />
                        <input
                          type="number"
                          name="bathrooms"
                          value={editFormData.bathrooms}
                          onChange={handleEditFormChange}
                          className="input-field text-sm"
                          placeholder="Bathrooms"
                          step="0.5"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button type="submit" className="btn-primary text-sm flex-1">
                          Save
                        </button>
                        <button type="button" onClick={handleEditCancel} className="btn-secondary text-sm flex-1">
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Property Display */
                    <>
                      <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                      <p className="text-gray-600 mb-2">{property.location}</p>
                      <p className="text-blue-600 font-bold text-xl mb-2">Rs.{property.price?.toLocaleString()}</p>
                      <div className="flex justify-between text-sm text-gray-500 mb-4">
                        <span>{property.bedrooms} beds</span>
                        <span>{property.bathrooms} baths</span>
                        <span>{property.area} sq ft</span>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(property)} className="btn-secondary text-sm flex-1">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(property.id, property.title)}
                          className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4 rounded-lg transition-colors flex-1"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Property Status */}
                <div className="px-4 pb-4">
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        property.is_sold ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {property.is_sold ? "Sold" : "Available"}
                    </span>
                    <span className="text-xs text-gray-500">
                      Listed {new Date(property.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
