import { useState, useCallback } from 'react';
import { sopService, SOPDetails, SOPLog } from '@/services/sopService';

/**
 * Custom hook to manage SOP performance data.
 */
export const useSOP = (sopId?: string) => {
  const [details, setDetails] = useState<SOPDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await sopService.getSOPDetails(id);
      setDetails(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch SOP details');
    } finally {
      setLoading(false);
    }
  }, []);

  const addLog = async (timeTaken: number, output: number, errors: number) => {
    if (!sopId) return;
    setLoading(true);
    setError(null);
    try {
      await sopService.insertLog(sopId, timeTaken, output, errors);
      await fetchDetails(sopId); // Refresh data
    } catch (err: any) {
      setError(err.message || 'Failed to add log');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    details,
    loading,
    error,
    fetchDetails,
    addLog,
  };
};
