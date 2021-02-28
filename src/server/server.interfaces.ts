
export interface ServerMessage {
  command: string;
  data: object | null;
}

export interface ServerResponse {
  error: string | null;
  response: object | null;
  success: boolean
}

// what we send to server
export interface ServerMessageMouse extends ServerMessage {
  command: 'mouse_info' | 'mouse_move' | 'mouse_click',
  data:
      null | // for mouse_info
      { cursorX: number, cursorY: number } | // for mouse_move
      { click: 'left' | 'right' | 'double_left' } // for mouse_click
}

export interface ServerResponseMouse extends ServerResponse {
  response: {
    cursorX: number,
    cursorY: number,
    screenWidth: number,
    screenHeight: number
  }
}
