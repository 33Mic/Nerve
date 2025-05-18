"use client"
import styles from "../page.module.css"
import Webcam from 'react-webcam';
import { useRef, useState } from 'react';
import { Separator } from "@/components/ui/separator";

type Props = {};

export default function Page(props: Props) {
	const webcamRef = useRef<Webcam>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// state
	const [mirrored, setMirrored] = useState<boolean>(false);

	return (
		<div className='flex v-screen'>
			{/* Top division - webcam and canvas */}
			 <div className='relative'>
				<div className='relative h-screen w-full'>
					<Webcam ref={webcamRef} 
					mirrored={mirrored}
					className='h-full w-full object-contain p-2'
					/>
					<canvas ref={canvasRef}
						className="absolute top-0 left-0 h-full w-full object-contain">
					</canvas>
				</div>
			 </div>
			 {/* Bottom division - container for buttons */}
			 <div className="flex flex-row flex-1">
				<div className="border-primary/5 border-2 max-w-xs flex flex-col gap-2 justify-between shadow-md rounded-md p-4">
					{/* Middle section */}
					<div className="flex flex-col gap-2">
						<Separator/>
						
						<Separator/>

					</div>

					{/* Bottom Section */}
					<div className="flex flex-col gap-2">
						<Separator/>

					</div>

				</div>
			 </div>
		</div>
	)
}