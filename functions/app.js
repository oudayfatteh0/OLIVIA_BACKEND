const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const loginController = require('../controllers/login.js');
const settingsController = require('../controllers/webSettings.js');
const usersController = require('../controllers/users.js');
const investmentsController = require('../controllers/investment.js');
const productsController = require('../controllers/products.js');
const mailController = require('../controllers/mail.js');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const router = express.Router();

app.use(express.json());

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
	},
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

router.post('/upload', upload.single('image'), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ message: 'No file uploaded' });
	}

	res.status(200).json({
		message: 'Image uploaded successfully',
		filePath: `/uploads/${req.file.filename}`,
	});
});

let isConnected;

const connectToMongoDB = async () => {
	if (isConnected) {
		return;
	}

	try {
		await mongoose.connect(
			`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.npoov.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
		);
		isConnected = true;
		console.log('MongoDB connected');
	} catch (err) {
		console.error('MongoDB connection error:', err);
	}
};

app.use(async (req, res, next) => {
	await connectToMongoDB();
	next();
});

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	if (req.method === 'OPTIONS') {
		return res.status(200).end();
	}

	next();
});

router.post('/login', loginController.login);

router.post('/register', loginController.register);

router.post('/settings', settingsController.changeWebSettings);

router.get('/settings', settingsController.getWebSettings);

router.get('/users', usersController.getUsers);

router.post('/users/:id', usersController.updateUser);

router.delete('/users/:id', usersController.deleteUser);

router.get('/investments', investmentsController.getAllInvestments);

router.post('/investments', investmentsController.createInvestment);

router.delete('/investments/:id', investmentsController.deleteInvestment);

router.put('/investments/:id', investmentsController.updateInvestment);

router.get('/products', productsController.getProducts);

router.get('/products/:id', productsController.getProductById);

router.post('/products', productsController.createProduct);

router.delete('/products/:id', productsController.deleteProduct);

router.put('/products/:id', productsController.updateProduct);

router.get('/mail', mailController.getAllMails);

router.post('/mail', mailController.sendMail);

router.delete('/mail/:id', mailController.deleteMail);

router.delete('/mail/selected/:id', mailController.deleteSelectedMails);

router.get('/mail/unread-count', mailController.getUnreadCount);

router.put('/mail/:id', mailController.markAsRead);

router.put('/mail/all', mailController.markAllAsRead);

router.put('/mail/change-status/:id', mailController.changeStatus);

app.use('/.netlify/functions/app', router);

module.exports.handler = serverless(app);
