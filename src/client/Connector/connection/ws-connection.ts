import dbg from "../../lib/dbg";
import { ConnectionLostEvent, RecievedMessageEvent, SentMessageEvent } from "./ws-event";
import { WSQuery } from "./ws-query";

export class WSConnection extends EventTarget {
    protected _socket?: WebSocket;

    constructor(public readonly url: string) {
        super();
        this.testConnection(() => {
            this.reconnect();
            this.checkIsLive();
        }, () => {})
    }

    get socket(): WebSocket {
        if (this._socket) {
            return this._socket;
        }

        dbg("Unable to create socket connection");

        throw Error('Seems like connection is missing');
    }

    get query(): WSQuery {
        return new WSQuery(this.socket, (msg) => { this.dispatchEvent(new SentMessageEvent(msg)) });
    }

    private reconnect() {
        this._socket = new WebSocket(this.url);

        this._socket.onmessage = async (ev: MessageEvent) => {
            const data = typeof ev.data === 'string' ? ev.data : await ev.data.text(); 
            this.dispatchEvent(new RecievedMessageEvent(JSON.parse(data)));
          };
    }

    private checkIsLive() {
        setInterval(() => {
            if (this.socket.readyState === WebSocket.CLOSED) {
                this.dispatchEvent(new ConnectionLostEvent())
                this.reconnect();
            }
        }, 5000)
    }

    testConnection(success: () => void, error: () => void) {
        const webSocket = new WebSocket(this.url);

        webSocket.onopen = (ev: Event) => {
            success();
            dbg("testConnection() -> success()")
            webSocket.close()
        }

        webSocket.onerror = (ev: Event) => {
            error();
            dbg("testConnection() -> error()", { event: ev })

            webSocket.close();
        }
    }
}