const {userModel,categoryModel,productModel,orderModel} = require('./db.jsx');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const express = require('express');
const slugify = require('slugify');
const bcrypt = require('bcrypt');
const cors = require('cors');
const braintree = require('braintree');
const path = require('path');
const dotenv = require('dotenv');
const app = express();

const register = async (req, res) => {
	const {name, email, password, address} = req.body;
	const hash = await bcrypt.hash(password, 10);
	const find = await userModel.findOne({email});
	if(!name|| !email|| !password|| !address)
		return res.send({message: 'All fields are mandatory'});
	if(!find){
		new userModel({name: name, email: email, password: hash, address: address}).save();
		return res.send({message: 'User registered successfully'})
	}
	res.send({message: 'User already registered'});
}

const login = async (req, res) => {
	const {email, password} = req.body;
	const find =  await userModel.findOne({email: email});
	const match = await bcrypt.compare(password, find?.password||'');
	const token = await jwt.sign({email: find?.email||''},process.env.JWT_SIGN);
	if(!email|| !password)
		return res.send({message: 'All fields are mandatory'});
	if(find && match)
		return res.send({message: 'Login successful', user: find, token: token});
	res.send({message: 'Incorrect information'});	
}

const generateOTP = async (req, res) => {
	const email = req.body.email;
	const otp = Math.floor(Math.random() * 88889) + 11111;
	const find = await userModel.findOne({email});
	if(find){
	    const smtp = nodemailer.createTransport({
	      host: 'smtp.gmail.com',
	      port: 465,
	      secure: true,
	      auth: {
	        user: process.env.SMTP_USER,
	        pass: process.env.SMTP_PASS
	      }
	    });
		smtp.sendMail({
			from: process.env.SMTP_USER,
			to: email,
			subject: 'Password Reset',
			text: 'Your password reset code: ' + otp
		}, (err, success) => {
			if (success) 
				res.send({message: 'Email sent successfully'});
			else res.send({message: 'Email failed to deliver'});
		});
		await userModel.updateOne({email}, {code: otp});
	} else res.send({message: 'Email is not registered'})
}

const verifyOTP = async (req, res) => {
	const otp = req.body.otp;
	const find = await userModel.findOne({code: otp});
	if(find) res.send({message: 'Code verification successful'});
	else res.send({message: 'Incorrect code'});
}

const resetPassword = async (req, res) => {
	const email = req.body.email;
	const pass = req.body.password;
	const find = await userModel.findOne({email});
	const update = await userModel.updateOne({email}, {password: pass});

	if(find){
		if(update.modifiedCount == 1)
			res.send({message: 'Password updated successfully'});
		else res.send({message: 'You cannot use old password'});

	} else res.send({message: 'Incorrect email'});
}

const checkJWT = (req, res, next) => {
	const token = req.headers.authorization;
	if (token){
		jwt.verify(token, process.env.JWT_SIGN, (err, decoded) => {
			if(!err){
				req.jwtContent = decoded;
				next();
			} 
			else res.send({message: 'JSON Web Token does not match'});
		});
	} else res.send({message: 'Missing JSON Web Token'})
}

const isAdmin = async (req, res, next) => {
	const email = req.jwtContent.email;
	const find = await userModel.findOne({email});
	if(find){
		if(find.role == 1) next();
		else res.send({message: 'User is not admin'});
	}
}

const users = (req, res) =>{
	userModel.find({}).then(find=>res.send({message: find}))
}

const updateUser = (req, res) => {
	const {name, address, email} = req.body;
	if(!name|| !address)
		return res.send({message: 'All fields are mandatory'});
	userModel.findOneAndUpdate({email}, req.body, {new: true}).then(find=>{
		if(find) res.send({message: 'User updated successfully'});
		else res.send({message: 'User does not exist'});
	});
}

const updateUserRole = (req, res) => {
	const {role, userId} = req.body;
	userModel.findOneAndUpdate({_id: userId}, {role: role}, {new: true}).then(find=>{
		if(find) res.send({message: 'User updated successfully'});
		else res.send({message: 'User does not exist'})
	});
}

const category = async (req, res) => {
	const name = req.body.name;
	const find = await categoryModel.findOne({name});
	if(!name) return res.send({message: 'All fields are mandatory'});
	if(find) res.send({name: find.name, slug: find.slug});
	else res.send({message: 'Category does not exist'})
}

const categories = (req, res) => {
	categoryModel.find({})
	.select('-_id -__v')
	.sort({createdAt: -1})
	.then(find=>res.send({category: find}));
}

const createCategory = async (req, res) => {
	const name = req.body.name;
	const object = {name: name, slug: slugify(name)};
	const find = await categoryModel.findOne({name: name});
	if(!name) return res.send({message: 'All fields are mandatory'});
	if(!find){
		new categoryModel(object).save();
		res.send({message: 'Category created successfully'});
	}
	else res.send({message: 'Category already created'});
}

const updateCategory = (req, res) => {
	const oldname = req.body.oldname;
	const object = {...req.body, slug: slugify(req.body.name)};
	if(!oldname) return res.send({message: 'All fields are mandatory'});
	categoryModel.findOneAndUpdate({name: oldname}, object, {new: true})
		.then(find=>{
			if(find) res.send({message: 'Category updated successfully'});
			else res.send({message: 'Category does not exist'})
		});
}

const deleteCategory = (req, res) => {
	const name = req.body.name;
	if(!name) return res.send({message: 'All fields are mandatory'});
	categoryModel.findOneAndDelete({name}).then(find=>{
		if(find) res.send({message: 'Category deleted successfully'});
		else res.send({message: 'Category does not exist'})
	});
}

const product = async (req, res) => {
	const slug = req.query.slug;
	const find = await productModel.findOne({slug});
	if(!slug) return res.send({message: 'All fields are mandatory'});
	if(find) res.send({product: find});
	else res.send({message: 'Product does not exist'})
}

const products = (req, res) => {
	productModel.find({})
	.select('-_id -__v')
	.sort({createdAt: -1})
	.then(find=>res.send({product: find}));
}

const createProduct = async (req, res) => {
	const {name, price, category, quantity, image} = req.body;
	const object = {...req.body, slug: slugify(name)};
	const find = await productModel.findOne({name: name});
	if(!name|| !price|| !category|| !quantity|| !image)
		return res.send({message: 'All fields are mandatory'});
	if(!find){
		new productModel(object).save();
		res.send({message: 'Product created successfully'});
	}
	else res.send({message: 'Product already created'})
}

const updateProduct = (req, res) => {
	const oldname = req.body.oldname;
	const object = {...req.body, slug: slugify(req.body.name)};
	if(!oldname) return res.send({message: 'All fields are mandatory'});
	productModel.findOneAndUpdate({name: oldname}, object, {new: true})
	.then(find=>{
		if(find) res.send({message: 'Product updated successfully'});
		else res.send({message: 'Product does not exist'});
	});
}

const deleteProduct = (req, res) => {
	const name = req.body.name;
	if(!name) return res.send({message: 'All fields are mandatory'});
	productModel.findOneAndDelete({name}).then(find=>{
		if(find) res.send({message: 'Product deleted successfully'});
		else res.send({message: 'Product does not exist'})
	});
}

const braintreeToken = async (req, res) =>{
	const bt = new braintree.BraintreeGateway({
		environment: braintree.Environment.Sandbox,
		merchantId: process.env.BT_MERCHANTID,
		publicKey: process.env.BT_PUBLICKEY,
		privateKey: process.env.BT_PRIVATEKEY
	})

	bt.clientToken.generate({}, (err, result)=>{
		if(err) res.send({message: err});
		else res.send({message: result})
	})
}

const order = (req, res) =>{
	const name = req.body.name;
	orderModel.find({'buyer.name': name}).then(find=>res.send({message: find}))
}

const orders = (req, res) =>{
	orderModel.find({}).then(find=>res.send({message: find}))
}

const createOrder = async (req, res) =>{
	const {nonce, cart, user, total} = req.body;
	const bt = new braintree.BraintreeGateway({
		environment: braintree.Environment.Sandbox,
		merchantId: process.env.BT_MERCHANTID,
		publicKey: process.env.BT_PUBLICKEY,
		privateKey: process.env.BT_PRIVATEKEY
	})
	let transaction = bt.transaction.sale({
		amount: total,
		paymentMethodNonce: nonce,
		options: {submitForSettlement: true}
	}, (err, result)=>{
		if(err) res.send({message: err});
		else {
			new orderModel({
				products: cart,
				payment: result,
				buyer: user
			}).save();
			res.send({message: "Order created successfully!"})
		}
	})
}

const updateOrder = (req, res) => {
	const {status, orderId} = req.body;
	orderModel.findOneAndUpdate({_id: orderId}, {status: status}, {new: true}).then(find=>{
		if(find) res.send({message: 'Order updated successfully'});
		else res.send({message: 'Order does not exist'})
	});
}


app.use(cors());
dotenv.config();
app.use(express.json({limit: '10mb'}));
app.use(express.static(path.join(__dirname, './reactt/build')))
app.post('/node/register', register);
app.post('/node/login', login);
app.post('/node/generate-otp', generateOTP);
app.post('/node/verify-otp', verifyOTP);
app.post('/node/reset-password', resetPassword);
app.get('/node/admin', checkJWT, isAdmin, (req,res)=>res.send({ok: true}));
app.get('/node/user', checkJWT, (req,res)=>res.send({ok: true}));
app.get('/node/users', checkJWT, isAdmin, users);
app.post('/node/update-user', updateUser);
app.post('/node/update-userrole', checkJWT, isAdmin, updateUserRole);
app.get('/node/category', category);
app.get('/node/categories', categories);
app.post('/node/create-category', checkJWT, isAdmin, createCategory);
app.post('/node/update-category', checkJWT, isAdmin, updateCategory);
app.post('/node/delete-category', checkJWT, isAdmin, deleteCategory);
app.get('/node/product', product);
app.get('/node/products', products);
app.post('/node/create-product', checkJWT, isAdmin, createProduct);
app.post('/node/update-product', checkJWT, isAdmin, updateProduct);
app.post('/node/delete-product', checkJWT, isAdmin, deleteProduct);
app.get('/node/braintree-token', braintreeToken);
app.post('/node/order', checkJWT, order)
app.post('/node/orders', checkJWT, isAdmin, orders)
app.post('/node/create-order', checkJWT, createOrder);
app.post('/node/update-order', checkJWT, isAdmin, updateOrder);
app.use('*', (req, res)=>res.sendFile(path.join(__dirname, './reactt/build/index.html')));

app.listen(8080, ()=>console.log('Server Kicking'));