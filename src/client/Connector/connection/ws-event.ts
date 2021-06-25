
export enum WSEvent {
    OnConnectionLost = 'onconnectionlost',
    OnReceive = 'onreceive',
    OnSend = 'onsend'
};

export interface SentMessage {
    command: string;
    data: object | null;
    uuid?: string
}

export interface RecievedMessage {
    error: string | null;
    result: object | null;
    success: boolean
    uuid: string
}

export class ConnectionLostEvent extends Event {
    constructor() {
        super(WSEvent.OnConnectionLost);
    }
}

export class RecievedMessageEvent extends CustomEvent<RecievedMessage> {
    constructor(data: RecievedMessage) {
        super(WSEvent.OnReceive, { detail: data });
    }
}

export class SentMessageEvent extends CustomEvent<SentMessage> {
    constructor(data: SentMessage) {
        super(WSEvent.OnSend, { detail: data });
    }
}