const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const loginController = require('../controllers/login.js');
const settingsController = require('../controllers/webSettings.js');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const router = express.Router();

app.use(express.json());

mongoose
	.connect(
		`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.npoov.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
	)
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.error('MongoDB connection error:', err));

router.post('/login', loginController.login);

router.post('/register', loginController.register);

router.post('/settings', settingsController.changeWebSettings);

router.get('/settings', settingsController.getWebSettings);

app.use('/.netlify/functions/app', router);

module.exports.handler = serverless(app);
