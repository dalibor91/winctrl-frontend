import React from 'react';
import SimpleReactKeyboard from 'react-simple-keyboard';

import {Connection} from "../connector/Connection";
import {Query} from "../connector/Query";

import 'react-simple-keyboard/build/css/index.css';


interface KeyboardContainerProps {
  connection: Connection
}

interface KeyboardContainerState {
  input: string; 
  layout: 'default' | 'shift';
  previous: string | null;
}

export class Keyboard extends React.Component<KeyboardContainerProps, KeyboardContainerState> {
  protected readonly query: Query;

  constructor(props: KeyboardContainerProps) {
    super(props);
    this.state = {
      input: '', 
      layout: 'default',
      previous: null
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

  onChange = (input: string) => {
    //console.log("Input changed", input);
  }

  onKeyPress = (button:string) => {
    if (button === '{lock}') {
      this.setState({ layout: this.state.layout === 'default' ? 'shift' : 'default' });
    }
    
    this.query.input(button);

    this.setState({ previous: button });
  }

  render(){
    return (
      <SimpleReactKeyboard
        onChange={this.onChange}
        onKeyPress={this.onKeyPress}
        autoUseTouchEvents={true}
        layout={
          {
            'default': [
              '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
              '{tab} q w e r t y u i o p [ ] \\',
              '{lock} a s d f g h j k l ; \' {enter}',
              '{shift} z x c v b n m , . / {shift}',
              '{space}'
            ],
            'shift': [
              '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
              '{tab} Q W E R T Y U I O P { } |',
              '{lock} A S D F G H J K L : " {enter}',
              '{shift} Z X C V B N M < > ? {shift}',
              '{space}'
            ]
          }
        }
        layoutName={this.state.layout}
        maxLength={1}
      />
    );
  }
}
