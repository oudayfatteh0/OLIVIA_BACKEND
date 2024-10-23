const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const loginController = require('../controllers/login.js');
const settingsController = require('../controllers/webSettings.js');
const usersController = require('../controllers/users.js');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const router = express.Router();

app.use(express.json());

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

app.use('/.netlify/functions/app', router);

module.exports.handler = serverless(app);
