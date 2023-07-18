import {useState, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import Toast from '../toast.jsx';

function Product(){
	const {slug} = useParams();
	const [prod, setProd] = useState([]);
	const [allProd, setAllProd] = useState([]);
    const [filteredProds, setFilteredProds] = useState([]);
    const toastRef = useRef();

	useEffect(() => {
        axios.get('/node/product', {params: {slug: slug}}).then(res=>setProd(res.data.product));
        axios.get('/node/products').then(res=>setAllProd(res.data.product));
    }, [slug]);

	useEffect(() => {
    	setFilteredProds(allProd.filter(find=>prod.category == find.category));
	  }, [prod, allProd]);

	function addToCart(product){
		const storedProd = JSON.parse(localStorage.getItem('prod')) || [];
	    storedProd.push(product);
	    localStorage.setItem('prod', JSON.stringify(storedProd));
	    toastRef.current.setMessage("Added to cart successfully!");
	}

	return(
		<div className="products">
			<Toast ref={toastRef} redirect="/cart"/>
			<div className="product-detail">
				<h2>{prod.name}</h2>
				<div>
					<img src={prod.image} alt="product-image"/>
					<h3>Price: ${prod.price}</h3>
					<h3>Category: {prod.category}</h3>
					<a onClick={()=>addToCart(prod)}>Add to Cart</a>
				</div>	
			</div>
			<h2>More products from {prod.category}</h2>
			<div className="products-container">
				{filteredProds.map(find=>
					<a href={`/product/${find.slug}`}>
	                    <div className="product-container">
	    					<img src={find.image} alt="product-image"/>
	    					<p>{find.name}</p>
	    					<p>${find.price}</p>
	                    </div>
					</a>
				)}
			</div>
		</div>
	);
}

export default Product;