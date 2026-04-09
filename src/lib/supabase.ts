import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from localStorage or environment variables
const getSupabaseConfig = () => {
  let localUrl = localStorage.getItem('TITON_SUPABASE_URL');
  const localKey = localStorage.getItem('TITON_SUPABASE_ANON_KEY');
  
  // If the stored URL is a dashboard URL, ignore it
  if (localUrl?.includes('supabase.com/dashboard/project')) {
    localStorage.removeItem('TITON_SUPABASE_URL');
    localUrl = null;
  }
  
  return {
    url: localUrl || import.meta.env.VITE_SUPABASE_URL || '',
    key: localKey || import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  };
};

const config = getSupabaseConfig();

// Use placeholders to prevent the createClient from throwing an immediate error
// which causes the "white blank page" crash.
const supabaseUrl = config.url || 'https://placeholder.supabase.co';
const supabaseAnonKey = config.key || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Global flag to check if we are actually connected
export const isSupabaseConfigured = !!config.url && !!config.key;

/**
 * Helper to update credentials at runtime
 */
export const updateSupabaseConfig = (url: string, key: string) => {
  localStorage.setItem('TITON_SUPABASE_URL', url);
  localStorage.setItem('TITON_SUPABASE_ANON_KEY', key);
  window.location.reload(); // Reload to apply new client
};
