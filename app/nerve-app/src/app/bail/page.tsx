import { createClient } from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export default async function Bail() {
	// This is a temporary solution
	// TODO: We can handle this "bail" thing in the /challenge route
	// by converting that to a client component and using server actions.
	// see here: https://www.youtube.com/watch?v=sRoHOnaYh9c

	const supabase = await createClient();
	const { data: { user }} = await supabase.auth.getUser();
	const {data: userDetails, error: selectErr } = await supabase.from('users').select('*').eq('user_id', user?.id).single();
	const { data: challenge } = await supabase.from('challenges').select().eq('chal_id', userDetails.cur_chal_id).single();
	
	function handleFunction(error : PostgrestError | Error | null) {
		if (error) {
			console.error(error);
		} else {
			console.log(userDetails);
		}
	}
	await handleFunction(selectErr);
	const { error: updateErr } =  await supabase.from('users').update({ user_bailed: true}).eq('user_id', user?.id);
	await handleFunction(updateErr);

	// TODO: check against timestamp, if user's current time is past the current challenge end date,
	if(new Date(challenge.chal_end_time).getTime() < new Date().getTime()) {
		// delete the challenge
		await supabase.from('challenges').delete().eq('chal_id', userDetails.cur_chal_id);
		// set user cur_challenge_id to NULL and reset the bail
		await supabase.from('users').update({ user_bailed: false, cur_chal_id: null}).eq('user_id', user?.id);

		redirect('../challenge');
		console.log('Unbailed a user');
	}
	

	return (
		<div className="flex justify-center items-center h-screen border-3 border-red-600">
			<main>
				<p>The user has bailed</p>
				<p>New challenges will not be accessible until tomorrow</p>
			</main>
	 	</div>
	)
}