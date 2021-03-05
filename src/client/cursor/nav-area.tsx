import React from 'react';
import {Connection} from "../connector/Connection";
import { Query } from '../connector/Query';
import arrow from './icons/arrow.svg';

export interface NavAreaProps {
    connection: Connection
}

export class NavArea extends React.Component<NavAreaProps> {
    protected readonly query: Query;

    protected clickTimeout: NodeJS.Timeout | null = null;

    constructor(props: NavAreaProps) {
        super(props);
        this.query = new Query(props.connection);
    }

    move = (type: string) => this.query.input(type)

    render() {
        return (
            <div id={"navArea"}>
                <div className={"side"}>
                    <div style={{backgroundImage: `url(${arrow})`}} onClick={() => this.move('{arrow_up}')}></div>
                </div>
                <div className={"side"}>
                    <div style={{backgroundImage: `url(${arrow})`}} onClick={() => this.move('{arrow_right}')}></div>
                </div>
                <div className={"side"}>
                    <div style={{backgroundImage: `url(${arrow})`}} onClick={() => this.move('{arrow_down}')}></div>
                </div>
                <div className={"side"}>
                    <div style={{backgroundImage: `url(${arrow})`}} onClick={() => this.move('{arrow_left}')}></div>
                </div>
            </div>
        );
    }
}