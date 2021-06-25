import React from 'react';
import {Stepper, Step, StepLabel} from '@material-ui/core';

import { ConnectionComponent, WSConnection } from './connection';
import { ModuleComponent, Modules, ModuleFactory } from './modules';
import dbg from '../lib/dbg';

interface ConnectorState {
    currentStep: number
    currentModule?: string
    connection?: WSConnection
}

interface ConnectorProps {

}

const steps = [
    "Connect",
    "Input Type",
    "Control"
];

export class Connector extends React.Component<ConnectorProps, ConnectorState> {
    state: ConnectorState = {
        currentStep: 0
    };

    constructor(props: any) {
        super(props);
        this.changeStep.bind(this);
        this.stepToModule.bind(this);
    }

    changeStep(step: number, connection?: WSConnection, currentModule?: Modules) {
        connection = connection || this.state.connection

        dbg("changeStep()", { connection, currentModule });

        if (step === 0) {
            this.setState({
                currentStep: 0,
                currentModule: undefined
            })
        } else if (step === 1 && connection) {
            this.setState({
                currentStep: 1,
                connection
            }) 
        } else if (step === 2 && connection && currentModule) {
            this.setState({
                currentStep: 2, 
                connection,
                currentModule
            })
        }
    }

    stepToModule(step: number) {
        if (step >= steps.length) {
            throw new Error(`Unknown step ${step}`)
        }

        const { connection, currentModule } = this.state;

        dbg("stepToModule()", { connection, currentModule });

        if (step === 0) {
            return <ConnectionComponent onSuccessConnect={(con: WSConnection) => {
                this.changeStep(1, con);
            }} />
        }

        if (step === 1 && connection) {
            return <ModuleComponent onComponentChoose={(module: Modules) => {
                this.changeStep(2, connection, module)
            }} />
        }

        if (step === 2 && connection && currentModule) {
            return <ModuleFactory module={currentModule as Modules} connection={connection}/>
        }

        return (
            <div>Unknown step</div>
        );
    }

    render() {
        const { currentStep } = this.state;
        return (
            <div>
                <Stepper activeStep={currentStep} alternativeLabel>
                    {steps.map((label, index) => (
                        <Step key={`step-${index}`} onClick={() => this.changeStep(index)}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <div id={`container`}>
                    {this.stepToModule(currentStep)}
                </div>
            </div>
        );
    }
}