import styles from "./page.module.css";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("challenge/");
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Welcome to Nerve-Lite!</h1>
        <Link href="login/">
          <button className={styles.button}>Sign up!</button>
        </Link>
      </main>
    </div>
  );
}
