var seq = require('sequelize');

// set connection
var con = new seq('nodepractice', 'root', '');

exports.connection = con;

var Agree = con.define('agrees', {
  id:{
    type : seq.INTEGER,
    primaryKey : true,
    autoIncrement : true
  },
  topic_id: seq.INTEGER,
  user_id	: seq.INTEGER,
  created	: seq.STRING,
  created_ip: seq.STRING
},
{timestamps : false});

module.exports = (function(){

  var X = {};

  X.Add = function(data,callback){
    Agree.create(data).then(function(result,err){
      callback({
        error: err == 1 ? 'Failed to agree topic' : 0,
        result: result
      });
    });
  }

  X.Delete = function(data,callback){
    Agree.destroy({
      where: {
        topic_id: data.topic_id,
        user_id: data.user_id
      }
    });
  }

  return X;
})();