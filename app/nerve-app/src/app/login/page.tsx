"use client"
import { login, signup } from './actions';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

export default function LoginPage() {
	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
		email: "",
		password: "",
		},
	})
 
//   // 2. Define a submit handler.
//   function onSubmit(values: z.infer<typeof formSchema>) {
//     // Do something with the form values.
//     // ✅ This will be type-safe and validated.
//     console.log(values)
//   }

return (
	<div className="flex justify-center items-center h-screen border-3 border-red-600">
		<main>
			<Form {...form}>
				<form className="space-y-4 space-x-2">
				{/* <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8"> */}

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
							<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="example@gmail.com" {...field} />
								</FormControl>
								<FormMessage />
									<FormDescription>
										{/* This is your user email. */}
									</FormDescription>
							</FormItem>
						)}
					/>
					<FormField 
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type='password' placeholder='123abc' {...field} />
								</FormControl>
								<FormDescription>
									{/* This is your password. */}
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className='flex justify-center align-center gap-4'>
						<Button formAction={login}>Log In</Button>
						<Button formAction={signup}>Sign Up</Button>
					</div>
				</form>
			</Form>
		</main>
	</div>
  )
}