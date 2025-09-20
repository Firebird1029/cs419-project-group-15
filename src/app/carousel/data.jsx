import createClient from "@/utils/supabase/client";

export default async function handler(req, res) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("games")
      .select("*, profiles!inner(username)");

    if (error) {
      // console.log("COULDN'T GET GAMES");
      res.status(500).json({ error: "Error fetching data" });
      return;
    }

    // Return the data to the client
    res.status(200).json(data);
  } catch (fetchError) {
    // console.error("Error fetching data:", fetchError);
    res.status(500).json({ error: "Error fetching data" });
  }
}
