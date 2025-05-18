import Link from "next/link";
import challenges from "./challenges.json"
import { Button } from "@/components/ui/button";

export default function Page() {
	const genChallenge = (numChallenges: number) => {
		const chNum: number =  Math.floor(Math.random() * numChallenges);
		return challenges[`${chNum}`]["text"];
	};

	return (
		<div className="flex justify-center items-center h-screen border-3 border-red-600">
			<main className="flex flex-col m-auto w-auto gap-[2px] items-center justify-center p-[10px] border-3 border-green-600">
				<h1>Your challenge is:</h1>
				<h2 id="challenge">{genChallenge(challenges.length)}</h2>
				<Link href="../camera"> 
					{/*Camera Button*/}
					<Button size="default">
						Camera
					</Button>
				</Link>
				<Link href="/"> 
					{/*Bail Button*/}
					<Button size="default">
						Bail
					</Button>
				</Link>
			</main>
		</div>
	)
}