import React from 'react';
import { MouseJoystick, ClickArea, NavArea } from './cursor';
import { Keyboard } from './keyboard';
import {Connector} from "./connector/Connector";
import {Connection} from "./connector/Connection";

export class App extends React.Component {

  connectedRender(connection: Connection) {
    return (
      <div style={{ padding: 10 }}>
        <MouseJoystick connection={connection}/>
        <ClickArea connection={connection}/>
        <NavArea connection={connection}/>
        <Keyboard connection={connection} />
      </div>
    )
  }

  notConnectedRender() {
    return (
      <div style={{ padding: 10 }}>
        <p>Apps allows you remote connect to your windows machine</p>
        <p>and remote control keyboard and mouse using this gui for that :) </p>
        <p>Server: <a href="https://github.com/dalibor91/winctrl-server">dalibor91/winctrl-server</a></p>
        <p>Client: <a href="https://github.com/dalibor91/winctrl-frontend">dalibor91/winctrl-frontend</a></p>
      </div>
    )
  }

  render() {
    return (
        <div className={"app-container"}>
          <Connector afterConnection={this.connectedRender} beforeConnection={this.notConnectedRender} />
        </div>
    );
  }
}
