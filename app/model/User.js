var seq = require('sequelize');

// set connection
var con = new seq('nodepractice', 'root', '');

exports.connection = con;

User = con.define('users', {
	id : {
    type : seq.INTEGER,
    primaryKey : true,
    autoIncrement : true
  },
  email: seq.STRING,	
  first_name: seq.STRING,
  last_name: seq.STRING,
  image: seq.STRING,
  created	: seq.STRING,
  created_ip: seq.STRING,
  modified	: seq.STRING,
  modified_ip:seq.STRING
},
{timestamps : false});

module.exports = (function(){

	var X = {};
	X.Table = User;

	return X;
})();