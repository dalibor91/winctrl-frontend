import React from 'react';
import dbg from '../../../lib/dbg';
import { WSEvent } from '../../connection';
import { ModuleComponentProps } from '../modules.interfaces';

export default class KeyboardModule extends React.Component<ModuleComponentProps> {
    componentDidMount() {
        this.props.connection.addEventListener(WSEvent.OnSend, (e) => {
            dbg('sent event', { data: e })
        });

        this.props.connection.addEventListener(WSEvent.OnReceive, (e) => {
            dbg('sent recieve', { data: e })
        });

        this.props.connection.query.mouseInfo()
    }

    render() {
        return (<div>keyboard</div>)
    }
}