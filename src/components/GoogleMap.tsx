'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Studio } from '@/types/studio';
import { isWhatsAppNumber, getWhatsAppUrl } from '@/utils/whatsapp';

interface GoogleMapProps {
  studios: Studio[];
  onStudioSelect?: (studio: Studio) => void;
}

export default function GoogleMap({ studios, onStudioSelect }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: 'weekly',
      });

      const { Map } = await loader.importLibrary('maps');
      const { Marker } = await loader.importLibrary('marker');
      const { InfoWindow } = await loader.importLibrary('maps');

      if (mapRef.current) {
        const mapInstance = new Map(mapRef.current, {
          center: { lat: -23.5505, lng: -46.6333 }, // São Paulo center
          zoom: 11,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        const infoWindowInstance = new InfoWindow();
        
        setMap(mapInstance);
        setInfoWindow(infoWindowInstance);
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (!map || !infoWindow) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    // Create new markers
    const newMarkers = studios.map(studio => {
      const marker = new google.maps.Marker({
        position: { lat: studio.location.lat, lng: studio.location.lng },
        map: map,
        title: studio.title,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#3B82F6" stroke="white" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-size="16" font-weight="bold">P</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
        },
      });

      marker.addListener('click', () => {
        const whatsappButton = isWhatsAppNumber(studio.phone) 
          ? `<a href="${getWhatsAppUrl(studio.phone, `Olá! Gostaria de saber mais informações sobre as aulas de Pilates no ${studio.title}.`)}" target="_blank" rel="noopener noreferrer" 
               style="background: #25D366; color: white; padding: 6px 12px; border-radius: 4px; text-decoration: none; font-size: 14px; margin-right: 8px;">
               WhatsApp
             </a>`
          : '';
        
        const content = `
          <div style="max-width: 300px;">
            <img src="${studio.imageUrl}" alt="${studio.title}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${studio.title}</h3>
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <span style="color: #FFA500; margin-right: 8px;">${'★'.repeat(Math.floor(studio.totalScore))}${'☆'.repeat(5 - Math.floor(studio.totalScore))}</span>
              <span style="color: #666; font-size: 14px;">(${studio.reviewsCount} avaliações)</span>
            </div>
            <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${studio.neighborhood}</p>
            <p style="margin: 0 0 12px 0; color: #666; font-size: 14px;">${studio.address}</p>
            <div style="display: flex; align-items: center; gap: 8px;">
              ${whatsappButton}
              <a href="${studio.url}" target="_blank" rel="noopener noreferrer" 
                 style="background: #3B82F6; color: white; padding: 6px 12px; border-radius: 4px; text-decoration: none; font-size: 14px;">
                Ver no Maps
              </a>
            </div>
          </div>
        `;

        infoWindow.setContent(content);
        infoWindow.open(map, marker);

        if (onStudioSelect) {
          onStudioSelect(studio);
        }
      });

      return marker;
    });

    setMarkers(newMarkers);

    // Adjust map bounds to show all markers
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        const position = marker.getPosition();
        if (position) bounds.extend(position);
      });
      map.fitBounds(bounds);
      
      // Don't zoom too much for single marker
      if (newMarkers.length === 1) {
        map.setZoom(15);
      }
    }
  }, [map, studios, infoWindow, onStudioSelect]);

  return (
    <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full min-h-[600px]" />
    </div>
  );
}