"use server";

import axios from "axios";
import createClient from "@/utils/supabase/server";

// Create an axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  withCredentials: true,
});

// Supabase
const supabase = createClient();

// Get Game
async function getGame(gameUrlTag) {
  try {
    const res = await api.get(`/g/${gameUrlTag}`);
    if (res.data && res.data.success) {
      // successful data
      return res.data;
    }
    throw new Error("Failed to retrieve game. Please try again.");
  } catch (e) {
    return {
      success: false,
      message: e.response ? e.response.data.message : e.message || e,
    };
  }
}

// Create Game
async function createGame(gameDetails) {
  try {
    const data = {
      session: await supabase.auth.getSession(),
      user_id: (await supabase.auth.getUser()).data.user.id,
      ...gameDetails,
    };
    const res = await api.post("/g/create", data, {
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.data && res.data.success) {
      // successful data
      return res.data;
    }
    throw new Error("Failed to create game. Please try again.");
  } catch (e) {
    return {
      success: false,
      message: e.response ? e.response.data.message : e.message || e,
    };
  }
}

// export the service
export { getGame, createGame };
