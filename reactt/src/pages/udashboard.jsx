import {useState, useRef, useEffect} from 'react';
import axios from 'axios';
import Toast from '../toast.jsx';

function Udashboard() {
    const [content, setContent] = useState();

    function handleClick(e) {
        const option = e.target.id;
        setContent(option);
    }

    return (
        <div className="dashboard">
			<h2>User Dashboard</h2>
			<div className="two-column">
				<div className="column1">
					<a id="orders" onClick={handleClick}>Orders →</a>
					<a id="profile" onClick={handleClick}>Profile →</a>
				</div>
				<div className="column2">
					{
						(content == 'orders') ? <Orders/> :
						(content == 'profile') ? <Profile/> : null
					}
				</div>
			</div>
		</div>
    );
}

function Orders() {
	const [orders, setOrders] = useState([]);
	useEffect(()=>{
		const user = JSON.parse(localStorage.getItem('user'));
		axios.post('/node/order', {name: user.name}, {headers: {'Authorization': localStorage.getItem('token')}}).then(res=>setOrders(res.data.message));
	}, []);
    return (
        <div>
        	<h2>Orders</h2>
        	{orders.map(order => (
			  <div key={order._id}>
			    <h3>Order ID: {order._id}</h3>
			    <h4>Product: {order.products.map(product=>product.name)}</h4>
			    <h4>Amount: {order.payment.transaction.amount}</h4>
			    <h4>Status: {order.status}</h4>
			  </div>
			))}
		</div>
    );
}


function Profile() {
    const toastRef = useRef();
    const [user, setUser] = useState(()=>JSON.parse(localStorage.getItem('user')));

    function handleChange(e){
    	setUser(prev=>({...prev, [e.target.name]: e.target.value}));
    }

	function handleClick(){
		axios.post('/node/update-user', user).then(res=>toastRef.current.setMessage(res.data.message));
		localStorage.setItem('user', JSON.stringify(user));
	}

    return (
        <div>
        	<Toast ref={toastRef} redirect="/dashboard"/>
			<input name="name"
					type="text" 
					placeholder="Name" 
					value={user.name}
					onChange={handleChange}/>
			<input name="email"
					type="text" 
					placeholder="Email" 
					value={user.email}
					onChange={handleChange} disabled/>
			<input name="address"
					type="text" 
					placeholder="Address" 
					value={user.address}
					onChange={handleChange}/>
			<button onClick={handleClick}>Update</button>
		</div>
    );
}

export default Udashboard;