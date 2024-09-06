const express = require('express');
const router = express.Router();

const admin_route = express();

const session = require("express-session");

const bodyParser = require("body-parser");

admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded( { extended: true } ));  

admin_route.set('view engine', 'hbs')  ;
admin_route.set('views', './views/partials')


module.exports = router;
