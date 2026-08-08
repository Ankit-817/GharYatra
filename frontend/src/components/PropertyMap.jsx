"use client";

import GoogleMap from "./GoogleMap";

const PropertyMap = ({
  properties = [],
  selectedProperty = null,
  onPropertySelect,
  height = "500px",
  showControls = true,
}) => {
  const handleMarkerClick = (property) => {
    if (onPropertySelect) onPropertySelect(property);
  };

  const getMapCenter = () => {
    if (!properties.length) return null;
    if (properties.length === 1) return null; // Let GoogleMap resolve it from geocoding

    const locations = properties.map((p) => p.location);
    const geocoder = new window.google.maps.Geocoder();

    return new Promise((resolve) => {
      geocoder.geocode({ address: locations[0] }, (results, status) => {
        if (status === "OK" && results[0]) {
          resolve(results[0].geometry.location.toJSON());
        } else {
          resolve({ lat: 19.076, lng: 72.8777 });
        }
      });
    });
  };

  return (
    <div className="relative">
      <GoogleMap
        properties={properties}
        center={{ lat: 22.577, lng: 88.362 }} // Kolkata as fallback
        zoom={properties.length === 1 ? 14 : 10}
        onMarkerClick={handleMarkerClick}
        height={height}
        showInfoWindows={true}
      />

      {showControls && properties.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow text-sm text-gray-700">
          <div className="font-semibold">{properties.length} Properties</div>
          <div>{properties.filter((p) => !p.is_sold).length} Available</div>
          <div>{properties.filter((p) => p.is_sold).length} Sold</div>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;
