import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://joknprahhqdhvdhzmuwl.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impva25wcmFoaHFkaHZkaHptdXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE5NzQ4NzMsImV4cCI6MjAzNzU1MDg3M30.8Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q'

export const supabase = createClient(supabaseUrl, supabaseKey)
