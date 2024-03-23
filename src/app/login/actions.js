// https://supabase.com/docs/guides/auth/server-side/nextjs

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import createClient from "@/utils/supabase/server";

export default async function login({ email, password }) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email,
    password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // TODO handle error.message if necessary
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/account");
}
