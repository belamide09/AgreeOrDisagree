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

  io.on('get_topics',function(data){
    Topic.GetTopics(function(data){
      socket.on(socket.id).emit('ResponseAddTopic',data);
    });
  });

  io.on('add_topic',function(data){
    Topic.Add({
      comment: data.comment,
      
    },function(){
      socket.on(socket.id).emit('ResponseAddTopic',data);
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