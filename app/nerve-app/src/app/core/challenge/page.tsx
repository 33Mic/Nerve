import Link from "next/link";
import challenges from "./challenges.json"
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


export default async function Page() {

	// Middleware handles the route protection, but this is for user detail fetching
	const supabase = await createClient();

	const { data: { user }} = await supabase.auth.getUser();

	const {data: userDetails, error } = await supabase.from('users').select('*').eq('user_id', user?.id).single();
	
	if (error) {
		console.error(error);
	} else {
		console.log(userDetails);
	}

	// if the user is bailed then simply take them to the bail page
	if(userDetails.user_bailed) {
		await redirect("../bail");
	}

	let curChal;
	let challengeText = "";

	const genChallenge = (numChallenges: number) => {
		const chNum: number =  Math.floor(Math.random() * numChallenges);
		curChal = challenges[`${chNum}`];
		return curChal["text"];
	};


	// 1. If the user does not have a challenge, generate a new challenge and add it to the database table
	if(userDetails.cur_chal_id == null) {
		await createUserChallenge();
	} else {
		// 2. If the user has a challenge:
		const { data: challenge } = await supabase.from('challenges').select().eq('chal_id', userDetails.cur_chal_id).single();
		
		// 2a. Check if it is completed
		if(challenge.chal_complete == true) {
			createUserChallenge();
			redirect('./');
		}
		
		// 2b. Check if it has expired
		else if(new Date(challenge.chal_end_time).getTime() < new Date().getTime()) {
			// delete the challenge and add a new one
			await supabase.from('challenges').delete().eq('chal_id', userDetails.cur_chal_id);
			createUserChallenge();

			redirect('./');
		}

		// read them their current challenge
		challengeText = challenge?.chal_text;
	}

	return (
		<div className="flex justify-center items-center h-screen border-3 border-red-600">
			<main className="flex flex-col m-auto w-auto gap-[2px] items-center justify-center p-[10px] border-3 border-green-600">
				<h1 className="text-center font-bold">Your challenge is:</h1>
				<h2 className="text-center" id="challenge">{challengeText}</h2>
				<Link href={{
					pathname: "/core/camera",
					query: curChal}}> 
					{/*Camera Button*/}
					<Button>
						Camera
					</Button>
				</Link>
				<Link href="/core/bail"> 
					<Button>
						Bail
					</Button>
				</Link>
			</main>
		</div>
	);

	async function createUserChallenge() {
		const { data, error } = await supabase.from('challenges').insert({
			user_id: userDetails.user_id,
			chal_end_time: (() => {
				const end = new Date();
				// Set to user's local end of day (23:59:59.999)
				end.setHours(23, 59, 59, 999);
				return end;

			})(),
			chal_text: genChallenge(challenges.length)
		}).select();

		if (error)
			await console.log(error);

		// then link it to the user's current challenge
		await supabase.from('users').update({ 'cur_chal_id': data?.[0]?.chal_id }).eq('user_id', userDetails.user_id);
		await console.log("Added user challenge to DB");

		challengeText = data?.[0]?.chal_text;
	}
}