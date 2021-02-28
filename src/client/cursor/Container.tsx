import React from 'react';
import './style.css';
import arrow from './arrow.svg';
import {Connection} from "../connector/Connection";
import {Runner} from "../lib/Runner";
import {Query} from "../connector/Query";


export interface MouseContainerProps {
  connection: Connection
}

export interface MouseContainerState {
  cursorX: number;
  cursorY: number;
  screenWidth: number;
  screenHeight: number;
}

export class Container extends React.Component<MouseContainerProps, MouseContainerState> {
  protected readonly runner: Runner;

  protected readonly query: Query;

  constructor(props: MouseContainerProps) {
    super(props);
    this.state = {
      cursorX: 0,
      cursorY: 0,
      screenWidth: 100,
      screenHeight: 100
    };

    this.runner = new Runner(this.state, 50);
    this.query = new Query(props.connection);
  }


  moveLeft = () => {
    this.runner.modifier((state: MouseContainerState) => {
      const {cursorX, cursorY} = state;
      const newCursorY = cursorY - 10 < 0 ? 0 : cursorY - 10;

      this.query.moveMouse(cursorX, newCursorY);

      return { ...state, cursorY: newCursorY };
    });

    this.runner.start();

  };

  moveRight = () => {
    this.runner.modifier((state: MouseContainerState) => {
      const {cursorX, cursorY, screenWidth} = state;
      const newCursorY = cursorY + 10 > screenWidth ? screenWidth : cursorY + 10;

      this.query.moveMouse(cursorX, newCursorY);

      return { ...state, cursorY: newCursorY };
    });

    this.runner.start();
  };

  moveUp = () => {
    this.runner.modifier((state: MouseContainerState) => {
      const {cursorX, cursorY} = state;
      const newCursorX = cursorX - 10 < 0 ? 0 : cursorX - 10;

      this.query.moveMouse(newCursorX, cursorY);

      return { ...state, cursorX: newCursorX };
    });

    this.runner.start();
  };

  moveBottom = () => {
    this.runner.modifier((state: MouseContainerState) => {
      const {cursorX, cursorY, screenHeight} = state;
      const newCursorX = cursorX + 10 > screenHeight ? screenHeight : cursorX + 10;

      this.query.moveMouse(newCursorX, cursorY);

      return { ...state, cursorX: newCursorX };
    });

    this.runner.start();
  };

  stopMovement = () => {
    this.runner.end();
    this.setState({ ...this.runner.state });
  };

  click = (type: 'left' | 'right' | 'double_left') => {
    this.query.click(type)
  };

  render() {
    return (
        <div id={"cursorMovementControl"}>
          <div className={"cursorContainer"} style={{ position: "relative" }}>
            <div className={"optionSide topLeft"} onMouseDown={this.moveUp} onTouchStart={this.moveUp} onTouchEnd={this.stopMovement} onMouseUp={this.stopMovement}> <img src={arrow}/> </div>
            <div className={"optionSide topRight"} onMouseDown={this.moveRight} onTouchStart={this.moveRight} onTouchEnd={this.stopMovement} onMouseUp={this.stopMovement}> <img src={arrow}/> </div>
            <div className={"center"}>
              <div className={"clickDiv doubleLeftClick"} onClick={() => this.click('double_left')} onTouchStart={() => this.click('double_left')}></div>
              <div className={"clickDiv leftClick"} onClick={() => this.click('left')} onTouchStart={() => this.click('left')}></div>
              <div className={"clickDiv rightClick"} onClick={() => this.click('right')} onTouchStart={() => this.click('right')}></div>
            </div>
            <div className={"optionSide bottomLeft"} onMouseDown={this.moveLeft} onTouchStart={this.moveLeft} onTouchEnd={this.stopMovement} onMouseUp={this.stopMovement}> <img src={arrow}/> </div>
            <div className={"optionSide bottomRight"} onMouseDown={this.moveBottom} onTouchStart={this.moveBottom} onTouchEnd={this.stopMovement} onMouseUp={this.stopMovement}> <img src={arrow}/> </div>
          </div>
        </div>
    );
  }
}
