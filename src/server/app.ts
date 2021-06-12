import express from 'express';
import {get} from 'lodash';
import * as http from 'http';
import * as WebSocket from 'ws';
import {ServerMessage, ServerResponse} from "./server.interfaces";

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {

  //connection is up, let's add a simple simple event
  ws.on('message', (message: string) => {

    const parsedMessage = JSON.parse(message) as ServerMessage;

    console.log(`Request ${message}`);

    if (parsedMessage) {

      let response: ServerResponse = {
        error: 'Unknown command',
        success: false,
        result: null
      };

      switch (parsedMessage.command) {
        case 'mouse_move':
        case 'mouse_info':
          response = {
            error: null, success: true, result: {
              cursorX: get(parsedMessage.data, 'cursorX', 1000),
              cursorY: get(parsedMessage.data, 'cursorY', 1000),
              screenWidth: 100,
              screenHeight: 100 
            }
          };
          break;
        case 'mouse_click':
          response = {
            error: null, success: true, result: {
              clicked: get(parsedMessage.data, 'type')
            }
          };
          break;

        case 'keyboard_input':
          response = {
            error: null, success: true, result: {
              input: get(parsedMessage.data, 'input')
            }
          };
          break;
      }

      console.log(`Response: ${JSON.stringify(response)}`)

      ws.send(Buffer.from(JSON.stringify(response)));
    }

  });
});

const port = 8999;

//start our server
server.listen(port, () => {
  console.log(`Server started on port ${port} :)`);
});
