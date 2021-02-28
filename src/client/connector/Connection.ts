import {ServerMessage, ServerResponse} from "../../server/server.interfaces";

type MessageCallback = (ev: ServerResponse) => void;

export class Connection {
  protected callbacks: MessageCallback[] = [];

  constructor(protected readonly ws: WebSocket) {
    this.ws.onmessage = async (ev: MessageEvent) => {
      const data = typeof ev.data === 'string' ? ev.data : await ev.data.text(); //await ev.data.text();
      //console.log(ev.data);
      this.callbacks.map(clbk => {
        clbk(JSON.parse(data));
      });
    };
  }

  close() {
    this.ws.close()
  }

  send(object: ServerMessage) {
    this.ws.send(JSON.stringify(object))
  }

  onMessage(clbck: MessageCallback) {
    this.callbacks.push(clbck);
  }
}
