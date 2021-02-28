import React from 'react';
import { Container as CurosorContainer } from './cursor/Container';
import { Container as KeyboardContainer } from './keyboard/Container';
import {Connector} from "./connector/Connector";
import {Connection} from "./connector/Connection";

export class App extends React.Component {
  render() {
    return (
        <div className={"app-container"}>
          <Connector onConnection={(connection: Connection) => {
            return (
                <div style={{ padding: 10 }}>
                  <CurosorContainer connection={connection}/>
                  <KeyboardContainer connection={connection} />
                </div>
            );
          }}/>
        </div>
    );
  }
}
