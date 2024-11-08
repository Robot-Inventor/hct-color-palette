import { CopyRspackPlugin } from "@rspack/core";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlInlineScriptPlugin from "html-inline-script-webpack-plugin";
import { defineConfig } from "@rspack/cli";
import { fileURLToPath } from "url";
import path from "path";

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";

const commonPlugins = [new ForkTsCheckerWebpackPlugin()];

/* eslint-disable sort-keys */
const baseConfig = defineConfig({
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? false : "source-map",
    output: {
        filename: "[name]",
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/u,
                exclude: [/node_modules/u],
                loader: "builtin:swc-loader",
                options: {
                    jsc: {
                        parser: {
                            syntax: "typescript"
                        }
                    }
                },
                type: "javascript/auto"
            },
            {
                test: /\.css/u,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: { url: false }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    }
});

const figmaConfig = defineConfig({
    ...baseConfig,
    entry: {
        "code.js": "./figma/code.ts",
        "ui_script.js": "./figma/ui_script.ts"
    },
    output: {
        ...baseConfig.output,
        path: path.join(__dirname, "dist/figma")
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ["ui_script.js"],
            publicPath: ".",
            filename: "ui.html",
            template: "./common/ui.html",
            inject: "body"
        }),
        new HtmlInlineScriptPlugin(),
        new CopyRspackPlugin({
            patterns: [
                {
                    from: "./figma/manifest.json",
                    to: "./manifest.json"
                }
            ]
        }),
        ...commonPlugins
    ]
});

const siteConfig = defineConfig({
    ...baseConfig,
    entry: {
        "script.js": "./site/script.ts"
    },
    devServer: {
        static: {
            directory: "./dist"
        },
        port: 8080,
        client: {
            overlay: false,
            progress: true
        }
    },
    output: {
        ...baseConfig.output,
        path: path.join(__dirname, "dist/site")
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ["script.js"],
            publicPath: ".",
            filename: "index.html",
            template: "./common/ui.html"
        }),
        ...commonPlugins
    ]
});
/* eslint-enable sort-keys */

export { siteConfig };
export default [figmaConfig, siteConfig];
