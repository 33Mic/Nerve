import Link from "next/link";
import styles from "../page.module.css"
import challenges from "./challenges.json"

export default function Page() {
	const genChallenge = (numChallenges: number) => {
		const chNum: number =  Math.floor(Math.random() * numChallenges);
		return challenges[`${chNum}`]["text"];
	};

	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<h1>Your challenge is:</h1>
				<h2 id="challenge">{genChallenge(challenges.length)}</h2>
				<Link href="/"> 
					{/*Camera Button*/}
					<button className={styles.button}>Camera</button>
				</Link>
				<Link href="/"> 
					{/*Bail Button*/}
					<button className={styles.button}>Bail</button>
				</Link>
			</main>
		</div>
	)
}