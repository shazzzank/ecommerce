import {useState, useRef} from 'react';
import axios from 'axios';
import Toast from '../toast.jsx';

function Login(){
 	const toastRef = useRef();
 	const [object, setObject] = useState({email: '', password: ''});

 	function handleChange(e){
 		setObject(prev=>({...prev, [e.target.name]: e.target.value}));
 	}

 	function handleClick(){
 		axios.post('/node/login', object).then(res=>{
			setObject({email: '', password: ''});
			toastRef.current.setMessage(res.data.message);
			if (res.data.user && res.data.token){
				localStorage.setItem('user', JSON.stringify(res.data.user));
				localStorage.setItem('token', res.data.token);
			}
		});
 	}

	return(
		<div className="login">
			<Toast ref={toastRef} redirect="/" />
			<h2>Login</h2>
			<div className="form-box">
				<label htmlFor="email">Email Address</label>
				<input name="email" type="email" onChange={handleChange} value={object.email}/>
				<label htmlFor="password">Password</label>
				<input name="password" type="password" onChange={handleChange} value={object.password}/>
				<p><a href="/reset">Forgot your password?</a></p>
				<button onClick={handleClick}>Login</button>
			</div>
		</div>
	);
}

export default Login;