import {ServerMessage, ServerResponse} from "../../server/server.interfaces";

type MessageCallback = (ev: ServerResponse) => void;

export class Connection {
  protected callbacks: MessageCallback[] = [];

  public lastResponse?: ServerResponse;

  constructor(protected readonly ws: WebSocket) {
    this.ws.onmessage = async (ev: MessageEvent) => {
      const data = typeof ev.data === 'string' ? ev.data : await ev.data.text(); //await ev.data.text();

      this.lastResponse = JSON.parse(data);

      this.callbacks.map(clbk => {
        if (this.lastResponse) {
          clbk(this.lastResponse);
        }
      });
    };
  }

  close() {
    this.ws.close()
  }

  send(object: ServerMessage) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(object))
    }
  }

  onMessage(clbck: MessageCallback) {
    this.callbacks.push(clbck);
  }
}
