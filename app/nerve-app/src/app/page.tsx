import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { redirect } from "next/navigation";

export default function Home() {
  // redirect("challenge/");
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <main>
        <h1 className="text-4xl">Welcome to Nerve v1.0!</h1>
        {/* <Link href="login/"> */}
        <Link href="challenge/">

          <Button className="font-bold">Sign up!</Button>
        </Link>
      </main>
    </div>
  );
}
