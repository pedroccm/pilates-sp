'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Studio } from '@/types/studio';
import { isWhatsAppNumber, getWhatsAppUrl } from '@/utils/whatsapp';

interface GoogleMapProps {
  studios: Studio[];
  onStudioSelect?: (studio: Studio) => void;
  fixedZoom?: number;
  offsetY?: number;
}

export default function GoogleMap({ studios, onStudioSelect, fixedZoom, offsetY = 900 }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [infoWindow, setInfoWindow] = useState<any>(null);

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
          <div style="max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${studio.title}</h3>
            <p style="margin: 0; color: #666; font-size: 14px;">${studio.address}</p>
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
      if (fixedZoom !== undefined) {
        // Use fixed zoom if provided - always center on first marker
        const position = newMarkers[0].getPosition();
        if (position) {
          // Force center first, then zoom
          setTimeout(() => {
            // Offset the map center up so pin appears higher visually
            const offsetPosition = {
              lat: position.lat() - (offsetY / 111111), // Move map center up to show pin higher
              lng: position.lng()
            };
            map.setCenter(offsetPosition);
            map.setZoom(fixedZoom);
          }, 50);
        }
      } else if (newMarkers.length === 1) {
        // For single marker, center on it with fixed zoom
        const position = newMarkers[0].getPosition();
        if (position) {
          setTimeout(() => {
            // Offset the map center up so pin appears higher visually
            const offsetPosition = {
              lat: position.lat() - (offsetY / 111111), // Move map center up to show pin higher
              lng: position.lng()
            };
            map.setCenter(offsetPosition);
            map.setZoom(15); // Use zoom 15 as default for single markers too
          }, 50);
        }
      } else {
        // For multiple markers, use bounds
        const bounds = new google.maps.LatLngBounds();
        newMarkers.forEach(marker => {
          const position = marker.getPosition();
          if (position) bounds.extend(position);
        });
        map.fitBounds(bounds);
      }
    }
  }, [map, studios, infoWindow, onStudioSelect, fixedZoom, offsetY]);

  return (
    <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full min-h-[600px]" />
    </div>
  );
}