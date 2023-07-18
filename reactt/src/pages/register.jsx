import {useState, useRef} from 'react';
import axios from 'axios';
import Toast from '../toast.jsx';

function Register(){
 	const toastRef = useRef();
	const [object, setObject] = useState({name: '', address: '', email: '', password: ''});

	function onchange(e){
		setObject(prev=>({...prev, [e.target.name]: e.target.value}));
	}

	function onclick(){
		axios.post('/node/register', object)
            .then(res=>{
            	setObject({name: '', address: '', email: '', password: ''});
            	toastRef.current.setMessage(res.data.message);
        });
	}

	return(
		<div className="register">
			<Toast ref={toastRef} redirect="/login"/>
			<h2>Create account</h2>
	    	<p>Please register below to create an account.</p>
			<div className="form-box">
				<label htmlFor="name">Name</label>
				<input name="name" type="text" onChange={onchange} value={object.name} />
				<label htmlFor="address">Address</label>
				<input name="address" type="text" onChange={onchange} value={object.address} />
				<label htmlFor="email">Email Address</label>
				<input name="email" type="email" onChange={onchange} value={object.email} />
				<label htmlFor="password">Password</label>
				<input name="password" type="password" onChange={onchange} value={object.password} />
				<button onClick={onclick}>Create account</button>
			</div>
		</div>
	);
}

export default Register;