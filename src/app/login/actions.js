// https://supabase.com/docs/guides/auth/server-side/nextjs

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import createClient from "@/utils/supabase/server";

export default async function login({ email, password }) {
  const supabase = createClient();

  // Validate inputs
  if (!email || !password) {
    return {
      error: {
        message: "Email and password are required",
      },
    };
  }

  const data = {
    email,
    password,
  };

  const { data: authData, error } =
    await supabase.auth.signInWithPassword(data);

  if (error) {
    // Return error to frontend instead of redirecting
    return {
      error: {
        message: error.message,
      },
    };
  }

  // Only redirect on successful login
  revalidatePath("/", "layout");
  redirect("/");

  // This line will never be reached due to redirect, but needed for linting
  return { success: true };
}
