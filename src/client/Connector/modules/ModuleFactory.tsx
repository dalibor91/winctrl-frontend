import React from 'react';
import { Modules } from './consts';
import KeyboardModule from './keyboard-module';
import MouseModule from './mouse-module';
import ProcessModule from './process-module';
import { ModuleComponentProps } from './modules.interfaces';

export default class ModuleFactory extends React.Component<ModuleComponentProps> {
    render() {
        const loadModule = this.props.module;
        return (<div>
            {loadModule === Modules.Keyboard && (<KeyboardModule {...this.props} />)}
            {loadModule === Modules.Mouse && (<MouseModule {...this.props} />)}
            {loadModule === Modules.Processes && (<ProcessModule {...this.props} />)}
        </div>)
    }
}