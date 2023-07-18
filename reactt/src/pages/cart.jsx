import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Toast from '../toast.jsx';

function Cart() {
    const [prod, setProd] = useState(() => JSON.parse(localStorage.getItem('prod')) || []);
    const user = JSON.parse(localStorage.getItem('user'));
    const [total, setTotal] = useState(0);
    const toastRef = useRef();

    useEffect(() => {
        let count = 0;
        prod.forEach(find => count += find.price);
        setTotal(count);
        localStorage.setItem('total', count);
        axios.get('/node/braintree-token').then(res=>localStorage.setItem('btToken', res.data.message.clientToken));
    }, [prod]);

    function removeFromCart(name) {
        const updatedCart = prod.filter(find => find.name !== name);
        setProd(updatedCart);
        localStorage.setItem('prod', JSON.stringify(updatedCart));
    }

    function checkout(){
    	if(total == 0) 
    		toastRef.current.setMessage("No items in cart");
    	else toastRef.current.setMessage("success!");
    }

    return (
        <div className="cart">
        	<Toast ref={toastRef} redirect="/checkout" />
			<h2>Cart</h2>
			<div className="products">
				<div className="product-detail">
					{prod == ''||null ? <p>No items in cart</p>
					 : prod.map(find=>
	                    <div>
	    					<img src={find.image} alt="product-image"/>
	    					<p>{find.name}</p>
	    					<p>${find.price}</p>
	    					<a onClick={()=>removeFromCart(find.name)}>Remove</a>
	                    </div>
					)}
				</div>
			</div>
			<h3>Total: ${total}</h3>
			{user!==null ? 
				<>
					<p>Deliver to: {user.address}</p>
					<a onClick={checkout}>Checkout</a>
				</> :
				<a href="/login">Login to checkout</a>
			}
		</div>
    )
}

export default Cart;