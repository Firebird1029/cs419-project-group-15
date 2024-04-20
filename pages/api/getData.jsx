// pages/api/getData.js
import createClient from "@/utils/supabase/client";
// import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    // Initialize Supabase client
    // const supabase = createClient('SUPABASE_URL', 'SUPABASE_ANON_KEY');
    
    const supabase = createClient();

    // Fetch data from Supabase
    const { data, error } = await supabase.from("games").select("*, profiles!inner(username)");
    console.log("got here !!!!")
    // data.map(({ id, name, type, url_tag: url, profiles: { username } }) => ( console.log("ablfhsd: ")));

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data from Supabase:', error);
    res.status(500).json({ error: 'Error fetching data from Supabase' });
  }
}
