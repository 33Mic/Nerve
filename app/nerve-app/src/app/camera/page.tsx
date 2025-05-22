"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import Webcam from 'react-webcam';
import { useEffect, useRef, useState } from 'react';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Camera, SwitchCamera, Video } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";
import { toast } from 'sonner';
// import { useSearchParams } from 'next/navigation';

import { createClient } from '@supabase/supabase-js';

let stopTimeout: any = null;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

export default function Page() {
	// const searchParams = useSearchParams();
	// const challenge = searchParams.get("text");

	const webcamRef = useRef<Webcam>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const recordedChunks = useRef<Blob[]>([]);

	// state
	const [isRecording, setIsRecording] = useState<boolean>(false);
	const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
	const mirrored: boolean = facingMode == "user";

	const videoConstraints = {
		facingMode: facingMode,
		width: {min: 640, ideal: 1920, max:1920},
		height: {min: 480, ideal: 1080, max: 1080},
		frameRate: { ideal: 30, max: 60 }
	};
	
	// initialize the media recorder
	useEffect(() => {
		if(webcamRef && webcamRef.current && webcamRef.current.video) {
			const videoElem = webcamRef.current.video as any;

			const stream =
				typeof videoElem.captureStream === "function"
				? videoElem.captureStream()
				: typeof videoElem.mozCaptureStream === "function"
				? videoElem.mozCaptureStream()
				: null;

			if(stream) {
				mediaRecorderRef.current = new MediaRecorder(stream);

				mediaRecorderRef.current.ondataavailable = (e) => {
					if(e.data.size > 0){
						recordedChunks.current.push(e.data);
					}
				};
				mediaRecorderRef.current.onstart = () => {
					setIsRecording(true);
					recordedChunks.current = [];
				}
				mediaRecorderRef.current.onstop = async () => {
					setIsRecording(false);
					// const videoURL = URL.createObjectURL(recordedBlob);
					
					// const a = document.createElement('a');
					// a.href = videoURL;
					// a.download = `${formatDate(new Date())}.webm`;
					// a.click();
					
					const fileName = `${formatDate(new Date())}.webm`;
					const recordedBlob = new Blob(recordedChunks.current, { type: 'video/webm' })
					const {data, error} = await supabase.storage.from('videos').upload(fileName, recordedBlob, {
						contentType: 'video/webm',
					});

					if (error) {
						console.log(error);
						console.error('Upload error:', error);
						toast('Failed to upload video.');
					} else {
						console.log('Upload success:', data);
						toast('Video uploaded to Supabase Storage');
					}
				}
			}
		}
	}, [webcamRef]);

	// useEffect(() => {
	// 	console.log(challenge);
	// }, [challenge])

	return (
		<div className='flex flex-col h-screen'>
			{/* Top division - webcam*/}
			<div className='relative flex-1 min-h-0'>
				<Webcam 
					muted={true} 
					audio={true} 
					ref={webcamRef} 
					mirrored={mirrored}
					videoConstraints={videoConstraints}
					className='h-full w-full object-cover p-2'
				/>
			</div>
			{/* Bottom division - container for buttons */}
			<div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-row justify-center items-center border-primary/5 border-2 shadow-md rounded-md p-4 bg-background">
				{/* Left Section */}
				<div className="flex flex-row gap-2">
					<ModeToggle />
					<Button variant='outline' size='icon'
						onClick={toggleCamera}>
						<SwitchCamera />
					</Button>
				</div>

				
				<Separator className='mx-2' orientation='vertical'/>

				{/* Right section */}
				<div className="flex flex-row gap-2">
					<Button variant={'outline'} size={'icon'}
					onClick={userPromptScreenshot}>
						<Camera />
					</Button>
					<Button variant={isRecording ? 'destructive' : 'outline'} size={'icon'}
					onClick={userPromptRecord}>
						<Video />
					</Button>
				</div>
			</div>
		</div>
	)

	// handler functions
	async function userPromptScreenshot() {
		// take picture
		if(!webcamRef.current) {
			toast('Camera not found. Please refresh');
			return;
		} 
		const imgSrc = webcamRef.current.getScreenshot();
		if (!imgSrc) {
			toast('Failed to capture screenshot. Please try again');
			return;
		}
		
		const fileName = `${formatDate(new Date())}.png`;
		const blob = base64toBlob(imgSrc);
		const {data, error} = await supabase.storage.from('images').upload(fileName, blob, {
			contentType: 'image/png',
		});

		if (error) {
			console.log(error);
			console.error('Upload error:', error);
			toast('Failed to upload image.');
		} else {
			console.log('Upload success:', data);
			toast('Screenshot uploaded to Supabase Storage');
		}
			

			// // If you wanted to download it
			// const url = URL.createObjectURL(blob);
			// const a = document.createElement('a');
			// a.href = url;
			// a.download = `${formatDate(new Date())}.png`;
			// a.click();
	}

	function userPromptRecord() {
		if(!webcamRef.current) {
			toast('Camera is not found. Please refresh.')
		}

		if(mediaRecorderRef.current?.state == 'recording') {
			// check if recording
				// then stop recording
				// and save to downloads
			mediaRecorderRef.current.requestData();
			clearTimeout(stopTimeout);
			mediaRecorderRef.current.stop();
			toast('Uploading recording');
		} else {
			// if not recording
				// start recording
			startRecording();
		}

	}

	function toggleCamera() {
		setFacingMode(facingMode == "user" ? "environment" : "user");
	}
	
	function startRecording() {
		if(webcamRef.current && mediaRecorderRef.current?.state !== 'recording') {
			mediaRecorderRef.current?.start();

			stopTimeout = setTimeout(() => {
				if(mediaRecorderRef.current?.state === 'recording') {
					mediaRecorderRef.current.requestData();
					mediaRecorderRef.current.stop();
				}
			}, 30000);
		}
	}
}

function formatDate(d: Date) {
	const formattedDate = 
	[
		(d.getMonth() + 1).toString().padStart(2, "0"),
		d.getDate().toString().padStart(2, "0"),
		d.getFullYear(),
	]
	.join("-") + " " +
	[
		d.getHours().toString().padStart(2, "0"),
		d.getMinutes().toString().padStart(2, "0"),
		d.getSeconds().toString().padStart(2, "0"),
	].join("-");
	return formattedDate;
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