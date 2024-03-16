"use server";

import axios from "axios";
import createClient from "@/utils/supabase/server";

// Create an axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
    : "http://localhost:3000/api",
  withCredentials: true,
});

// Supabase
const supabase = createClient();

// Get Game
async function getGame(gameUrlTag) {
  console.log(1);
  try {
    const res = await api.get(`/g/${gameUrlTag}`);
    console.log(2);
    if (res.data && res.data.success) {
      // successful data
      console.log(3);
      return res.data;
    }
    console.log(4);
    throw new Error("Failed to retrieve game. Please try again.");
  } catch (e) {
    console.log(5);
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
