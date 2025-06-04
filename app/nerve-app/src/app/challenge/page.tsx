import Link from "next/link";
import challenges from "./challenges.json"
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";


export default async function Page() {

	// Middleware handles the route protection, but this is for user detail fetching
	const supabase = await createClient();

	const { data: { user }} = await supabase.auth.getUser();

	const {data: userDetails, error } = await supabase.from('users').select('*').eq('userid', user?.id).single();
	
	if (error) {
		console.error(error);
	} else {
		console.log(userDetails);
	}

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