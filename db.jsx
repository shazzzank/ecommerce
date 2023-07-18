const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URL);

const user = {
	name: String,
	email: String,
	password: String,
	address: String,
	code: {type: Number, default: 0},
	role: {type: Number, default: 0}
}

const category = {
	name: String,
	slug: {type: String, lowercase: true}
}

const product = {
	name: String,
	image: String,
	category: String,
	slug: {type: String, lowercase: true},
	price: {type: Number, default: 0},
	quantity: {type: Number, default: 0},
	shipping: {type: Number, default: 0}
}

const order = {
	products: [Object],
	payment: Object,
	buyer: Object,
	status: String
}

const userSchema = new mongoose.Schema(user);
const categorySchema = new mongoose.Schema(category);
const productSchema = new mongoose.Schema(product);
const orderSchema = new mongoose.Schema(order);


const userModel = new mongoose.model('user', userSchema);
const categoryModel = new mongoose.model('category', categorySchema);
const productModel = new mongoose.model('product', productSchema);
const orderModel = new mongoose.model('order', orderSchema);


module.exports = {userModel, categoryModel, productModel, orderModel};