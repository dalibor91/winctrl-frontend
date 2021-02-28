import { ServerResponseMouse } from "../../server/server.interfaces";
import {Connection} from "./Connection";

export class Query {
  constructor(protected readonly currentConnection: Connection) {

  }

  public moveMouse(cursorX: number, cursorY: number) {
    this.currentConnection.send({
      command: 'mouse_move',
      data: {
        cursorX,
        cursorY
      }
    });
  }

  public click(type: 'left' | 'right' | 'double_left') {
    this.currentConnection.send({
      command: 'mouse_click',
      data: {
        type
      }
    });
  }

  public input(message: string) {
    this.currentConnection.send({
      command: 'keyboard_input',
      data: {
        message: message
      }
    });
  }

  public mouseInfo(): void {
    this.currentConnection.send({
      command: 'mouse_info',
      data: null
    });
  }
}
