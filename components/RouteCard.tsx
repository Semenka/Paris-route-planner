import React from 'react';
import SourceLink from './SourceLink';
import type { GroundingChunk } from '../types';
import MapDisplay from './MapDisplay';

interface RouteCardProps {
  suggestion: string;
  sources: GroundingChunk[];
  mapsReady: boolean;
  mapsError: boolean;
}

const RouteCard: React.FC<RouteCardProps> = ({ suggestion, sources, mapsReady, mapsError }) => {
  const paragraphs = suggestion.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="w-full bg-slate-50 rounded-lg p-6 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Fastest Route Suggestion</h2>
      <div className="prose prose-slate max-w-none space-y-4">
        {paragraphs.map((p, index) => (
          <p key={index}>{p}</p>
        ))}
      </div>

      {mapsReady && <MapDisplay />}
      {mapsError && (
        <div className="mt-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg text-center">
          <p className="font-semibold">Could not load the map.</p>
          <p className="text-sm">Please ensure your Google Maps API key is configured correctly.</p>
        </div>
      )}


      {sources && sources.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-slate-600 mb-2">Sources:</h3>
          <ul className="space-y-1">
            {sources.map((source, index) => (
              <SourceLink key={index} source={source} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RouteCard;