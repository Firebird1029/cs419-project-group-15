import { redirect } from "next/navigation";
import Nav from "./Navbar";
import createClient from "@/utils/supabase/server";

export default async function FullNavBar() {
  const supabase = createClient();
  // Ensure user is logged in
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/login");
  }

  return <Nav user={user} />;
}
