import {useState, useRef, useEffect} from 'react';
import Braintree from 'braintree-web-drop-in-react';
import Toast from '../toast.jsx';
import axios from 'axios';

function Checkout(){
	const btToken = localStorage.getItem('btToken');
	const token = localStorage.getItem('token');
	const cart = JSON.parse(localStorage.getItem('prod'));
	const user = JSON.parse(localStorage.getItem('user'));
	const total = localStorage.getItem('total');
	const [x, setX] = useState();
	const toastRef = useRef();
	function handleClick(){
		x.requestPaymentMethod().then(({nonce})=>{
			const object1 = {nonce, cart, user, total}
			const object2 = {headers: {'Authorization': token}};
			axios.post('/node/create-order', object1, object2).then(res=>toastRef.current.setMessage(res.data.message))
		});
	}

	return(
		<div className="checkout">
			<Toast ref={toastRef} redirect="/dashboard" />
			<h2>Checkout</h2>
			<Braintree  options={{authorization: btToken, paypal: {flow: 'vault'} }} onInstance={instance=>setX(instance)} />
			<button onClick={handleClick}>Checkout</button>
		</div>
	);
}

export default Checkout;