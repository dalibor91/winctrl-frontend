import React from "react";
import { withStyles } from '@material-ui/core/styles';

import { Paper, InputBase, Theme } from '@material-ui/core';
import SettingsInputHdmiIcon from '@material-ui/icons/SettingsInputHdmi';
import IconButton from '@material-ui/core/IconButton';
import MuiAlert from '@material-ui/lab/Alert';
import { WSConnection } from "./ws-connection";
import dbg from "../../lib/dbg";


interface ConnectionProps {
    onSuccessConnect?: (connection: WSConnection) => void
    classes: any
}

interface ConnectionState {
  connection: string
  connectionOk: boolean 
  connectionInProgress: boolean
}

const useStyles = (theme: Theme) => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      margin: '0 auto'
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    info: {
      marginTop: 10
    }
  });



class Connection extends React.Component<ConnectionProps, ConnectionState> {
  state: ConnectionState = {
    connection: '',
    connectionOk: false,
    connectionInProgress: false
  };
  
  constructor(props: ConnectionProps) {
    super(props);
    this.showInfo.bind(this);
    this.tryConnect.bind(this);
  }

  showInfo() {
    const { connection, connectionOk, connectionInProgress } = this.state;

    if (connection && connectionOk) {
      return (<MuiAlert severity="success">Able to succesfully connect!</MuiAlert>)
    } else if (connection) {
      return connectionInProgress 
        ? (<MuiAlert severity="warning">Trying to connect...</MuiAlert>)
        : (<MuiAlert severity="warning">Connection updated, click on <SettingsInputHdmiIcon /> to test connection.</MuiAlert>)
    }

    return (<MuiAlert severity="error">Please enter connection string.</MuiAlert>)
  }

  tryConnect() {
    this.setState({
      connectionInProgress: true
    })

    dbg("tryConnect()", { connection: this.state.connection })

    const connection = new WSConnection(this.state.connection);
    connection.testConnection(
      // success connection
      () => {
        this.setState({
          connectionInProgress: false,
          connectionOk: true
        })

        if (this.props.onSuccessConnect) {
          this.props.onSuccessConnect(connection);
        }
      }, 
      // failed connection
      () => {
        this.setState({
          connectionInProgress: false,
          connectionOk: false
        })
      })
  }

  render() {
      const { classes } = this.props;

      return (
        <div>
          <Paper component="form" className={classes.root}>
            <InputBase
              className={classes.input}
              placeholder="Enter connection string"
              inputProps={{ 'aria-label': 'enter connection string' }}
              onChange={(e) => { this.setState({ connection: e.target.value, connectionOk: false }) }}
            />
            <IconButton type="submit" className={classes.iconButton} onClick={(e) => { e.preventDefault(); this.tryConnect()}}>
              <SettingsInputHdmiIcon />
            </IconButton>
          </Paper>
          <Paper component="div" className={classes.info}>
            {this.showInfo()}
          </Paper>
        </div>
      )
  }
}

export default withStyles(useStyles)(Connection);