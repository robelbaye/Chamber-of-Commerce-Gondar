import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://wpbbuquuujspvajuhwqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwYmJ1cXV1dWpzcHZhanVod3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDQ4NzYsImV4cCI6MjA2Njc4MDg3Nn0.7g-EaER5rns1ADfnPSC4BJKNlsCzp1R-z1yvgfNXEO0';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});