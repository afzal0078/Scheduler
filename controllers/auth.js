const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db =  mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE
});





exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).render('login', {
                message: 'Please enter email and password.'
            });
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            if (results.length === 0) {
                return res.status(401).render('login', {
                    message: 'The email or password is incorrect'
                });
            }

            const user = results[0];

            // Compare hashed password
            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (!isPasswordMatch) {
                return res.status(401).render('login', {
                    message: 'The email or password is incorrect'
                });
            }

            // Check if user is an admin or regular user based on email domain
            let redirectPath = "/user"; // Default redirection for regular users
            if (email.endsWith("@mitsfaculty.com")) {
                redirectPath = "/dashboard"; // Redirect admin to admin dashboard
            }
            else{
                redirectPath = "/user";
            }

            const id = user.id;
            const token = jwt.sign({ id, role: redirectPath === "/dashboard" ? "admin" : "user" }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE_IN
            });

            const cookieOptions = {
                expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            res.cookie('jwt', token, cookieOptions);
            res.status(200).redirect(redirectPath);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};






exports.register = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if(error){
            console.log(error);
        }
        if(results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            })
        }else if(password !== passwordConfirm ) {
            return res.render('register', {
                message: 'Password do not match'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ? ',{name: name , email: email , password: hashedPassword}, (err, result) => {
            if(error) {
                console.log(error);
            }else{
                console.log(results);
                return res.render('register', {
                    message: 'User registered'
                });
            }
        })
    });

}
