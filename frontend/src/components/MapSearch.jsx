import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

// Keep one Google Maps loading promise for the entire application
let googleMapsPromise = null;

export default function MapSearch({
  onLocationSelect,
  placeholder = "Search for a location...",
}) {
  const containerRef = useRef(null);
  const autocompleteElementRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadGoogleMaps = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get API key from Vite environment
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
          throw new Error(
            "Google Maps API key is missing. Check frontend/.env"
          );
        }

        console.log(
          "Google Maps API key detected:",
          `${apiKey.substring(0, 6)}...`
        );

        // Load Google Maps only once
        if (!googleMapsPromise) {
          const loader = new Loader({
            apiKey,
            version: "weekly",
            libraries: ["places"],
            region: "IN",
          });

          googleMapsPromise = loader.load();
        }

        await googleMapsPromise;

        if (!mounted) {
          return;
        }

        // Make sure Places is available
        if (!window.google?.maps?.places) {
          throw new Error(
            "Google Maps Places library failed to load."
          );
        }

        /*
         * Google recommends PlaceAutocompleteElement
         * instead of the legacy Autocomplete widget.
         */
        const autocompleteElement =
          new window.google.maps.places.PlaceAutocompleteElement({
            includedRegionCodes: ["in"],
          });

        autocompleteElement.placeholder = placeholder;

        autocompleteElement.className =
          "w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50";

        if (containerRef.current) {
          containerRef.current.innerHTML = "";
          containerRef.current.appendChild(autocompleteElement);
        }

        autocompleteElementRef.current = autocompleteElement;

        /*
         * Fires when the user selects a suggestion.
         */
        autocompleteElement.addEventListener(
          "gmp-select",
          async (event) => {
            try {
              const placePrediction = event.placePrediction;

              if (!placePrediction) {
                return;
              }

              const place = placePrediction.toPlace();

              await place.fetchFields({
                fields: [
                  "displayName",
                  "formattedAddress",
                  "location",
                ],
              });

              if (!place.location) {
                setError(
                  "That address has no location coordinates."
                );
                return;
              }

              const address =
                place.formattedAddress ||
                place.displayName ||
                "";

              const lat = place.location.lat();
              const lng = place.location.lng();

              console.log("Selected location:", {
                address,
                lat,
                lng,
              });

              onLocationSelect({
                address,
                lat,
                lng,
              });

              setError(null);
            } catch (err) {
              console.error(
                "Error getting selected place:",
                err
              );

              setError(
                "Unable to get the selected location."
              );
            }
          }
        );

        setIsLoading(false);
      } catch (err) {
        console.error("Google Maps loading error:", err);
        console.error("Google Maps error details:", err);

        if (mounted) {
          setError(
            "Google Maps failed to load. Check your API key, billing, API restrictions and CSP."
          );

          setIsLoading(false);
        }
      }
    };

    loadGoogleMaps();

    // Cleanup
    return () => {
      mounted = false;

      if (autocompleteElementRef.current) {
        autocompleteElementRef.current.remove();
        autocompleteElementRef.current = null;
      }
    };
  }, [onLocationSelect, placeholder]);

  return (
    <div className="relative">
      {/* Google Places Autocomplete */}
      <div ref={containerRef} />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
          <div className="flex items-start">
            <svg
              className="w-4 h-4 mr-2 mt-0.5 text-yellow-600 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0V6a1 1 0 01-2 0v7a1 1 0 002 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>

            <div>
              <div className="font-medium">
                {error}
              </div>

              <div className="text-xs mt-1">
                Please check your Google Maps configuration.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}