import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lcdumbfnjefhgucqbmnq.supabase.co'
const supabaseKey= import.meta.env.VITE_APP_API_KEY;




export const supabase = createClient(supabaseUrl, supabaseKey)