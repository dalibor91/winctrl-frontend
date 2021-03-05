import React from 'react';
import {Connection} from "../connector/Connection";
import { Query } from '../connector/Query';
import leftIcon from './icons/mouse-left.svg';
import rightIcon from './icons/mouse-right.svg';


export interface MouseClickAreaProps {
    connection: Connection
  }

export class ClickArea extends React.Component<MouseClickAreaProps> {
    protected readonly query: Query;

    protected clickTimeout: NodeJS.Timeout | null = null;

    constructor(props: MouseClickAreaProps) {
        super(props);
        this.query = new Query(props.connection);

    }

    private doRealClick = (type: string) => {
        this.query.click(type);
        if (this.clickTimeout) {
            clearTimeout(this.clickTimeout)
            this.clickTimeout = null;
        }
    };

    click = (type: 'left' | 'right') => {        
        if (this.clickTimeout) {
            this.doRealClick(`double_${type}`);
        } else {
            this.clickTimeout = setTimeout(() => {
                this.doRealClick(type);
            }, 400); // debounce of 400 ms
        }
    };

    render() {
        return (
        <div id={"clickArea"}>
            <div className={"clickSpace"} style={{backgroundImage: `url(${leftIcon})`}} onClick={() => this.click('left')} onTouchStart={() => this.click('left')}></div>
            <div className={"clickSpace"} style={{backgroundImage: `url(${rightIcon})`}} onClick={() => this.click('right')} onTouchStart={() => this.click('right')}></div>
        </div>
        );
    }
}