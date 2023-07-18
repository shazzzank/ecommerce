import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Products() {
    const [prods, setProds] = useState([]);
    const [cats, setCats] = useState([]);
    const [filteredProds, setFilteredProds] = useState([]);
    const [selectedCat, setSelectedCat] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [currPage, setCurrPage] = useState(1);
    const itemsPerPage = 4;
    const totalPages = Math.ceil(filteredProds.length / itemsPerPage);

    useEffect(() => {
        axios.get('/node/products').then(res => {
            setProds(res.data.product);
            setFilteredProds(res.data.product);
        });
        axios.get('/node/categories').then(res => {
            const categoryNames = res.data.category.map(cat => cat.name);
            setCats(categoryNames);
        });
    }, []);
    useEffect(() => { filterProducts(); }, [selectedCat, searchQuery, priceFilter]);

    function filterProducts() {
        let filtered = prods;
        const [minPrice, maxPrice] = priceFilter.split('-');
        if (selectedCat !== '') 
        	filtered = filtered.filter(prod=>prod.category === selectedCat);
        if (searchQuery !== '') 
        	filtered = filtered.filter(prod=>prod.name.toLowerCase().includes(searchQuery));
        if (priceFilter !== '') 
        	filtered = filtered.filter(prod=>prod.price >= parseInt(minPrice, 10) && prod.price <= parseInt(maxPrice, 10));
        setFilteredProds(filtered);
        setCurrPage(1);
    }

    function getCurrentPageItems() {
        const lastIndex = currPage * itemsPerPage;
        const firstIndex = lastIndex - itemsPerPage;
        return filteredProds.slice(firstIndex, lastIndex);
    }

    function pagination() {
        const buttons = [];
        for (let i = 1; i <= totalPages; i++) {
            buttons.push(<a onClick={()=>setCurrPage(i)} className={i===currPage&&'active'}>{i}</a>);
        }
        return buttons;
    }
    return (
        <div className="products">
        	<h2>Product List</h2>
        	<div className="category">
        		<label htmlFor="category">Filter by Category: </label>
        		<select value={selectedCat} onChange={e=>setSelectedCat(e.target.value)}>
        			<option value="">All</option>
        			{cats.map(cat=>
        				<option value={cat}>{cat}</option>
    				)}
    			</select>
			</div>
			<div className="price">
				<label htmlFor="price">Filter by Price: </label>
				<select value={priceFilter} onChange={e=>setPriceFilter(e.target.value)}>
					<option value="">All</option>
					<option value="0-10">$0 - $10</option>
					<option value="10-50">$10 - $50</option>
					<option value="50-100">$50 - $100</option>
					<option value="100-200">$100 - $200</option>
					<option value="200-99999">Above $200</option>
				</select>
			</div>
			<div className="search">
				<label htmlFor="search">Search: </label>
				<input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value.toLowerCase())}/>
			</div>
			<div className="products-container">
			{getCurrentPageItems().map(prod=>
				<a href={`/product/${prod.slug}`}>
                    <div className="product-container">
    					<img src={prod.image} alt="product-image"/>
    					<p>{prod.name}</p>
    					<h3>${prod.price}</h3>
                    </div>
				</a>
			)}
			</div>
			<div className="pagination">{pagination()}</div>
		</div>
	);
}
export default Products;