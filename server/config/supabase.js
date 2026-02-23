// Server-side Supabase client configuration with service key
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables in server');
}

// This is the admin client - never expose this to the frontend
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
