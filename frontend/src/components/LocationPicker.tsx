"use client";

import {
  IconCurrentLocation,
  IconMapPin,
  IconSearch,
} from "@tabler/icons-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type React from "react";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
  initialPosition?: [number, number];
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

function MapEvents({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function LocationPicker({
  initialPosition = [18.4861, -69.9312], // Default to Santo Domingo
  onLocationSelect,
}: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number]>(initialPosition);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery,
        )}`,
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newPos: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setPosition(newPos);
        onLocationSelect(newPos[0], newPos[1], display_name);
      }
    } catch (error) {
      console.error("Error searching location:", error);
      toast.error("Error al buscar la ubicación");
    } finally {
      setLoading(false);
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      );
      const data = await response.json();
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocalización no soportada por su navegador");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPos: [number, number] = [latitude, longitude];
        setPosition(newPos);
        const address = await reverseGeocode(latitude, longitude);
        onLocationSelect(latitude, longitude, address);
        setLocating(false);
        toast.success("Ubicación detectada correctamente");
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error(
          "No pudimos obtener su ubicación actual. Verifique los permisos.",
        );
        setLocating(false);
      },
      { enableHighAccuracy: true },
    );
  };

  const handleMapClick = async (lat: number, lng: number) => {
    const newPos: [number, number] = [lat, lng];
    setPosition(newPos);
    const address = await reverseGeocode(lat, lng);
    onLocationSelect(lat, lng, address);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar dirección (ej: Santo Domingo, RD)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/20 border-white/10 text-white pl-10 h-11"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <IconMapPin
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            size={18}
          />
        </div>
        <Button
          type="button"
          onClick={() => handleSearch()}
          disabled={loading || locating}
          className="bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 h-11 px-4"
        >
          {loading ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <IconSearch size={20} />
          )}
        </Button>
        <Button
          type="button"
          onClick={handleCurrentLocation}
          disabled={loading || locating}
          variant="outline"
          className="border-white/10 bg-white/5 text-indigo-400 hover:bg-white/10 shrink-0 h-11 px-4"
          title="Detectar mi ubicación"
        >
          {locating ? (
            <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full" />
          ) : (
            <IconCurrentLocation size={20} />
          )}
        </Button>
      </div>

      <div className="h-[300px] w-full rounded-xl overflow-hidden border border-white/10 relative z-0">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView center={position} />
          <MapEvents onLocationSelect={handleMapClick} />
          <Marker position={position} />
        </MapContainer>
      </div>
      <p className="text-[10px] text-zinc-500 italic">
        * Haz click en el mapa para ajustar la ubicación exacta.
      </p>
    </div>
  );
}
