const express  = require('express');
const exphbs  = require('express-handlebars');
const bodyParser=require("body-parser");
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const hbs = require('hbs');

dotenv.config({  path: './.env' });

const app = express();

// hbs.registerPartials(path.join(__dirname, 'views'), (err) => {} );

hbs.registerPartials(path.join(__dirname, 'views/common'), (err) => {} );
hbs.registerPartials(path.join(__dirname, 'views/partials'), (err) => {});


app.set('views', path.join(__dirname,'views'));
// app.engine('hbs', exphbs( {extname: '.hbs'}));
app.set('view engine', 'hbs');

// const db =  mysql.createConnection({
//     host: process.env.DATABASE_HOST,
//     user: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASSWORD,
//     database : process.env.DATABASE
// });


const pool =  mysql.createPool({
    connectionLimit: 100,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE
});




const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('static'));

console.log(__dirname);


// db.connect( (error) => {
//     if (error) {
//         console.log(error)
//     }else{
//         console.log('MySql Connected...')
//     }
pool.getConnection((err, connection) =>{
    if(err) throw err;
    console.log('connected as ID' + connection.threadId);
} );

// const routes = require('./routes/user');
// app.use('./', routes);

//define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
// app.use('/dashboard', require('./routes/adminRoute'));

const adminRoute = require('./routes/adminRoute');
app.use('/dashboard', adminRoute);


app.listen(5000,  ()=>{
    console.log("Server is running on port 5000");
});


  
  app.listen(3000)