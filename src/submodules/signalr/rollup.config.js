import filesize from "rollup-plugin-filesize";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import dts from 'rollup-plugin-dts';

const plugins = [
    typescript({
        compilerOptions: {
            declaration: false,
            declarationDir: undefined,
        },
    }),
    filesize({
        showMinifiedSize: false,
        showBrotliSize: true,
    }),
];

export default [
    {
        input: "./src/browser-index.ts",
        output: [
            {
                file: "./dist/signalr.js",
                format: "esm",
                sourcemap: true
            },
            {
                file: "./dist/signalr.min.js",
                format: "esm",
                sourcemap: true,
                plugins: [terser()],
            },
        ],
        plugins: [typescript({
            sourceMap: true,
            tsconfig: "./tsconfig.json",
            inlineSources: true
        })],
    },
    {
        // path to your declaration files root
        input: './dist/dts/index.d.ts',
        output: [{
            file: './dist/signalr.d.ts',
            format: 'es',
            sourcemap: true
        }],
        plugins: [dts()],
    }
];
