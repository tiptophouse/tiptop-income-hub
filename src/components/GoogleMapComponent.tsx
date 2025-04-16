
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { toast } from '@/components/ui/use-toast';

interface GoogleMapComponentProps {
  address?: string;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ address }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  
  // Using the provided Google Maps API key
  const googleMapsApiKey = "AIzaSyBbclc8qxh5NVR9skf6XCz_xRJCZsnmUGA";

  useEffect(() => {
    if (!googleMapsApiKey) return;

    const loader = new Loader({
      apiKey: googleMapsApiKey,
      version: 'weekly',
    });

    loader.load().then(() => {
      setIsLoaded(true);
    }).catch(err => {
      console.error('Error loading Google Maps API:', err);
    });
  }, [googleMapsApiKey]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const defaultLocation = { lat: 34.0522, lng: -118.2437 }; // Los Angeles as default
    
    const mapInstance = new window.google.maps.Map(mapRef.current, {
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

    const markerInstance = new window.google.maps.Marker({
      map: mapInstance,
      position: defaultLocation,
      animation: window.google.maps.Animation.DROP,
    });

    setMarker(markerInstance);
  }, [isLoaded]);

  useEffect(() => {
    if (!map || !marker || !address || !isLoaded) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        marker.setPosition(location);
        
        // Add a visual effect
        marker.setAnimation(window.google.maps.Animation.DROP);
        
        // Add the roof overlay simulation
        const roofOverlay = new window.google.maps.Rectangle({
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

  // Function to get user's current location
  const getCurrentLocation = () => {
    if (!isLoaded || !map || !marker) return;
    
    setIsLocating(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          map.setCenter(userLocation);
          marker.setPosition(userLocation);
          marker.setAnimation(window.google.maps.Animation.DROP);
          
          // Add the roof overlay simulation
          const roofOverlay = new window.google.maps.Rectangle({
            strokeColor: '#AA94E2',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#AA94E2',
            fillOpacity: 0.35,
            map,
            bounds: {
              north: userLocation.lat + 0.0005,
              south: userLocation.lat - 0.0005,
              east: userLocation.lng + 0.0008,
              west: userLocation.lng - 0.0008
            }
          });
          
          // Reverse geocode to get address
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: userLocation }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const address = results[0].formatted_address;
              toast({
                title: "Location Found",
                description: `Your current location: ${address}`,
              });
              
              // Dispatch a custom event with the address for other components to use
              const addressEvent = new CustomEvent('addressFound', { 
                detail: { address } 
              });
              document.dispatchEvent(addressEvent);
            }
          });
          
          setIsLocating(false);
        },
        (error) => {
          console.error('Error getting current location:', error);
          toast({
            title: "Location Error",
            description: "Unable to get your current location. Please check your browser permissions.",
            variant: "destructive"
          });
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive"
      });
      setIsLocating(false);
    }
  };

  return (
    <div className="w-full">
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
          Loading map...
        </div>
      )}
      {isLoaded && (
        <button 
          onClick={getCurrentLocation} 
          disabled={isLocating}
          className="mt-2 px-3 py-1.5 bg-tiptop-accent text-white rounded-md text-sm flex items-center justify-center hover:bg-tiptop-accent/90 transition-colors duration-200 w-full"
        >
          {isLocating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Locating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Use My Current Location
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default GoogleMapComponent;
