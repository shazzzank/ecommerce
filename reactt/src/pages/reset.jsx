import React, {useState, useRef} from "react";
import axios from 'axios';
import Toast from '../toast.jsx';

function Reset() {
	const toastRef = useRef();
	const [currentStep, setCurrentStep] = useState(1);
	const [object, setObject] = useState({email: '', otp: '', password: '', password1: ''});

	function onchange(e) {
		setObject(prev=>({...prev, [e.target.name]: e.target.value}));
	}

	function handleClick1() {
		toastRef.current.setMessage('Please wait..');
		axios.post('/node/generate-otp',{email: object.email}).then(res=>{
			((res.data.message).includes('success')) ?
			 setCurrentStep(2) : 
			 toastRef.current.setMessage(res.data.message);
		});
	}

	function handleClick2() {
		axios.post('/node/verify-otp',{otp: object.otp}).then(res=>{
			((res.data.message).includes('success')) ?
			 setCurrentStep(3) : 
			 toastRef.current.setMessage(res.data.message);
		});
	}

	function handleClick3() {
		if (!object.password || !object.password1) 
		  toastRef.current.setMessage('All fields are mandatory');
		else if (object.password === object.password1) {
			axios.post('/node/reset-password', { email: object.email, password: object.password })
		    .then(res => {
		      const message = res.data.message;
		      toastRef.current.setMessage(message.includes('success') ? 'Passwords changed successfully' : message);
		    });
		}
		else toastRef.current.setMessage('Passwords do not match');
	}

	return (
		<div className="reset">
			<Toast ref={toastRef} redirect="/login"/>
		  	<h2>Reset your password</h2>

			{currentStep === 1 && (
			<>
			  <p>We will send you an email to reset your password.</p>
			  <div className="form-box">
			    <label htmlFor="email">Email Address</label>
			    <input name="email" type="email" onChange={onchange} value={object.email}/>
			    <button onClick={handleClick1}>Send OTP</button>
			  </div>
			</>
			)}

			{currentStep === 2 && (
			<>
			  <p>We have sent you an OTP. Please enter it below.</p>
			  <div className="form-box">
			    <label htmlFor="otp">OTP</label>
			    <input name="otp" type="text" onChange={onchange} value={object.otp}/>
			    <button onClick={handleClick2}>Submit</button>
			  </div>
			</>
			)}

			{currentStep === 3 && (
			<>
			  <p>Please create a new password for your account.</p>
			  <div className="form-box">
			    <label htmlFor="password">New Password</label>
			    <input name="password" type="password" onChange={onchange} value={object.password}/>
			    <label htmlFor="password1">Confirm Password</label>
			    <input name="password1" type="password" onChange={onchange} value={object.password1}/>
			    <button onClick={handleClick3}>Reset Password</button>
			  </div>
			</>
			)}
		</div>
	);
}

export default Reset;
