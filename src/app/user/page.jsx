
import { redirect } from "next/navigation";
// import createClient from "@/utils/supabase/server";
import UserPage from "./user-page";

export default async function Account() {
  // const supabase = createClient();
  // Ensure user is logged in
  // const {
  //   data: { user },
  //   error,
  // } = await supabase.auth.getUser();
  // if (error || !user) {
  //   redirect("/login");
  // }

  return <UserPage />;
  // return (
  //   <Userpage/>
  // );
}
