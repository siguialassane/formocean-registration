// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ooqfmytthyqcmlrtpytb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vcWZteXR0aHlxY21scnRweXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3ODI2MzMsImV4cCI6MjA0OTM1ODYzM30.JXXqtctNdBvfES4UVccjwI9Q2SxXyGJgifiBIVJUorQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);