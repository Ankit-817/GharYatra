// utils/mapsLoader.js
import { Loader } from "@googlemaps/js-api-loader"

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

if (!apiKey) {
  console.error(
    "Google Maps API key is missing. Check frontend/.env and restart Vite."
  )
}

const loader = new Loader({
  apiKey,
  version: "weekly",
  libraries: ["places"],
  region: "IN",
})

export const mapsReady = loader.load().catch((error) => {
  console.error("Google Maps Loader Error:", error)
  throw error
})