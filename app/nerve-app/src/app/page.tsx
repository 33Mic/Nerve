import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { logout } from "./logout/actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  // If logged in, redirect to challenge page
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (!(error || !data?.user)) {
    redirect('/challenge');
  }

  // Otherwise give option to go to login page
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <main>
        <h1 className="text-4xl">Welcome to Nerve v1.0!</h1>
        {/* <Link href="login/"> */}
        <Link href="login/">
          <Button className="font-bold">Sign up!</Button>
        </Link>
        {/* <Button className="font-bold" onClick={logout}> Log Out </Button> */}
      </main>
    </div>
  );
}
