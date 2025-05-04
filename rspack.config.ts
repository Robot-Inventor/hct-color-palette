import {
    type Compiler,
    CopyRspackPlugin,
    LightningCssMinimizerRspackPlugin,
    SwcJsMinimizerRspackPlugin
} from "@rspack/core";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlInlineScriptPlugin from "html-inline-script-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { defineConfig } from "@rspack/cli";
import { fileURLToPath } from "url";
import path from "path";
import { watch } from "chokidar";

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env["NODE_ENV"] === "production";

const commonPlugins = [new ForkTsCheckerWebpackPlugin()];

class WatchPlugin {
    // eslint-disable-next-line class-methods-use-this
    public apply(compiler: Compiler): void {
        let manifestWatcher: null | ReturnType<typeof watch> = null;

        compiler.hooks.watchRun.tapAsync("WatchPlugin", (_params, callback) => {
            if (manifestWatcher) {
                callback();
                return;
            }

            manifestWatcher = watch("src/figma/json/manifest.json");
            manifestWatcher.on("change", (pathString: string) => {
                // eslint-disable-next-line no-console
                console.log(`Manifest file changed: ${pathString}`);
                compiler.watching?.invalidate();
            });

            callback();
        });
    }
}

/* eslint-disable sort-keys */
const baseConfig = defineConfig({
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? false : "source-map",
    output: {
        filename: "[name]",
        clean: true
    },
    optimization: {
        minimizer: [
            new SwcJsMinimizerRspackPlugin({
                extractComments: true
            }),
            new LightningCssMinimizerRspackPlugin({})
        ]
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
        "js/code.js": "./src/figma/ts/code.ts",
        "js/ui_script.js": "./src/figma/ts/ui_script.ts"
    },
    output: {
        ...baseConfig.output,
        path: path.join(__dirname, "dist/figma")
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ["js/ui_script.js"],
            publicPath: ".",
            filename: "ui.html",
            template: "./src/common/html/ui.html",
            inject: "body"
        }),
        new HtmlInlineScriptPlugin(),
        new CopyRspackPlugin({
            patterns: [
                {
                    from: "./src/figma/json/manifest.json",
                    to: "./manifest.json"
                }
            ]
        }),
        new WatchPlugin(),
        ...commonPlugins
    ]
});

const siteConfig = defineConfig({
    ...baseConfig,
    entry: {
        "js/script.js": "./src/site/ts/script.ts"
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
            chunks: ["js/script.js"],
            publicPath: ".",
            filename: "index.html",
            template: "./src/common/html/ui.html",
            favicon: "./src/image/icon.svg"
        }),
        ...commonPlugins
    ]
});
/* eslint-enable sort-keys */

export { siteConfig };
export default [figmaConfig, siteConfig];
