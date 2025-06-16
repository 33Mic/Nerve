'use server'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient } from '@/utils/supabase/server'
import { RefObject } from 'react';

export async function uploadScreenshot({ imgSrc }: { imgSrc: string }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  // Get user details
  const { data: userDetails } = await supabase.from('users').select('*').eq('user_id', userId).single();
  if (!userDetails) throw new Error('User details not found');

  // Get challenge
  const { data: challenge } = await supabase.from('challenges').select().eq('chal_id', userDetails.cur_chal_id).single();
  if (!challenge) throw new Error('Challenge not found');

  // Convert base64 to Blob (on the server, use Buffer)
  const blob = base64toBlob(imgSrc);

  const fileName = `${userId}/${userDetails.cur_chal_id}/${new Date().toISOString()}.png`;

  // Upload to Supabase Storage
  const { error } = await supabase.storage.from('images').upload(fileName, blob, {
    contentType: 'image/png',
  });
  if (error) throw error;

  // Get public URL
  const { data: publicUrlData } = await supabase.storage.from('images').getPublicUrl(fileName);

  // Update challenge
  await supabase.from('challenges').update({ chal_complete: true, chal_vid_url: publicUrlData.publicUrl }).eq('chal_id', challenge.chal_id);

  return { url: publicUrlData.publicUrl };
}

export async function uploadVideo({ recordedChunks }: { recordedChunks: RefObject<Blob[]>}) {
	const supabase = await createClient();

	const { data: { user } } = await supabase.auth.getUser();
	const userId = user?.id;

	// Get user details
	const { data: userDetails } = await supabase.from('users').select('*').eq('user_id', userId).single();
	if (!userDetails) throw new Error('User details not found');

	// Get challenge
	const { data: challenge } = await supabase.from('challenges').select().eq('chal_id', userDetails.cur_chal_id).single();
	if (!challenge) throw new Error('Challenge not found');

	const fileName = `${userId}/${userDetails.cur_chal_id}/${new Date().toISOString()}.webm`;;
	const recordedBlob = new Blob(recordedChunks.current, { type: 'video/webm' });

	// Upload to the 'videos' bucket
	const {error} = await supabase.storage.from('videos').upload(fileName, recordedBlob, {
		contentType: 'video/webm',
	});
	if (error) throw error;
	
	// Retrieve the URL
	const { data: publicUrlData } = await supabase.storage.from('images').getPublicUrl(fileName);

	// Connect the user's challenge
	await supabase.from('challenges').update({ chal_complete: true, chal_vid_url: publicUrlData.publicUrl}).eq('chal_id', challenge?.chal_id);

	return { url: publicUrlData.publicUrl };
}

function base64toBlob(base64Data: any) {
	const byteCharacters = atob(base64Data.split(",")[1]);
	const arrayBuffer = new ArrayBuffer(byteCharacters.length);
	const byteArray = new Uint8Array(arrayBuffer);

	for( let i = 0; i < byteCharacters.length; i++) {
		byteArray[i] = byteCharacters.charCodeAt(i);
	}

	return new Blob([arrayBuffer], { type: "image/png"}); // Specify the image type here
}