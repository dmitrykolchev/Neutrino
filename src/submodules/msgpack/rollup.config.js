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
        input: "./src/index.ts",
        output: [
            {
                file: "./dist/msgpack.js",
                format: "esm",
                sourcemap: true
            },
            {
                file: "./dist/msgpack.min.js",
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
            file: './dist/msgpack.d.ts',
            format: 'es',
            sourcemap: true
        }],
        plugins: [dts()],
    }
];
