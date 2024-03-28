const express = require('express');
const { Signup, Login, CheckUsername } = require('../controllers/AuthController');

const router = express.Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.post('/check-username', CheckUsername);

module.exports = { router };
