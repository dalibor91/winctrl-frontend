// eslint-disable-next-line import/no-anonymous-default-export
export default function (msg: string, context?: {}): void {
    console.log({ _message: msg, _timestamp: new Date().toISOString(), ...context });
}
