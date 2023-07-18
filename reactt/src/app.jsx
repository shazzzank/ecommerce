import react from 'react';
import Router from './router.jsx';

function App(){

	function handleClick(){
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		localStorage.removeItem('total');
		localStorage.removeItem('prod');
		localStorage.removeItem('btToken');
	}

	return(
		<div>
			<header>
				<div><h1><a href="/">Ecommerce App</a></h1></div>
				<div>
					<p><a href="/products">Products</a></p>
					<p><a href="/cart">Cart</a></p>
				</div>
			</header>
			<Router/>	
			<footer>
				<div><p>Copyright &copy; <a href="/">Ecommerce App</a></p></div>
					{('token' in localStorage) ? 
					<div>
						<p><a href="/dashboard">Dashboard</a></p>
						<p><a onClick={handleClick} href="/login">Logout</a></p>
					</div> : 
					<div>
						<p><a href="/login">Login</a></p>
						<p><a href="/register">Register</a></p>
					</div>}
			</footer>
		</div>
	);
}

export default App;