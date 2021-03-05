import {ServerMessage, ServerResponse} from "../../server/server.interfaces";

type MessageCallback = (ev: ServerResponse) => void;

export class Connection {
  protected callbacks: MessageCallback[] = [];

  public lastResponse?: ServerResponse;

  public onSocketOpen?: (ev: Event) => void; 
  public onSocketError?: (ev: Event) => void; 

  constructor(public ws: WebSocket) {

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

  public connect() {
    this.ws.onmessage = async (ev: MessageEvent) => {
      const data = typeof ev.data === 'string' ? ev.data : await ev.data.text(); //await ev.data.text();

      this.lastResponse = JSON.parse(data);

      this.callbacks.map(clbk => {
        if (this.lastResponse) {
          clbk(this.lastResponse);
        }
      });
    };

    this.ws.onclose = () => {
      this.reconnect();
    };

    if (this.onSocketOpen) {
      this.ws.onopen = this.onSocketOpen;
    }

    if (this.onSocketError) {
      this.ws.onerror = this.onSocketError;
    }
  }

  private reconnect() {
    if (this.ws.readyState === WebSocket.CLOSED) {
      this.ws = new WebSocket(this.ws.url);
      this.connect();
    }
  }
}
