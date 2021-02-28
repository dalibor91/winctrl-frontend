import React from 'react';
import {get} from 'lodash';
import {Connection} from "./Connection";
import './style.css';

interface ConnectorProps {
  onConnection(socket: Connection): JSX.Element ;
  onError?(): void;
}

interface ConnectorState {
  urlConnection: string;
  connected: boolean;
  connection?: Connection;
  error: string | null;
}


export class Connector extends React.Component<ConnectorProps, ConnectorState> {
  constructor(props: any) {
    super(props);
    this.state = {
      urlConnection: '',
      connected: false,
      error: null
    };
  }

  onConnectUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      urlConnection: e.target.value
    });
  };

  tryConnect = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { urlConnection } = this.state;

    if (!urlConnection) {
      this.setState({error: "Url to server is missing "})
      return;
    }

    const ws = new WebSocket(urlConnection);

    ws.onopen = (ev: Event): void => {
      if (ws.readyState === WebSocket.OPEN) {
        const connection = new Connection(ws);

        connection.onMessage(msg => {
          if (msg.error) {
            this.setState({ error: JSON.stringify(msg) })
          } else {
            this.setState({ error: null })
          }
        });
        this.setState({ connected: true, connection, error: null });
      }
    };

    ws.onerror = (ev: Event): void => {
      this.setState({error: 'Unable to connect check console'})
      console.log(ev);
    }
  };

  tryDisconnect = () => {
    this.state.connection && this.state.connection.close();
    this.setState({
      connection: undefined, connected: false
    });
  };

  renderConnection() {
    const {connected, error} = this.state;

    return (
        <div className={"connectionSettings"}>
          <input type={"text"} onChange={this.onConnectUrlChange} disabled={connected}/>
          {error && (<div className={"error"}><strong>Error: </strong>{error}</div>)}
          {!connected ? (<button onClick={this.tryConnect}>Connect</button>) : (<button onClick={this.tryDisconnect}>Disconnect</button>)}
        </div>
    );
  }

  render() {
    return (
        <div>
          <div id={"connectionInput"}>{this.renderConnection()}</div>
          {this.state.connected && this.state.connection && (
              <div className={"connectionSuccess"}>{this.props.onConnection(this.state.connection)}</div>
          )}
        </div>
    );
  }
}
