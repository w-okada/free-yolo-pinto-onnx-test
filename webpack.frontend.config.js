/* eslint @typescript-eslint/no-var-requires: "off" */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    mode: "development",
    // mode: "production",
    entry: path.resolve(__dirname, "frontend/src/index.tsx"),
    output: {
        path: path.resolve(__dirname, "docs"),
        filename: "index.js",
    },
    resolve: {
        modules: [path.resolve(__dirname, "node_modules")],
        extensions: [".ts", ".tsx", ".js"],
        fallback: {
            buffer: require.resolve("buffer/"),
        },
    },
    module: {
        rules: [
            {
                test: [/\.ts$/, /\.tsx$/],
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            // transpileOnly: true,
                            configFile: "tsconfig.frontend.json",
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ["style-loader", { loader: "css-loader", options: { importLoaders: 1 } }, "postcss-loader"],
            },
            {
                test: /\.html$/,
                loader: "html-loader",
            },
            { test: /\.jpg$/, type: "asset/resource" },
            // { test: /\.onnx$/, type: "asset/resource" },
            // { test: /\.bin$/, type: "asset/resource" },
            // { test: /\.json$/, type: "asset/resource" },
            // { test: /\.bin$/, type: "asset/inline" },
            // { test: /\.json$/, type: "asset/source" },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "frontend/public/index.html"),
            filename: "./index.html",
        }),
        new CopyPlugin({
            patterns: [{ from: "models/*.onnx", to: "" }],
        }),
        new CopyPlugin({
            patterns: [{ from: "models/tfjs", to: "models" }],
        }),
        // new CopyPlugin({
        //     patterns: [{ from: "models/youtu_reid", to: "models/youtu_reid" }],
        // }),
        // new CopyPlugin({
        //     patterns: [{ from: "models/reid", to: "models/reid" }],
        // }),
        // new CopyPlugin({
        //     patterns: [{ from: "models/cs", to: "models/cs" }],
        // }),
        // new CopyPlugin({
        //     patterns: [{ from: "models/cs_512", to: "models/cs_512" }],
        // }),
        // new CopyPlugin({
        //     patterns: [{ from: "models/cs_256", to: "models/cs_256" }],
        // }),
        // new CopyPlugin({
        //     patterns: [{ from: "models/tfjs", to: "models" }],
        // }),

        new CopyPlugin({
            patterns: [{ from: "frontend/public/assets", to: "assets" }],
        }),

        new CopyPlugin({
            patterns: [
                {
                    from: "node_modules/onnxruntime-web/dist/*.wasm",
                    to: "[name][ext]",
                },
            ],
        }),
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, "docs"),
        },
        client: {
            overlay: {
                errors: false,
                warnings: false,
            },
        },
        host: "0.0.0.0",
        https: true,
    },
};
