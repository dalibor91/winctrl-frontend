import { WSConnection } from "../connection";
import { Modules } from "./consts";


export interface ModuleMainComponentProps {
    onComponentChoose: (module: Modules) => any
}

export interface ModuleComponentProps {
    connection: WSConnection,
    module: Modules
}
