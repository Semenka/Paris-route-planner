
import React from 'react';
import type { GroundingChunk } from '../types';

interface SourceLinkProps {
  source: GroundingChunk;
}

const SourceLink: React.FC<SourceLinkProps> = ({ source }) => {
  const sourceData = source.maps || source.web;

  if (!sourceData || !sourceData.uri) {
    return null;
  }

  const isMapLink = !!source.maps;

  return (
    <li>
      <a
        href={sourceData.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          {isMapLink ? (
             <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          ) : (
             <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0l-1.5-1.5a2 2 0 112.828-2.828l1.5 1.5 3-3zM4.414 11.586a2 2 0 010-2.828l3-3a2 2 0 012.828 0l1.5 1.5a2 2 0 01-2.828 2.828l-1.5-1.5-3 3z" clipRule="evenodd" />
          )}
        </svg>
        <span>{sourceData.title || 'Source Link'}</span>
      </a>
    </li>
  );
};

export default SourceLink;
