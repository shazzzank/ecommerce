import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Toast from '../toast.jsx';

function Adashboard() {
    const [content, setContent] = useState();

    function handleClick(e) {
        const option = e.target.id;
        setContent(option);
    }

    return (
        <div className="dashboard">
			<h2>Admin Dashboard</h2>
			<div className="two-column">
				<div className="column1">
					<a id="category" onClick={handleClick}>Create Category →</a>
					<a id="product" onClick={handleClick}>Create Product →</a>
					<a id="orders" onClick={handleClick}>Orders →</a>
					<a id="users" onClick={handleClick}>Users →</a>
				</div>
				<div className="column2">
					{
						(content == 'category') ? <Category/> :
						(content == 'product') ? <Product/> :
						(content == 'orders') ? <Orders/> :
						(content == 'users') ? <Users/> : null
					}
				</div>
			</div>
		</div>
    );
}

function Category() {
    const toastRef = useRef();
    const [boolean, setBoolean] = useState(true);
    const [categories, setCategories] = useState([]);
    const [oldCategory, setOldCategory] = useState();
    const [input, setInput] = useState();

    useEffect(() => {
        axios.get('/node/categories').then(find => setCategories(find.data.category));
    }, []);

    function handleChange(e) {
        setInput(e.target.value);
    }

    function create() {
        const object = { name: input };
        const header = { 'Authorization': localStorage.getItem('token') };
        axios.post('/node/create-category', object, { headers: header }).then(res => toastRef.current.setMessage(res.data.message));
    }

    function update() {
        const object = { name: input, oldname: oldCategory };
        const header = { 'Authorization': localStorage.getItem('token') };
        axios.post('/node/update-category', object, { headers: header }).then(res => toastRef.current.setMessage(res.data.message));
        setBoolean(true);
    }

    function edit(e) {
        setInput(e.target.id);
        setOldCategory(e.target.id);
        setBoolean(false);
    }

    function delete_(e) {
        const object = { name: e.target.id };
        const header = { 'Authorization': localStorage.getItem('token') };
        axios.post('/node/delete-category', object, { headers: header }).then(res => toastRef.current.setMessage(res.data.message));
    }

    return (
        <div className="category">
			<Toast ref={toastRef} redirect="/dashboard"/>
			<h3>Category</h3>
			<div className="category-create">
				<input type="text" name="category" placeholder="New Category" onChange={handleChange} value={input}/>
				<button onClick={boolean ? create : update}>{boolean ? 'Create' : 'Update'}</button>
			</div>
			<div className="categories-head">
				<h4>Name</h4>
				<h4>Action</h4>
			</div>
			{categories.map(find=>(
			<div className="categories-body">
				<p>{find.name}</p>
				<div className="categories categories-button">
					<a id={find.name} onClick={edit}>Edit</a>
					<a id={find.name} onClick={delete_}>Delete</a>
				</div>
			</div>
			))}
		</div>
    );
}

function Product() {
    const toast = useRef();
    const image = useRef(null); 
    const [boolean, setBoolean] = useState(true);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [oldProduct, setOldProduct] = useState();
    const [input, setInput] = useState({});
    const [count, setCount] = useState(1);

    useEffect(() => {
        axios.get('/node/products', {params: {count: count}}).then(find => setProducts(find.data.product));
        axios.get('/node/categories').then(find => setCategories(find.data.category));
    }, []);

    function handleChange(e) {
    	const {name, value, classList, files} = e.target;
    	if(name == 'category'){
    		const {category, ...rest} = input;
    		const isActive = classList.toggle('active');
    		setInput(prev=>({...rest, ...(isActive && {[name]: value})}));
    	}
    	else if(name == 'image'){
    		const reader = new FileReader();
    		reader.onload = () => 
    			setInput(prev=>({...prev, [name]: reader.result}));
    		reader.readAsDataURL(files[0]);
    	}
    	else setInput(prev=>({...prev, [name]: value}));
    }

    function create() {
        axios.post('/node/create-product', input, {headers: {'Authorization': localStorage.getItem('token')}}).then(res=>toast.current.setMessage(res.data.message));
    }

    function update() {
    	axios.post('/node/update-product', { ...input, oldname: oldProduct }, {headers: {'Authorization': localStorage.getItem('token')}}).then(res=>toast.current.setMessage(res.data.message));
    }

    function edit(e) {
    	categories.forEach((obj)=>document.querySelector(`.product-create input[name="category"][value="${obj.name}"]`).classList.remove('active'));
        axios.get('/node/product', {params: {slug: e.target.id}})
        .then(find=>{
        	setInput(find.data.product);
        	document.querySelector(`.product-create input[name="category"][value="${find.data.product.category}"]`).classList.add('active');
			setOldProduct(find.data.product.name)
    	});
		setBoolean(false);
    }

    function delete_(e) {
    	const object = {name: e.target.id}
    	axios.post('/node/delete-product', object, {headers: {'Authorization': localStorage.getItem('token')}}).then(res=>toast.current.setMessage(res.data.message))
    }

    return (
        <div className="product">
			<Toast ref={toast} redirect="/dashboard"/>
			<h3>Product</h3>
			<div className="product-create">
				<label htmlFor="name">Name</label>
				<input name="name"
						type="text"
						onChange={handleChange}
						value={input.name} />
				<label htmlFor="price">Price</label>
				<input name="price"
						type="number"
						onChange={handleChange}
						value={input.price} />
				<label htmlFor="category">Category</label>
				{categories.map(find=>
					<input name="category"
						value={find.name}
						onClick={handleChange} />
				)}
				<label htmlFor="quantity">Quantity</label>
				<input name="quantity"
						type="number"
						onChange={handleChange}
						value={input.quantity} />
				<label htmlFor="image">Image</label>
				<a onClick={()=>image.current.click()}>Select Image</a>
				{input.image ? <img src={input.image} alt="product-image"/>
				 : <span>No file selected</span>}
				<input name="image"
						type="file"
						accept="image/*" 
						onChange={handleChange}
						ref={image}/>
				<label htmlFor="shipping">Shipping</label>
				<input name="shipping"
						type="number"
						onChange={handleChange}
						value={input.shipping} />
				<button onClick={boolean ? create : update}>{boolean ? 'Create' : 'Update'}</button>
			</div>
			<div className="product-head">
				<h4>Name</h4>
				<h4>Action</h4>
			</div>
			{products.map(find=>(
				<div className="product-body">
					<div>
						<p>{find.name}</p>
					</div>
					<div className="product-button">
						<a id={find.slug} onClick={edit}>Edit</a>
						<a id={find.name} onClick={delete_}>Delete</a>
					</div>
				</div>
			))}
		</div>
    );
}

function Users() {
	const toastRef = useRef();
	const [users, setUsers] = useState([]);
	const [role, setRole] = useState([0, 1]);

	useEffect(()=>{
		axios.get('/node/users', {headers: {'Authorization': localStorage.getItem('token')}}).then(res=>setUsers(res.data.message));
	}, []);

	function onChange(e){
		const role = e.target.value;
		const userId = e.target.id;
		axios.post('/node/update-userrole', {role, userId}, {headers: {'Authorization': localStorage.getItem('token')}}).then(res=>toastRef.current.setMessage(res.data.message));
	}

    return (
        <div>
        	<Toast ref={toastRef} redirect="/dashboard"/>
        	<h3>Users</h3>
        	{users.map(user=>
        		<div>
        			<h4>User ID: {user._id}</h4>
        			<h4>Name: {user.name}</h4>
        			<h4>Email: {user.email}</h4>
        			<h4>Address: {user.address}</h4>
        			<div className="edit-role">
				    	<label htmlFor="role">Role: </label>
				    	<select id={user._id} name="role" onChange={onChange}>
				    		{role.map(find=><option value={find} selected={find === user.role}>{find}</option>)}
				    	</select>
			    	</div>
        		</div>
        	)}
    	</div>
    );
}

function Orders() {
	const toastRef = useRef();
	const [orders, setOrders] = useState([]);
	const [status, setStatus] = useState(["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"])

	useEffect(()=>{
		const user = JSON.parse(localStorage.getItem('user'));
		axios.post('/node/orders', {name: user.name}, {headers: {'Authorization': localStorage.getItem('token')}}).then(res=>setOrders(res.data.message));
	}, []);

	function onChange(e){
		const status = e.target.value;
		const orderId = e.target.id;
		axios.post('/node/update-order', {status, orderId}, {headers: {'Authorization': localStorage.getItem('token')}}).then(res=>toastRef.current.setMessage(res.data.message));
	}

    return (
        <div>
        	<Toast ref={toastRef} redirect="/dashboard"/>
        	<h3>Orders</h3>
        	{orders.map(order =>
			  <div key={order._id}>
			    <h4>Order ID: {order._id}</h4>
			    <h4>Buyer: {order.buyer.name}</h4>
			    <h4>Address: {order.buyer.address}</h4>
			    <h4>Email: {order.buyer.email}</h4>
			    <h4>Product: {order.products.map(product=>product.name)}</h4>
			    <h4>Amount: {order.payment.transaction.amount}</h4>
			    <div className="edit-order">
			    	<label htmlFor="Status">Status: </label>
			    	<select id={order._id} name="status" onChange={onChange}>
			    		{status.map(find=><option value={find} selected={find === order.status}>{find}</option>)}
			    	</select>
			    </div>
			  </div>
			)}
		</div>
    );
}

export default Adashboard;