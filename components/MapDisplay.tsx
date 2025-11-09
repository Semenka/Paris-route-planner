import React, { useEffect, useRef, useState } from 'react';

declare const google: any; 

const MapDisplay: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // FIX: Use the globally declared 'google' object instead of 'window.google' to prevent TypeScript errors.
    if (!mapRef.current || !google || !google.maps) {
        return;
    }

    const startLocation = { lat: 48.8925, lng: 2.2387 }; // DeFence Tour Coupole
    const endLocation = { lat: 48.8718, lng: 2.2905 }; // 12 Rue Leonard De Vinci

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 48.88, lng: 2.26 },
      zoom: 14,
      disableDefaultUI: true,
      styles: [
        {
          "featureType": "poi.business",
          "stylers": [{ "visibility": "off" }]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text",
          "stylers": [{ "visibility": "off" }]
        }
      ]
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
            strokeColor: '#1d4ed8',
            strokeWeight: 6,
            strokeOpacity: 0.8
        }
    });
    directionsRenderer.setMap(map);

    const request = {
      origin: startLocation,
      destination: endLocation,
      travelMode: google.maps.TravelMode.TRANSIT,
    };

    directionsService.route(request, (result: any, status: any) => {
      setIsLoading(false);
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
      } else {
        console.error(`Directions request failed due to ${status}`);
        setError('Could not display the route on the map.');
      }
    });

  }, []);

  return (
    <div className="relative w-full h-80 md:h-96 bg-slate-200 rounded-lg overflow-hidden mt-6 shadow-inner">
      {isLoading && (
         <div className="absolute inset-0 flex items-center justify-center bg-slate-200/70 z-10">
            <div className="flex items-center space-x-2 text-slate-600 font-semibold">
                <div className="w-6 h-6 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading Map...</span>
            </div>
         </div>
      )}
      {error && (
         <div className="absolute inset-0 flex items-center justify-center bg-red-100 z-10 p-4 text-center">
            <p className="font-bold text-red-700">{error}</p>
         </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default MapDisplay;
