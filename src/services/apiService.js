"use server";

import axios from "axios";
import createClient from "@/utils/supabase/server";

// TODO refactor to generalize code

// Create Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
    : "http://localhost:3000/api", // Next.js redirects calls to this base URL to the Python server (at http://127.0.0.1:5328) in next.config.mjs
});

// Supabase
const supabase = createClient();

// Get Game via its URL tag
async function getGame(gameUrlTag) {
  try {
    const res = await api.get(`/g/${gameUrlTag}`); // send GET request
    if (res.data && res.data.success) {
      return res.data;
    }
    throw new Error("Failed to retrieve game. Please try again.");
  } catch (e) {
    // manually create & return error response
    return {
      success: false,
      message: e.response ? e.response.data.message : e.message || e,
    };
  }
}

// Create Game
async function createGame(gameDetails) {
  try {
    // game details + Supabase auth info
    const data = {
      session: await supabase.auth.getSession(),
      user_id: (await supabase.auth.getUser()).data.user.id,
      ...gameDetails,
    };

    // send POST request
    const res = await api.post("/g/create", data, {
      timeout: 10000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.data && res.data.success) {
      return res.data;
    }

    throw new Error("Failed to create game. Please try again.");
  } catch (e) {
    // manually create & return error response
    return {
      success: false,
      message: e.response ? e.response.data.message : e.message || e,
    };
  }
}

// Get & Update Scoreboard
async function getScoreboard(gameUrlTag) {
  try {
    const res = await api.get(`/g/${gameUrlTag}/scoreboard`); // send GET request
    if (res.data && res.data.success) {
      return res.data;
    }
    throw new Error("Failed to retrieve scoreboard. Please try again.");
  } catch (e) {
    // manually create & return error response
    return {
      success: false,
      message: e.response ? e.response.data.message : e.message || e,
    };
  }
}

async function updateScoreboard(gameUrlTag, gameId, timer) {
  try {
    // game details + Supabase auth info
    const data = {
      session: await supabase.auth.getSession(),
      user_id: (await supabase.auth.getUser()).data.user.id,
      game_id: gameId,
      details: timer,
    };

    // send POST request
    const res = await api.post(`/g/${gameUrlTag}/scoreboard`, data, {
      timeout: 10000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.data && res.data.success) {
      return res.data;
    }

    throw new Error("Failed to update scoreboard. Please try again.");
  } catch (e) {
    // manually create & return error response
    return {
      success: false,
      message: e.response ? e.response.data.message : e.message || e,
    };
  }
}

// Get & Update Ratings
async function getRatings(gameUrlTag) {
  try {
    const res = await api.get(`/g/${gameUrlTag}/rating`); // send GET request
    if (res.data && res.data.success) {
      return res.data;
    }
    throw new Error("Failed to retrieve ratings. Please try again.");
  } catch (e) {
    // manually create & return error response
    return {
      success: false,
      message: e.response ? e.response.data.message : e.message || e,
    };
  }
}

async function createRating(gameUrlTag, gameId, rating, comment) {
  try {
    // game details + Supabase auth info
    const data = {
      session: await supabase.auth.getSession(),
      user_id: (await supabase.auth.getUser()).data.user.id,
      game_id: gameId,
      rating,
      comment,
    };

    // send POST request
    const res = await api.post(`/g/${gameUrlTag}/rating`, data, {
      timeout: 10000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.data && res.data.success) {
      return res.data;
    }

    throw new Error("Failed to update ratings. Please try again.");
  } catch (e) {
    // manually create & return error response
    return {
      success: false,
      message: e.response ? e.response.data.message : e.message || e,
    };
  }
}

// export the service functions
export {
  getGame,
  createGame,
  getScoreboard,
  updateScoreboard,
  getRatings,
  createRating,
};
