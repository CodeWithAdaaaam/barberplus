import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qdsnfzmcnzhvzuwvjyxi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkc25mem1jbnpodnp1d3ZqeXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0ODA2OTgsImV4cCI6MjA5MzA1NjY5OH0.qCg9MDf2gDvmIYRRTlmsVgkoNploa_2Pkc1atw1F-Sk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)