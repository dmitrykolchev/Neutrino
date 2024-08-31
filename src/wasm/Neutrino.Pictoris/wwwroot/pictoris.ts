import { dotnet, IMemoryView, RuntimeAPI } from './_framework/dotnet.js'

export interface IPictorisOperations {
    initialize: (data: Uint8Array, width: number, height: number) => void,
    setBrightness: (b: number) => IMemoryView,
    flipVertical: () => IMemoryView,
    flipHorizontal: () => IMemoryView
}


let _runtime: RuntimeAPI;
let _pictorisGlobal: IPictorisOperations;
let _width: number;
let _height: number;
let _editor: HTMLCanvasElement
let _context: CanvasRenderingContext2D;

export function refresh() {
    const result = _pictorisGlobal.setBrightness(128);
    try {
        setImageData(result);
    }
    finally {
        result.dispose();
    }
}

export function initialize(pictoris: IPictorisOperations, width: number, height: number) {
    _runtime = globalThis.getDotnetRuntime(0);
    _pictorisGlobal = pictoris;
    _width = width;
    _height = height;

    const img = <HTMLImageElement>document.getElementById("jpeg");
    const offscreen = new OffscreenCanvas(img.naturalWidth, img.naturalHeight);
    const offscreenContext = offscreen.getContext("2d");
    offscreenContext.drawImage(img, 0, 0);
    const sourceData = offscreenContext.getImageData(0, 0, _width, _height);

    const buffer = Uint8Array.from(sourceData.data);
    pictoris.initialize(buffer, _width, _height);

    const range = <HTMLInputElement>document.getElementById("value");
    range.addEventListener("input", handleValueChange)

    _editor = <HTMLCanvasElement>document.getElementById("editor");
    _context = _editor.getContext("2d");

    const buttonFV = <HTMLButtonElement>document.getElementById("flipVertical");
    buttonFV.addEventListener("click", handleFlipVertical);
    
    const buttonFH = <HTMLButtonElement>document.getElementById("flipHorizontal");
    buttonFH.addEventListener("click", handleFlipHorizontal);

    setBrightness(128);
}

function handleFlipHorizontal() {
    const result = _pictorisGlobal.flipHorizontal();
    try {
        setImageData(result);
    }
    finally {
        result.dispose();
    }
}

function handleFlipVertical() {
    const result = _pictorisGlobal.flipVertical();
    try {
        setImageData(result);
    }
    finally {
        result.dispose();
    }
}

export function setBrightness(b: number) {
    const result = _pictorisGlobal.setBrightness(b);
    try {
        setImageData(result);
    }
    finally {
        result.dispose();
    }
}

function setImageData(buffer: IMemoryView) {
    const data = new Uint8ClampedArray(buffer.slice());
    const newData = new ImageData(data, _width, _height);
    _context.putImageData(newData, 0, 0);
}


function handleValueChange(e: Event) {
    const range = <HTMLInputElement>e.target;
    setBrightness(parseInt(range.value, 10));
}
