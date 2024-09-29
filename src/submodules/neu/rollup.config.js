import filesize from "rollup-plugin-filesize";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";

const plugins = [
    typescript({
        compilerOptions: {
            declaration: false,
            declarationDir: undefined,
        },
        exclude: ["**/*.bench.*", "**/*.spec.*"],
    }),
    filesize({
        showMinifiedSize: false,
        showBrotliSize: true,
    }),
    nodeResolve()
];

export default [
    {
        input: "src/index.rollup.ts",
        output: [
            {
                file: "dist/neu-element.js",
                format: "esm",
                sourcemap: true
            },
            {
                file: "dist/neu-element.min.js",
                format: "esm",
                sourcemap: true,
                plugins: [terser()],
            },
        ],
        plugins,
    },
    {
        input: "src/index.rollup.debug.ts",
        output: [
            {
                file: "dist/neu-element.debug.js",
                format: "esm",
                sourcemap: true
            },
            {
                file: "dist/neu-element.debug.min.js",
                format: "esm",
                sourcemap: true,
                plugins: [terser()],
            },
        ],
        plugins,
    },
];
