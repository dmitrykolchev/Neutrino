// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
import { dotnet } from './_framework/dotnet.js';
import { initialize, refresh } from "./pictoris.js";
const { setModuleImports, getAssemblyExports, getConfig } = await dotnet
    .withDiagnosticTracing(false)
    .withApplicationArgumentsFromQuery()
    .create();
const imports = {
    window: {
        location: {
            href: () => globalThis.window.location.href
        }
    }
};
setModuleImports('main.js', imports);
const config = getConfig();
const exports = await getAssemblyExports(config.mainAssemblyName);
const pictoris = {
    initialize: exports.PictorisGlobal.Initialize,
    setBrightness: exports.PictorisGlobal.SetBrightness,
    flipVertical: exports.PictorisGlobal.FlipVertical,
    flipHorizontal: exports.PictorisGlobal.FlipHorizontal
};
setTimeout(() => {
    initialize(pictoris, 800, 1200);
    refresh();
}, 100);
await dotnet.run();
//# sourceMappingURL=main.js.map