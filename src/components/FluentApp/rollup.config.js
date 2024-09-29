import filesize from "rollup-plugin-filesize";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import dts from 'rollup-plugin-dts';
import nodeResolve from '@rollup/plugin-node-resolve'

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
                file: "./wwwroot/js/bundle.js",
                format: "esm",
                sourcemap: true
            }
        //    ,
        //    {
        //        file: "./dist/spectrum.min.js",
        //        format: "esm",
        //        sourcemap: true,
        //        plugins: [terser()],
        //    },
        ],
        plugins: [
            typescript({
                sourceMap: true,
                tsconfig: "./tsconfig.json",
                inlineSources: true
            }),
            nodeResolve()
        ]
    },
    {
        // path to your declaration files root
        input: './src/index.d.ts',
        output: [{
            file: './src/dts/bundle.d.ts',
            format: 'es',
            sourcemap: true
        }],
        plugins: [
            dts(),
            nodeResolve()
        ]
    }
];
