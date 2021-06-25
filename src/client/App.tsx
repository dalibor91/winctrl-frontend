import React from 'react';
import { Container } from '@material-ui/core';

import { Connector } from './Connector';

export class App extends React.Component {
  render() {
    return (
      <Container maxWidth="sm">
        <Connector />
      </Container>
    );
  }
}
