"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"

const NearbyProperties = ({ currentProperty, radius = 10 }) => {
  const [nearbyProperties, setNearbyProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentProperty) {
      fetchNearbyProperties()
    }
  }, [currentProperty])

  const fetchNearbyProperties = async () => {
    try {
      // For demo purposes, we'll fetch all properties and filter by location
      const response = await api.get("/properties/")
      const allProperties = response.data.results || response.data

      // Filter out current property and get properties in same city
      const nearby = allProperties
        .filter((p) => p.id !== currentProperty.id)
        .filter((p) => {
          const currentCity = currentProperty.location.split(",")[0].trim()
          const propertyCity = p.location.split(",")[0].trim()
          return currentCity.toLowerCase() === propertyCity.toLowerCase()
        })
        .slice(0, 3) // Limit to 3 nearby properties

      setNearbyProperties(nearby)
    } catch (error) {
      console.error("Error fetching nearby properties:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4 w-48"></div>
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 h-48 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (nearbyProperties.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <p className="text-gray-600">No nearby properties found</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">🏘️ Nearby Properties</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {nearbyProperties.map((property) => (
          <Link
            key={property.id}
            to={`/properties/${property.id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            {property.image ? (
              <img
                src={property.image || "/placeholder.svg"}
                alt={property.title}
                className="w-full h-32 object-cover"
              />
            ) : (
              <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </div>
            )}

            <div className="p-4">
              <h4 className="font-semibold text-sm mb-1 truncate">{property.title}</h4>
              <p className="text-gray-600 text-xs mb-2">{property.location}</p>
              <p className="text-blue-600 font-bold">${property.price?.toLocaleString()}</p>

              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{property.bedrooms} beds</span>
                <span>{property.bathrooms} baths</span>
                <span>{property.area} sq ft</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default NearbyProperties
