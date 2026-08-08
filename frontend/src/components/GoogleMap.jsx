"use client";

import { useEffect, useRef, useState } from "react";
import { mapsReady } from "../utils/mapsLoader";

const GoogleMap = ({
  properties = [],
  center = null,
  zoom = 10,
  onMarkerClick,
  showInfoWindows = true,
  mapStyle = "roadmap",
  height = "400px",
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [infoWindows, setInfoWindows] = useState([]);

  useEffect(() => {
    mapsReady.then(() => {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: center || { lat: 19.076, lng: 72.8777 },
        zoom,
        mapTypeId: mapStyle,
        streetViewControl: true,
        zoomControl: true,
        fullscreenControl: true,
      });
      setMap(mapInstance);
    });
  }, []);

  useEffect(() => {
    if (!map || !properties.length) return;

    markers.forEach((marker) => marker.setMap(null));
    infoWindows.forEach((iw) => iw.close());

    const geocoder = new window.google.maps.Geocoder();
    const newMarkers = [];
    const newInfoWindows = [];

    properties.forEach((property) => {
      geocoder.geocode({ address: property.location }, (results, status) => {
        if (status === "OK" && results[0]) {
          const coordinates = results[0].geometry.location;

          const marker = new window.google.maps.Marker({
            position: coordinates,
            map,
            title: property.title,
            animation: window.google.maps.Animation.DROP,
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div><strong>${property.title}</strong><br/>${property.location}<br/>₹${property.price}</div>`,
          });

          marker.addListener("click", () => {
            newInfoWindows.forEach((iw) => iw.close());
            if (showInfoWindows) infoWindow.open(map, marker);
            if (onMarkerClick) onMarkerClick(property);
          });

          newMarkers.push(marker);
          newInfoWindows.push(infoWindow);
        }
      });
    });

    setMarkers(newMarkers);
    setInfoWindows(newInfoWindows);
  }, [map, properties]);

  return (
    <div ref={mapRef} style={{ height, width: "100%" }} className="rounded-lg shadow" />
  );
};

export default GoogleMap;
