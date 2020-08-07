// // var Stomp = require('stomp-client');
// // var destination = '/mywebsockets/topic/app';
// // var client = new Stomp('127.0.0.1', 8080);

// // client.connect(function(sessionId) {
// //     client.subscribe(destination, function(body, headers) {
// //       console.log('This is the body of a message on the subscribed queue:', body);
// //     });

// //     client.publish(destination, 'Oh herrow');
// // });


// const WebSocket = require('ws');
// let socket = new WebSocket("ws://localhost:8080/mywebsockets/topic/app/stomp");

// socket.onopen = function(e) {
//   console.log("[open] Connection established");
//   console.log("Sending to server");
//   //socket.send("hello")
//   //socket.send([])
//   //socket.send( "hello!", {"content-type": "text/plain"})
//   // socket.send(JSON.stringify({
//   // text: "client1"
//   // }))
// };


// socket.on('message', function incoming(data) {
//   console.log("ON.MESSAGE")
//   //console.log(message)
//   console.log(data);
// });

// socket.onmessage = function(event) {
//   console.log(`[message] Data received from server: ${event.data}`);
//   console.log(event.data)
// };

// socket.onclose = function(event) {
//   if (event.wasClean) {
//     console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
//   } else {
//     // e.g. server process killed or network down
//     // event.code is usually 1006 in this case
//     console.log('[close] Connection died');
//   }
// };

// socket.onerror = function(error) {
//   console.log(`[error] ${error.message}`);
// };
"use strict";
//# sourceMappingURL=testWS.js.map