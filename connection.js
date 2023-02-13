
const Mysqli = require('mysqli');
require('dotenv').config();

var connection = new Mysqli({
    host: 'localhost', // IP/domain name 
    post: 3306, // port, default 3306 
    user: 'root', // username 
    password: '', // password 
    db: 'orcou'
});


let db = connection.emit(false, '');

// const secret = "1SBz93MsqTs7KgwARcB0I0ihpILIjk3w";

module.exports = {
   database: db
   
};
