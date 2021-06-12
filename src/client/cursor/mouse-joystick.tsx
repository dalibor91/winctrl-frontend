import React from 'react';
import { get, toInteger, toNumber } from 'lodash';
import { Joystick } from 'react-joystick-component';

import './style.css';
import {Connection} from "../connector/Connection";
import {Query} from "../connector/Query";
import { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick';


export interface MouseJoystickProps {
  connection: Connection
}

export interface MouseJoystickState {
  cursorX: number;
  cursorY: number;
  screenWidth: number;
  screenHeight: number;
}


class Locker {
  public lockStatus: boolean = false;

  protected lockId: NodeJS.Timeout | null = null;

  protected queue: {}[] = [];

  constructor (
    public readonly query: Query,
    public readonly timeout: number = 100
    ) {
      
  }

  public lock(callback: (item: {}) => any, hard = false) {
    if (hard && this.lockStatus) {
      throw new Error(`Already locked under ID: ${this.lockId}`);
    } else {
      this.cleanUp();
    }

    this.lockId = setInterval(() => {
      while (this.queue.length > 0) {
          const item = this.queue.shift();
          if (item) {
            callback(item);
          }
      }
    }, this.timeout);
    this.lockStatus = true;
  }

  public release(hard = false) {
    if (this.lockStatus) {
      this.cleanUp();
    } else if (hard && !this.lockStatus) {
      throw new Error('Not locked')
    } 
  }

  public addToQueue(obj: {}) {
    this.queue.push(obj);
  }

  private cleanUp() {
    if (this.lockId) {
      clearInterval(this.lockId);
    }

    this.lockStatus = false;
  }
}


export class MouseJoystick extends React.Component<MouseJoystickProps, MouseJoystickState> {
  protected readonly query: Query;

  protected readonly locker: Locker;

  constructor(props: MouseJoystickProps) {
    super(props);
    this.state = {
      cursorX: -10,
      cursorY: -10,
      screenWidth: 100,
      screenHeight: 100
    };

    this.startMove = this.startMove.bind(this);
    this.stopMove = this.stopMove.bind(this);

    this.query = new Query(props.connection);
    this.locker = new Locker(this.query);
  }

  // fetch initial state so we know where mouse is 
  private fetchCurrentState() {
    this.query.mouseInfo();
    setTimeout(() => {
      this.setState({ ...get(this.props.connection, 'lastResponse.result', this.state) });
    }, 200); 
  }

  componentDidMount() {
    this.fetchCurrentState();
  }

  startMove (event: IJoystickUpdateEvent) {
    const devider = 5;
    this.locker.lock((event) => {
      const x = toNumber(get(event, 'x'));
      const y = toNumber(get(event, 'y'));
      this.query.moveMouse(toInteger(x / devider), toInteger(y*-1 / devider), 'relative_mouse_move');
    })
  }

  stopMove(event: IJoystickUpdateEvent) {
    this.fetchCurrentState();
    this.locker.release();
  }

  render() {
    return (
    <div id={"cursorMovementControl"}>
      <div id="cursorJoystick">
        <Joystick 
          size={300} 
          baseColor="#eeeeee" 
          stickColor="blue" 
          start={this.startMove} 
          stop={this.stopMove}
          move={(event: IJoystickUpdateEvent) => { this.locker.addToQueue({ x: event.x, y: event.y }) }} 
          disabled={this.state.cursorX + this.state.cursorY < 0}
          />
      </div>
    </div>
    )
  }
}
