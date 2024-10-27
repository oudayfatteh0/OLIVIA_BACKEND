const Product = require('../models/products.js');

const generateReference = () => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let reference = '';
	for (let i = 0; i < 10; i++) {
		reference += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return reference;
};

exports.getProducts = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const startIndex = (page - 1) * limit;
		const products = await Product.find().limit(limit).skip(startIndex);
		const total = await Product.countDocuments();
		const totalPages = Math.ceil(total / limit);
		res.status(200).json({ products, totalPages });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.getProductById = async (req, res) => {
	try {
		const { id } = req.params;
		console.log(id);
		const product = await Product.findOne({ _id: id });
		if (!product) {
			res.status(404).json({ message: 'Product not found' });
		} else {
			res.status(200).json(product);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.createProduct = async (req, res) => {
	try {
		const reference = generateReference();
		const newProduct = new Product({
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			image: req.body.image,
			reference: reference,
		});
		await newProduct.save();
		res.status(201).json({ message: 'Product created successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.updateProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, description, price, image } = req.body;
		const product = await Product.findByIdAndUpdate(id, { name, description, price, image });
		if (!product) {
			res.status(404).json({ message: 'Product not found' });
		} else {
			res.status(200).json({ message: 'Product updated successfully' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await Product.findByIdAndDelete(id);
		if (!product) {
			res.status(404).json({ message: 'Product not found' });
		} else {
			res.status(200).json({ message: 'Product deleted successfully' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};
