import filesize from "rollup-plugin-filesize";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import dts from 'rollup-plugin-dts';
import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';

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
                file: "./dist/signalr-protocol-msgpack.js",
                format: "esm",
                sourcemap: true
            },
            {
                file: "./dist/signalr-protocol-msgpack.min.js",
                format: "esm",
                sourcemap: true,
                plugins: [terser()],
            },
        ],
        external: ['/lib/msgpack/msgpack.js', '/lib/signalr/signalr.js'],
        plugins: [
            resolve(),
            typescript({
                sourceMap: true,
                tsconfig: "./tsconfig.json",
                inlineSources: true
            }),
            alias({
                entries: [
                    { find: '@msgpack/msgpack', replacement: '/lib/msgpack/msgpack.js' },
                    { find: '@microsoft/signalr', replacement: '/lib/signalr/signalr.js' }
                ]
            })
        ],
    },
    {
        // path to your declaration files root
        input: './dist/dts/index.d.ts',
        output: [
            {
                file: './dist/signalr-protocol-msgpack.d.ts',
                format: 'es',
                sourcemap: true
            }
        ],
        external: ['/lib/msgpack/msgpack.js', '/lib/signalr/signalr.js'],
        plugins: [
            resolve(),
            alias({
                entries: [
                    { find: '@msgpack/msgpack', replacement: '/lib/msgpack/msgpack.js' },
                    { find: '@microsoft/signalr', replacement: '/lib/signalr/signalr.js' }
                ]
            }),
            dts()
        ],
    }
];
