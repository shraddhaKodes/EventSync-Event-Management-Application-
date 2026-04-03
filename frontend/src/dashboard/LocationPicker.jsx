import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

const LocationPicker = ({ setFormData }) => {
  const [position, setPosition] = useState(null);

 const MapClickHandler = () => {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;

      setPosition([lat, lng]);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
        );

        const data = await res.json();

        const address = data.display_name;

        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          locationName: address || `Lat: ${lat}, Lng: ${lng}`,
        }));

      } catch (error) {
        console.error("Location fetch error:", error);

        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          locationName: `Lat: ${lat}, Lng: ${lng}`,
        }));
      }
    },
  });

  return null;
};

  return (
    <MapContainer
      center={[26.8467, 80.9462]}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler />

      {position && <Marker position={position} />}
    </MapContainer>
  );
};

export default LocationPicker;