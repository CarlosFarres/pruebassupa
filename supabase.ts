import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ujrvwzdfzvrajdkhnkwl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqcnZ3emRmenZyYWpka2hua3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ0MDExNzEsImV4cCI6MjAyOTk3NzE3MX0.3eh33HmcFlObihfNo7lQirThit8ivNnuuz5GboHmirw';


export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
