var seq = require('sequelize');

// set connection
var con = new seq('nodepractice', 'root', '');

exports.connection = con;

var Topic = con.define('topics', {
  id:{
    type : seq.INTEGER,
    primaryKey : true,
    autoIncrement : true
  },
  user_id	: seq.INTEGER,
  content	: seq.STRING,
  image		: seq.STRING,
  agree		: seq.INTEGER,
  disagree: seq.INTEGER,
  created	: seq.STRING,
  created_ip: seq.STRING,
  modified	: seq.STRING,
  modified_ip:seq.STRING
},
{timestamps : false});

module.exports = (function(){

	var X = {};

	X.GetTopics = function(callback){
		Topic.findAll({
			where: {

			},
		  order : [
				['created','desc']
		  ],
		  limit: 10,
		}).done(function(results,err){
			callback({
				error: err == 1?'Failed to get the topics':0,
				results: results
			});
		});
	}

	X.Add = function(data,callback){
		Topic.create(data).then(function(result,err){
			callback({
				error: err == 1?'Failed to add topic':0,
				result: result
			});
		});
	}

	X.GetTopic = function(id,callback){
		Topic.find({
			where: {id:id}
		}).done(function(result){
			callback(result);
		});
	}

	X.ToggleAgree = function(data,callback){
		X.GetTopic(data.id,function(result){		
			if(result != null){
				var result = result.dataValues;
				if(data.agree == 1){
					Topic.update({agree:result.agree+1},{
						where: { id: data.id }
					}).done(function(result,err){
						callback({
							error: err == 1?'failed updating topic':0,
							result: result
						});
					});
				}else{
					Topic.update({disagree:result.disagree+1},{
						where: { id: data.id }
					}).done(function(result,err){
						callback({
							error: err == 1?'failed updating topic':0,
							result: result
						});
					});
				}
			}else{
				callback({error:err==1?'Topic no longer exist':0});
			}
		});
	}

	return X;
})();