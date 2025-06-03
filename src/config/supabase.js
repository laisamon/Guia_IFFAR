import { createClient } from "@supabase/supabase-js";

//URL no dash do Supabase
const supabaseUrl = 'https://dgbojihnuqfzjdhxiteu.supabase.co';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);