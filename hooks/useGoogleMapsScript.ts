import { useState, useEffect } from 'react';

export enum ScriptStatus {
  IDLE,
  LOADING,
  READY,
  ERROR,
}

let globalStatus = ScriptStatus.IDLE;

// FIX: Export 'useGoogleMapsScript' to resolve the import error in App.tsx.
export const useGoogleMapsScript = () => {
  const [status, setStatus] = useState<ScriptStatus>(globalStatus);

  useEffect(() => {
    if (globalStatus === ScriptStatus.READY || globalStatus === ScriptStatus.LOADING) {
      setStatus(globalStatus);
      return;
    }

    globalStatus = ScriptStatus.LOADING;
    setStatus(ScriptStatus.LOADING);

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      globalStatus = ScriptStatus.ERROR;
      setStatus(ScriptStatus.ERROR);
      console.error("API_KEY environment variable is not set for Google Maps.");
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=directions`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      globalStatus = ScriptStatus.READY;
      setStatus(ScriptStatus.READY);
    };

    script.onerror = () => {
      globalStatus = ScriptStatus.ERROR;
      setStatus(ScriptStatus.ERROR);
    };

    document.head.appendChild(script);

  }, []);

  return status;
};
