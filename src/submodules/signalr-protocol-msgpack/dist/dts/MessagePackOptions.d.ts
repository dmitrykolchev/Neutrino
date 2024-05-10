export interface MessagePackOptions {
    extensionCodec?: any;
    context?: any;
    maxDepth?: number;
    initialBufferSize?: number;
    sortKeys?: boolean;
    forceFloat32?: boolean;
    forceIntegerToFloat?: boolean;
    ignoreUndefined?: boolean;
    maxStrLength?: number;
    maxBinLength?: number;
    maxArrayLength?: number;
    maxMapLength?: number;
    maxExtLength?: number;
}
