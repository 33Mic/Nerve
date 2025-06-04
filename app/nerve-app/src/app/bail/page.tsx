import { createClient } from "@/utils/supabase/server";

export default async function Bail() {
	// This is a temporary solution
	// TODO: We can handle this "bail" thing in the /challenge route
	// by converting that to a client component and using server actions.
	// see here: https://www.youtube.com/watch?v=sRoHOnaYh9c

	const supabase = await createClient();
	const { data: { user }} = await supabase.auth.getUser();
	const {data: userDetails, error: selectErr } = await supabase.from('users').select('*').eq('userid', user?.id).single();
	
	if (selectErr) {
		console.error(selectErr);
	} else {
		console.log(userDetails);
	}
	const { error: updateErr } =  await supabase.from('users').update({ user_bailed: true}).eq('userid', user?.id);
	
	if(updateErr) {
		console.error(updateErr);
	} else {
		console.log(userDetails);
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