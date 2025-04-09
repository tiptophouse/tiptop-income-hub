
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapComponentProps {
  address?: string;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ address }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    // In a real implementation, this would be fetched from a secure environment variable
    // For demo purposes, we'll use a temporary state value that the user can set
    if (!apiKey) return;

    const loader = new Loader({
      apiKey,
      version: 'weekly',
    });

    loader.load().then(() => {
      setIsLoaded(true);
    }).catch(err => {
      console.error('Error loading Google Maps API:', err);
    });
  }, [apiKey]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const defaultLocation = { lat: 34.0522, lng: -118.2437 }; // Los Angeles as default
    
    const mapInstance = new google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      styles: [
        {
          featureType: 'administrative',
          elementType: 'geometry',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'poi',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'road',
          elementType: 'labels.icon',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'transit',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#c9c9c9' }]
        }
      ]
    });

    setMap(mapInstance);

    const markerInstance = new google.maps.Marker({
      map: mapInstance,
      position: defaultLocation,
      animation: google.maps.Animation.DROP,
    });

    setMarker(markerInstance);
  }, [isLoaded]);

  useEffect(() => {
    if (!map || !marker || !address || !isLoaded) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        marker.setPosition(location);
        
        // Add a visual effect
        marker.setAnimation(google.maps.Animation.DROP);
        
        // Add the roof overlay simulation
        const roofOverlay = new google.maps.Rectangle({
          strokeColor: '#AA94E2',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#AA94E2',
          fillOpacity: 0.35,
          map,
          bounds: {
            north: location.lat() + 0.0005,
            south: location.lat() - 0.0005,
            east: location.lng() + 0.0008,
            west: location.lng() - 0.0008
          }
        });
      } else {
        console.error('Geocode was not successful for the following reason:', status);
      }
    });
  }, [address, map, marker, isLoaded]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  return (
    <div className="w-full">
      {!apiKey && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
          <p className="mb-2 font-medium">Google Maps API Key Required</p>
          <p className="text-sm mb-3">For this demo, please enter your Google Maps API key:</p>
          <input
            type="text"
            placeholder="Enter Google Maps API Key"
            className="w-full p-2 border border-yellow-300 rounded"
            value={apiKey}
            onChange={handleApiKeyChange}
          />
          <p className="text-xs mt-2">
            In a production environment, this would be securely stored in environment variables.
          </p>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-80 rounded-lg shadow-md border border-gray-200"
        style={{ 
          opacity: isLoaded ? 1 : 0.5,
          transition: 'opacity 0.3s ease'
        }}
      />
      {!isLoaded && (
        <div className="mt-2 text-center text-sm text-gray-500">
          {apiKey ? 'Loading map...' : 'Enter your API key to load the map'}
        </div>
      )}
    </div>
  );
};

export default GoogleMapComponent;
