import filesize from "rollup-plugin-filesize";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import litcss from 'rollup-plugin-lit-css';

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
    litcss(),
    nodeResolve()
];

export default [
    //{
    //    input: "src/index.rollup.ts",
    //    output: [
    //        {
    //            file: "wwwroot/js/bundle.js",
    //            format: "esm",
    //            sourcemap: true,
    //            inlineDynamicImports: true,
    //        },
    //        {
    //            file: "wwwroot/js/bundle.min.js",
    //            format: "esm",
    //            sourcemap: true,
    //            inlineDynamicImports: true,
    //            plugins: [terser()],
    //        },
    //    ],
    //    plugins,
    //},
    {
        input: "src/index.rollup.debug.ts",
        output: [
            {
                file: "wwwroot/js/bundle.debug.js",
                format: "esm",
                sourcemap: true,
                inlineDynamicImports: true,
            },
            {
                file: "wwwroot/js/bundle.debug.min.js",
                format: "esm",
                sourcemap: true,
                inlineDynamicImports: true,
                plugins: [terser()],
            },
        ],
        plugins,
    },
];
