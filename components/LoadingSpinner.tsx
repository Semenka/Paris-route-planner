
import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-slate-600 font-semibold">Checking real-time traffic data...</p>
    <p className="mt-1 text-sm text-slate-500">This may take a moment.</p>
  </div>
);

export default LoadingSpinner;
