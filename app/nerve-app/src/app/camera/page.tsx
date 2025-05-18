/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import Webcam from 'react-webcam';
import { useEffect, useRef, useState } from 'react';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Camera, Video } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";
import { toast } from 'sonner';

type Props = {};

let stopTimeout: any = null;

export default function Page(props: Props) {
	const webcamRef = useRef<Webcam>(null);

	// state
	const mirrored = true;
	const [isRecording, setIsRecording] = useState<boolean>(false);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const recordedChunks = useRef<Blob[]>([]);
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
				mediaRecorderRef.current.onstart = (e) => {
					setIsRecording(true);
					recordedChunks.current = [];
				}
				mediaRecorderRef.current.onstop = (e) => {
					setIsRecording(false);
					const recordedBlob = new Blob(recordedChunks.current, { type: 'video/webm' })
					const videoURL = URL.createObjectURL(recordedBlob);

					const a = document.createElement('a');
					a.href = videoURL;
					a.download = `${formatDate(new Date())}.webm`;
					a.click();
				}
			}
		}
	}, [webcamRef]);

	return (
		<div className='flex h-screen'>
			{/* Top division - webcam and canvas */}
			 <div className='relative h-full w-full'>
				<div className='relative h-full w-full'>
					<Webcam ref={webcamRef} 
					mirrored={mirrored}
					className='h-full w-full object-contain p-2'
					/>
				</div>
			 </div>
			 {/* Bottom division - container for buttons */}
			 <div className="flex flex-row flex-1">
				<div className="border-primary/5 border-2 max-w-xs flex flex-col gap-2 justify-between shadow-md rounded-md p-4">
					{/* Top Section */}
					<div className="flex flex-col gap-2">
						<ModeToggle />
						<Separator />
					</div>

					{/* Middle section */}
					<div className="flex flex-col gap-2">
						<Separator className="my-2"/>
						<Button variant={'outline'} size={'icon'}
						onClick={userPromptScreenshot}>
							<Camera />
						</Button>
						<Separator className="my-2"/>
						<Button variant={isRecording ? 'destructive' : 'outline'} size={'icon'}
						onClick={userPromptRecord}>
							<Video />
						</Button>
					</div>

					<Separator className="my-2"/>
					{/* Bottom Section */}
					<div className="flex flex-col gap-2">
						<Separator/>

					</div>

				</div>
			 </div>
		</div>
	)

	// handler functions
	function userPromptScreenshot() {
		// take picture
		if(!webcamRef.current) {
			toast('Camera not found. Please refresh');
		} else {
			const imgSrc = webcamRef.current.getScreenshot();
			console.log(imgSrc);
			const blob = base64toBlob(imgSrc);

			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${formatDate(new Date())}.png`;
			a.click();
		}
		// save it to downloads
		//TODO: We will display it
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
			toast('Recording saved to downloads');
		} else {
			// if not recording
				// start recording
			startRecording();
		}

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