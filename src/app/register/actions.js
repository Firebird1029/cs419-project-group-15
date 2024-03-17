// https://supabase.com/docs/guides/auth/server-side/nextjs

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import createClient from "@/utils/supabase/server";

export default async function register({ username, email, password }) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email,
    password,
    options: {
      data: { display_name: username },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
