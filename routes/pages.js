const express = require('express');
const userController = require('../controllers/userController')

const router = express.Router();

router.get('/', (req, res) => {
    res.render("index");
});

router.get('/dashboard', userController.view);
router.post('/dashboard', userController.find);
// router.get('/:id', userController.delete);

router.get('/add-user', userController.form);
router.post('/add-user', userController.create);
router.get('/edit-user/:id', userController.edit);
router.post('/edit-user/:id', userController.update);
router.get('/view-user/:id', userController.viewall);
router.get('/user', userController.userPage);
// router.get('/:id', authController.deleteUser);

// router.get('/register', (req, res) => {
//     res.render("register");
// });

// router.get('/login', (req, res) => {
//     res.render("login");
// });

// POST routes for login and register
// router.post('/register', authController.register);
// router.post('/login', authController.login);



// router.get('/user', userController.userPage);
// router.get('/user', userController.userPage);

// router.get('/dashboard', userController.view, (req, res) => {
//     res.render("dashboard");
// });
// router.post('/dashboard', userController.find, (req, res) => {
//     res.render("dashboard");
// });
// router.get('/:id', userController.delete, (req, res) => {
//     res.render(":id");
// });

// router.get('/add-user', userController.form, (req, res) => {
//     res.render("add-user");
// });
// router.post('/add-user', userController.create, (req, res) => {
//     res.render("add-user");
// });
// router.get('/edit-user/:id', userController.edit, (req, res) => {
//     res.render("edit-user");
// });
// router.post('/edit-user/:id', userController.update, (req, res) => {
//     res.render("edit-user");
// });
// router.get('/view-user/:id', userController.viewall, (req, res) => {
//     res.render("view-use");
// });



// router.get('/register', (req, res) => {
//     res.render("register");
// });
// router.get('/login', (req, res) => {
//     res.render("login");
// });

// router.get('/dashboard', (req, res) => {
//     res.render("dashboard", userController.view);
// });

// router.get('/user', (req, res) => {
//     res.render("user");
// });




module.exports = router;