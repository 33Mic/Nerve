// import { logout } from "./logout/actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  // If logged in, redirect to challenge page
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (!(error || !data?.user)) {
    redirect('/core/challenge');
  } else {
	redirect('/login');
  }
}