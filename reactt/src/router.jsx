import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/home.jsx';
import Register from './pages/register.jsx';
import Login from './pages/login.jsx';
import Reset from './pages/reset.jsx';
import Products from './pages/products.jsx';
import Product from './pages/product.jsx';
import Cart from './pages/cart.jsx';
import Checkout from './pages/checkout.jsx';
import Error from './pages/error.jsx';
import Private from './private.jsx';


function Router(){
	return(
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home/>}/>
				<Route path="/register" element={<Register/>}/>
				<Route path="/login" element={<Login/>}/>
				<Route path="/reset" element={<Reset/>}/>
				<Route path="/products" element={<Products/>}/>
				<Route path="/product/:slug" element={<Product/>}/>
				<Route path="/cart" element={<Cart/>}/>
				<Route path="/checkout" element={<Checkout/>}/>
				<Route path="*" element={<Error/>}/>
				<Route path="/dashboard" element={<Private/>}/>
			</Routes>
		</BrowserRouter>
	);
}

export default Router;