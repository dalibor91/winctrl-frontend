import React from "react";
import {List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import MouseIcon from '@material-ui/icons/Mouse';
import SettingsIcon from '@material-ui/icons/Settings';

import { ModuleMainComponentProps } from "./modules.interfaces";
import { Modules } from "./consts";
import dbg from "../../lib/dbg";

export default class ModuleComponent extends React.Component<ModuleMainComponentProps> {
    constructor(props: ModuleMainComponentProps) {
        super(props)
        this.activateModule.bind(this)
    }

    activateModule(item: Modules) {
        const { onComponentChoose } = this.props;
        dbg("activateModule", { item, onComponentChoose });
        
        if (onComponentChoose) {
            onComponentChoose(item);
        }
    }

    render() {
        return (
            <div>
                <List component="nav" aria-label="main mailbox folders">
                    {([ Modules.Keyboard, Modules.Mouse, Modules.Processes ]).map((item) => (
                        <ListItem button key={item} onClick={e => { e.preventDefault(); this.activateModule(item); }}>
                            <ListItemIcon>
                                {item === Modules.Keyboard && (<KeyboardIcon />)}
                                {item === Modules.Mouse && (<MouseIcon />)}
                                {item === Modules.Processes && (<SettingsIcon />)}
                            </ListItemIcon>
                            <ListItemText primary={item} />
                        </ListItem>
                    ))}
                </List>
            </div>
        );
    }
}

