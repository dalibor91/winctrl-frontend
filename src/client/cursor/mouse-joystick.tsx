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

export class MouseJoystick extends React.Component<MouseJoystickProps, MouseJoystickState> {
  protected readonly query: Query;

  constructor(props: MouseJoystickProps) {
    super(props);
    this.state = {
      cursorX: -10,
      cursorY: -10,
      screenWidth: 100,
      screenHeight: 100
    };

    this.query = new Query(props.connection);
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

  startMove = (event: IJoystickUpdateEvent) => {
    const devider = 5;
    this.query.moveMouse(toInteger(toNumber(event.x) / devider), toInteger(toNumber(event.y)*-1 / devider), 'relative_mouse_move');
  }

  render() {
    return (
    <div id={"cursorMovementControl"}>
      <div id="cursorJoystick">
        <Joystick size={300} baseColor="#eeeeee" stickColor="blue" move={this.startMove} stop={() => this.fetchCurrentState()} disabled={this.state.cursorX + this.state.cursorY < 0}/>
      </div>
    </div>
    )
  }
}
