import React from 'react';
import {get} from 'lodash';
import {Connection} from "./Connection";
import './style.css';


interface ConnectorProps {
  afterConnection(socket: Connection): JSX.Element ;
  beforeConnection(): JSX.Element ;
  onError?(): void;
}

interface ConnectorState {
  urlConnection: string;
  connected: boolean;
  connection?: Connection;
  error: string | null;
}

const readConnectionFromStorage = () => {
  return localStorage.getItem('connectionUrl');
}

const writeConnectionToStorage = (url: string) => {
  localStorage.setItem('connectionUrl', url)
};

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

    const connection = new Connection(new WebSocket(urlConnection));

    connection.onMessage(msg => {
      if (msg.error) {
        this.setState({ error: JSON.stringify(msg) })
      } else {
        this.setState({ error: null })
      }
    });

    connection.onSocketOpen = (): void => {
      this.setState({ connected: true, connection, error: null });
    };

    connection.onSocketError = (ev: Event): void => {
      this.setState({error: 'Unable to connect check console'})
    };

    this.setState({
      connection
    });

    connection.connect();
    writeConnectionToStorage(urlConnection);
  };

  componentDidMount() {
    const urlConnection = readConnectionFromStorage() || '';
    this.setState({
      urlConnection
    });
  }

  renderConnection() {
    const {connected, error} = this.state;

    return (
        <div className={"connectionSettings"}>
          {!connected && <input type={"text"} onChange={this.onConnectUrlChange} disabled={connected} value={this.state.urlConnection}/>}
          {error && (<div className={"error"}><strong>Error: </strong>{error}</div>)}
          {!connected && (<button onClick={this.tryConnect}>Connect</button>)}
        </div>
    );
  }

  render() {
    const { connected, connection } = this.state;
    return (
        <div>
          <div id={"connectionInput"}>{this.renderConnection()}</div>
          {connected && connection && (
              <div className={"connectionSuccess"}>{this.props.afterConnection(connection)}</div>
          )}

          {!connected && this.props.beforeConnection()}
        </div>
    );
  }
}
