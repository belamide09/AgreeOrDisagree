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

	function GetTopicConditions = function(data){
		var options = {
		  order : [
				['created','desc']
		  ],
		  limit: 10,
		  include: [{
        model: data.User,
        required: true,
      },{
      	model: data.Comment,
      	limit: 5,
      	 order : [
					['created','desc']
			  ],
			  include: [{
	        model: data.User,
	        required: true,
	      }]
      }]
		};
		if(data.last_id != null){
			options.where = {
				id: {$lt: data.last_id}
			};
		}
		return options;
	}

	X.GetTopics = function(data,callback){
	Topic.belongsTo(data.User,{foreignKey: 'user_id'});
    Topic.hasMany(data.Comment,{foreignKey: 'topic_id'});
    data.Comment.belongsTo(data.User,{foreignKey: 'user_id'});
		Topic.findAll(GetTopicConditions(data)).done(function(results,err){
			callback({
				error: err == 1?'Failed to retrieve the topics':0,
				results: results
			});
		});
	};

	X.Add = function(data,callback){
		Topic.create(data).then(function(result,err){
			callback({
				error: err == 1?'Failed to add topic':0,
				result: result
			});
		});
	};

	X.Update = function(data,callback){
		Topic.update({
			content: data.content,
			modified: data.modified,
			modified_ip: data.modified_ip
		},{
			where: {id:data.id}
		}).then(function(result,err){
			callback({
				error: err == 1?'Failed to update topic':0,
				result: result
			});
		});
	};

	X.GetTopic = function(id,callback){
		Topic.find({
			where: {id:id}
		}).done(function(result){
			callback(result);
		});
	};

	X.ToggleAgree = function(data,callback){
		X.GetTopic(data.id,function(result){		
			if(result != null){
				ToggleAgree({result:result,callback:callback});
			}else{
				callback({error:err == 1?'Topic no longer exist':0});
			}
		});
	};

	var ToggleAgree = function(data){
		var result = data.result.dataValues;
		var callback = data.callback;
		if(data.agree == 1){
			Topic.update({agree:result.agree+1},{
				where: { id: data.id }
			}).done(function(result,err){
				callback({
					error: err == 1?'failed to agree topic':0,
					result: result
				});
			});
		}else{
			Topic.update({disagree:result.disagree+1},{
				where: { id: data.id }
			}).done(function(result,err){
				callback({
					error: err == 1?'failed to disagree topic':0,
					result: result
				});
			});
		};
	};

	return X;
})();