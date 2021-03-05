import { ServerResponseMouse } from "../../server/server.interfaces";
import {Connection} from "./Connection";

export class Query {
  constructor(protected readonly currentConnection: Connection) {

  }

  public moveMouse(cursorX: number, cursorY: number, type: 'absolute_mouse_move' | 'relative_mouse_move' = 'absolute_mouse_move') {
    this.currentConnection.send({
      command: 'mouse_move',
      data: {
        type,
        cursorX,
        cursorY
      }
    });
  }

  public click(type: string) {
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
