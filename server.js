// Require modules
var express     = require('express');
var multer      = require('multer');
var qs          = require('querystring');
var app         = express();
var mysql       = require("mysql");
var http        = require('http').Server(app);
var io          = require("socket.io")(http);
var router      = express.Router();
var getIP       = require('ipware')().get_ip;
var bodyParser  = require('body-parser');
var requestIp   = require('request-ip');
var dateFormat  = require('dateformat');
var bodyParser  = require('body-parser');
var upload      = multer();
var port        = 3000;
var uploadFolder= '';

var Topic       = require('./app/model/Topic.js');
var Comment     = require('./app/model/Comment.js');
var Agree       = require('./app/model/Agree.js');
var Disagree    = require('./app/model/Disagree.js');
var User        = require('./app/model/User.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(multer({ dest: './../app/webroot/images/'+uploadFolder,
  rename: function (fieldname, filename) {
    return Date.now();
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname+' is starting ...');
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname+' uploaded to  '+file.path);
  }
}));

io.on('connection',function(socket) {


  socket.on('get_topics',function(data){
    data.User = User.Table;
    data.Comment = Comment.Table;
    Topic.GetTopics(data,function(data){
      io.to(socket.id).emit('ReturnTopics',data);
    });
  });

  socket.on('add_topic',function(data){
    Topic.Add({
      topic_id: data.topic_id,
      user_id: data.user_id,
      comment: data.comment,
      created: today(),
      created_ip: getIp(socket),
      modified: today(),
      modified_ip: getIp(socket)
    },function(data){
      io.to(socket.id).emit('ResponseAddTopic',data);
    });
  });

  socket.on('get_comments',function(data){
    Comment.GetComments(data,function(data){
      io.to(socket.id).emit('ReturnComments',data);
    });
  });

  var getIp = function(socket){
    var socketId  = socket.id;
    var clientIp  = socket.request.connection.remoteAddress;
    return clientIp;
  };

  var today = function(){
    return dateFormat(new Date(), 'yyyy-mm-dd hh:mm:ss');
  };

});

app.use('/', router);
http.listen(port,function(){
  console.log("Listening on "+port);
});