var sys     = require('util');
var express = require('express');
var twitter = require('ntwitter');

var app = express.createServer();
app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res, next){
  res.render('/public/index.html');
});
app.listen(process.env.PORT || 20853);
console.log('Server running at http://localhost:20853/');

var io  = require('socket.io').listen(app);

myList = [];
Array.prototype.del = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}

CreateTwitter();
io.sockets.on('connection', function(socket) {
    socket.on('data', function(action,data) {
	console.log(action);
	
	if(action==='+') {
        	myList.push(data);
			console.log(data);
	}
	else {
		myList.del(data);
	}
    });
    socket.on('getfilter', function() {
        socket.emit('pushfilter', myList);
		console.log('emit pushfilter');
    });
    if(myList.length!=0) {
        twit.stream('user',{track:myList}, function(stream) {
            stream.on('data', function (tweet) {
  	    	    socket.emit('message', JSON.stringify(tweet));
            });
        });
    }   
});

function CreateTwitter() {
twit = new twitter({
    consumer_key: '40msDUOpu4Mh1r6rvglig',
    consumer_secret: 'h6G692nS42tUIAZsnpss2dtflQ8ec88k30ckJhkY0',
    access_token_key: '13604142-I1IAdVelSCLZg5uXBqgzKb8hnlM6PoVOXSGl9x2FI',
    access_token_secret: '6SZ14gn1KUctjO2sN2PfY2EinYAoYhLJ4GuSLXSd4'
});
}
