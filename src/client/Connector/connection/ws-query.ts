import uuid from "../../lib/uuid";
import { SentMessage } from "./ws-event";

export class WSQuery {
    constructor(protected readonly connection: WebSocket, protected readonly sendCallback?:(msg: SentMessage) => void) {
  
    }

    send(message: SentMessage) {
        if (this.connection.readyState === WebSocket.OPEN) {
            const uuidGenerated = uuid();

            message = { ...message , uuid: uuidGenerated }
            
            if (this.sendCallback) {
                this.sendCallback(message);
            }

            this.connection.send(JSON.stringify(message))

            return uuidGenerated;
        }
    }
  
    public moveMouse(cursorX: number, cursorY: number, type: 'absolute_mouse_move' | 'relative_mouse_move' = 'absolute_mouse_move') {
      this.send({
        command: 'mouse_move',
        data: {
          type,
          cursorX,
          cursorY
        }
      });
    }
  
    public click(type: string) {
      this.send({
        command: 'mouse_click',
        data: {
          type
        }
      });
    }
  
    public input(message: string) {
      this.send({
        command: 'keyboard_input',
        data: {
          message: message
        }
      });
    }
  
    public mouseInfo(): void {
      this.send({
        command: 'mouse_info',
        data: null
      });
    }
  }
  