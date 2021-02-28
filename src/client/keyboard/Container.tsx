import React from 'react';
import {Connection} from "../connector/Connection";
import './style.css';
import {Query} from "../connector/Query";

interface KeyboardContainerProps {
  connection: Connection
}

interface KeyboardContainerState {
  input: string
}

export class Container extends React.Component<KeyboardContainerProps, KeyboardContainerState> {
  protected readonly query: Query;

  constructor(props: KeyboardContainerProps) {
    super(props);
    this.state = {
      input: ''
    };

    this.query = new Query(props.connection);
  }

  click = () => {
    const {input} = this.state;

    if (input) {
      this.setState({ input: '' });
      this.query.input(input);
    }
  };

  render() {
    return (
        <div id={"keyboardControll"}>
          <textarea onChange={e => { this.setState({ input: e.target.value }) }} value={this.state.input}></textarea>
          <button onClick={this.click} onTouchStart={this.click}>Send</button>
        </div>
    );
  }
}
