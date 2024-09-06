// const express = require('express');
// const authController = require('../controllers/auth');

// const router = express.Router();

// // router.post('/register', authController.register )
// // router.post('/login', authController.login )
// router.get('/register', (req, res) => {
//     res.render("register");
// });
// router.get('/login', (req, res) => {
//     res.render("login");
// });
// // router.post('/dashboard' )
// // // router.post('/login', authController.login )
// // router.post('/login', authController.login )

// // const admin_route = express;

// const session = require("express-session")



// module.exports = router;

const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/register', (req, res) => {
    res.render("register");
});

router.get('/login', (req, res) => {
    res.render("login");
});

// POST routes for login and register
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
