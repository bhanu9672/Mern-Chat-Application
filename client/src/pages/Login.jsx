import { useState } from 'react'
import assets from '../assets/assets'

function Login() {

	const [currState, setCurrState] = useState("Sing up");
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [bio, setBio] = useState("");
	const [isDataSubmitted, SetIsDataSubmitted] = useState(false);

	const onSubmitHandler = (e) => {
		e.preventDefault();
		if( currState === "Sing up" && !isDataSubmitted ) {
			SetIsDataSubmitted(true)
			return;
		}
	}

	return (
		<div
			className="min-h-screen bg-cover flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl"
		>
			{/* ------------------- Left Area ----------------- */}
			<img src={assets.logo_big} alt='' className='w-[min(30vw,250px)]' />

			{/* ------------------- Right Area ----------------- */}
			<form
			onSubmit={ onSubmitHandler }
				className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'
			>
				<h2 className='font-medium text-2xl flex justify-between items-center'>
					{currState}
					{
						isDataSubmitted && <img onClick={ () => SetIsDataSubmitted(false) } src={assets.arrow_icon} alt='' className='w-5 cursor-pointer' />
					}

				</h2>

				{currState === "Sing up" && !isDataSubmitted && (
					<input
						onChange={(e) => setFullName(e.target.value)}
						value={fullName}
						type='text'
						className='p-2 border border-gray-500 rounded-md focus:outline-none'
						placeholder='Full Name'
						required
					/>
				)}

				{!isDataSubmitted && (
					<>
						<input
							onChange={(e) => setEmail(e.target.value)}
							value={email}
							type='email'
							placeholder='Email Address'
							className='p-2 border border-gray-500 rounded-md focus:outline-none focus:right-2 focus:inset-ring-indigo-500'
							required
						/>
						<input
							onChange={(e) => setPassword(e.target.value)}
							value={password}
							type='password'
							placeholder='password'
							className='p-2 border border-gray-500 rounded-md focus:outline-none focus:right-2 focus:inset-ring-indigo-500'
							required
						/>
					</>
				)}

				{currState === "Sing up" && isDataSubmitted && (
					<textarea
						onChange={(e) => setBio(e.target.value)}
						value={bio}
						rows={4}
						className='p-2 border border-gray-500 rounded-md focus:outline-none focus:inset-ring-indigo-500'
						placeholder='provide a short nio....'
						required
					>
					</textarea>
				)}

				<button
					type='submit'
					className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'
				>
					{currState === 'Sing up' ? "Create Account" : "Login Now"}
				</button>

				<div className='flex items-center gap-2 text-sm text-gray-500'>
					<input type='checkbox' />
					<p> Agree to the terms of use & privacy policy </p>
				</div>

				<div className='flex flex-col gap-2'>
					{currState === 'Sing up' ? (
						<p className='text-sm text-gray-600'>
							Already have a Account 
							<span
								onClick={() => { setCurrState("login"); SetIsDataSubmitted(false) }} className='px-2 font-medium text-violet-500 cursor-pointer'
							> Login Here </span>
						</p>
					) : (
						<p className='text-sm text-gray-600'>
							Create an Account
							<span
								onClick={() => { setCurrState("Sing up") }}
								className='px-2 font-medium text-violet-500 cursor-pointer'
							> Click Here </span>
						</p>
					)
					}
				</div>
			</form >
		</div >
	)
}

export default Login