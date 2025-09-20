// https://supabase.com/docs/guides/auth/server-side/nextjs

"use server";

import createClient from "@/utils/supabase/server";

export default async function register({ username, email, password }) {
  const supabase = createClient();

  try {
    // Check if username is already taken
    const { data: existingProfile, error: usernameError } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .single();

    if (existingProfile) {
      return {
        error: {
          message: `The username "${username}" is already taken. Please choose a different username.`,
          code: "username_taken",
        },
      };
    }

    if (usernameError && usernameError.code !== "PGRST116") {
      // PGRST116 is "not found" which is what we want
      console.error("Error checking username availability:", usernameError);
    }

    // Create the user account
    const { error: signUpError, data: authData } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: username,
        },
      },
    });

    if (signUpError) {
      // Provide user-friendly error messages
      let userMessage = signUpError.message;

      if (signUpError.message === "Database error saving new user") {
        userMessage =
          "There was a database issue during registration. This might be a temporary problem. Please try again in a few minutes.";
      } else if (
        signUpError.message?.includes("already registered") ||
        signUpError.message?.includes("User already registered")
      ) {
        userMessage =
          "An account with this email already exists. Please try signing in instead.";
      } else if (signUpError.status === 500) {
        userMessage =
          "Server error occurred. Please try again later or contact support if this persists.";
      }

      return {
        error: {
          message: userMessage,
          code: signUpError.code || "registration_error",
        },
      };
    }

    // Profile will be created automatically by the database trigger
    return {
      success: true,
      message:
        "Account created successfully! Please check your email to verify your account, then try signing in.",
    };
  } catch (error) {
    return {
      error: {
        message:
          "An unexpected error occurred during registration. Please try again.",
        code: "unexpected_error",
      },
    };
  }
}
