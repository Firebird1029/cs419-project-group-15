
import createClient from "@/utils/supabase/client";

// export default async function GetGames() {
//   const supabase = createClient();
//   const { data: allGames, error, status} = await supabase
//   .from("games")
//   .select("*, profiles!inner(username)");

//   if (error) {
//     console.log("COULDN'T GET GAMES")
//   }

//   return ({allGames})
// };

// pages/api/data.js
export default async function handler(req, res) {
    try {
        const supabase = createClient();
        const { data: allGames, error, status} = await supabase.from("games").select("*, profiles!inner(username)");

        if (error) {
            console.log("COULDN'T GET GAMES")
        }
  
        // Return the data to the client
        res.status(200).json(allGames);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    }
  }
  