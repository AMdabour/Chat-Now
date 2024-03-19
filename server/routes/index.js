#!/usr/bin/node
const { Signup, Login } = require('../controllers/AuthController');

const makeRoutes = (app) => {
    app.post('/signup', Signup);
    app.post('/login', Login);
};

module.exports = { makeRoutes };
