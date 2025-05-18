import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("challenge/");
  return (
    <div>
      <main>
        <h1>Welcome to Nerve-Lite!</h1>
        <Link href="login/">
          <Button>Sign up!</Button>
        </Link>
      </main>
    </div>
  );
}
