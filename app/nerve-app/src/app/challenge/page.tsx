import Link from "next/link";
import challenges from "./challenges.json"
import { Button } from "@/components/ui/button";

export default function Page() {
	let curChal;
	const genChallenge = (numChallenges: number) => {
		const chNum: number =  Math.floor(Math.random() * numChallenges);
		curChal = challenges[`${chNum}`];
		return curChal["text"];
	};

	return (
		<div className="flex justify-center items-center h-screen border-3 border-red-600">
			<main className="flex flex-col m-auto w-auto gap-[2px] items-center justify-center p-[10px] border-3 border-green-600">
				<h1 className="text-center font-bold">Your challenge is:</h1>
				<h2 className="text-center" id="challenge">{genChallenge(challenges.length)}</h2>
				<Link href={{
					pathname: "../camera",
					query: curChal}}> 
					{/*Camera Button*/}
					<Button>
						Camera
					</Button>
				</Link>
				<Link href="/"> 
					{/*Bail Button ONLY AVAILABLE AFTER AUTHENTICATION*/}
					<Button>
						Bail
					</Button>
				</Link>
			</main>
		</div>
	);
}