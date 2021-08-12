import { 
    Node,
} from 'react-flow-renderer/nocss';

export interface Parameter {
    name: string;
    value: number;
}

export interface Argument {
    name: string;
    value: number;
}

export interface System {
    parameters: [Parameter];
    arguments: [Argument];
    states: [string];
    equations: [string];
    connections: [string];
}

export interface Model {
    id: number;
    name: string;
    system: System;
}

export interface ModelCategory {
    category: string;
    models: [Model];
}



