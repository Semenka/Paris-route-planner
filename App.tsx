import React, { useState, useEffect, useCallback } from 'react';
import { getFastestRoute } from './services/geminiService';
import type { GroundingChunk, UserLocation } from './types';
import RouteCard from './components/RouteCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import { useGoogleMapsScript, ScriptStatus } from './hooks/useGoogleMapsScript';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [routeSuggestion, setRouteSuggestion] = useState<string | null>(null);
  const [groundingSources, setGroundingSources] = useState<GroundingChunk[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const mapsScriptStatus = useGoogleMapsScript();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationError(null);
      },
      (err) => {
        console.warn(`Geolocation error: ${err.message}`);
        setLocationError('Could not get your location. Route suggestions will be based on general traffic data.');
        setUserLocation(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  const handleFetchRoute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setRouteSuggestion(null);
    setGroundingSources([]);

    try {
      const response = await getFastestRoute(userLocation);
      setRouteSuggestion(response.text);
      if (response.groundingChunks && response.groundingChunks.length > 0) {
        setGroundingSources(response.groundingChunks);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userLocation]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Paris Real-Time Route Planner</h1>
          <p className="text-slate-600 mt-2">Get the fastest commute from DeFence Tour Coupole to 12 Rue Léonard de Vinci.</p>
        </header>

        <main className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
          {locationError && !userLocation && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
              <p className="font-bold">Location Warning</p>
              <p>{locationError}</p>
            </div>
          )}
          
          <div className="flex flex-col items-center">
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorDisplay message={error} />
            ) : routeSuggestion ? (
              <RouteCard 
                suggestion={routeSuggestion} 
                sources={groundingSources}
                mapsReady={mapsScriptStatus === ScriptStatus.READY}
                mapsError={mapsScriptStatus === ScriptStatus.ERROR}
              />
            ) : (
               <div className="text-center text-slate-500">
                  <p>Click the button below to get the latest real-time route suggestion.</p>
              </div>
            )}
          </div>
        </main>
        
        <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 border-t border-slate-200">
          <div className="w-full max-w-2xl mx-auto">
            <button
              onClick={handleFetchRoute}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? 'Checking...' : 'Check Fastest Route Now'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;