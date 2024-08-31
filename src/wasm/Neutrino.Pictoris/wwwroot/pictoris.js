let _runtime;
let _pictorisGlobal;
let _width;
let _height;
let _editor;
let _context;
export function refresh() {
    const result = _pictorisGlobal.setBrightness(128);
    try {
        setImageData(result);
    }
    finally {
        result.dispose();
    }
}
export function initialize(pictoris, width, height) {
    _runtime = globalThis.getDotnetRuntime(0);
    _pictorisGlobal = pictoris;
    _width = width;
    _height = height;
    const img = document.getElementById("jpeg");
    const offscreen = new OffscreenCanvas(img.naturalWidth, img.naturalHeight);
    const offscreenContext = offscreen.getContext("2d");
    offscreenContext.drawImage(img, 0, 0);
    const sourceData = offscreenContext.getImageData(0, 0, _width, _height);
    const buffer = Uint8Array.from(sourceData.data);
    pictoris.initialize(buffer, _width, _height);
    const range = document.getElementById("value");
    range.addEventListener("input", handleValueChange);
    _editor = document.getElementById("editor");
    _context = _editor.getContext("2d");
    const buttonFV = document.getElementById("flipVertical");
    buttonFV.addEventListener("click", handleFlipVertical);
    const buttonFH = document.getElementById("flipHorizontal");
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
export function setBrightness(b) {
    const result = _pictorisGlobal.setBrightness(b);
    try {
        setImageData(result);
    }
    finally {
        result.dispose();
    }
}
function setImageData(buffer) {
    const data = new Uint8ClampedArray(buffer.slice());
    const newData = new ImageData(data, _width, _height);
    _context.putImageData(newData, 0, 0);
}
function handleValueChange(e) {
    const range = e.target;
    setBrightness(parseInt(range.value, 10));
}
//# sourceMappingURL=pictoris.js.map