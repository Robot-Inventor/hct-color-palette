import HtmlInlineScriptPlugin from "html-inline-script-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
    mode: "production",
    entry: {
        "site/dist/script": "./site/script.ts",
        "figma/dist/code": "./figma/code.ts",
        "figma/dist/ui_script": "./figma/ui_script.ts",
    },
    output: {
        filename: "[name].js",
        path: import.meta.dirname,
        publicPath: "./figma/dist/"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader"
            },
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false,
                }
            },
            {
                test: /\.css/,
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
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ["figma/dist/ui_script"],
            filename: "./figma/dist/ui.html",
            template: "./common/ui.html",
            inject: "body"
        }),
        new HtmlWebpackPlugin({
            chunks: ["site/dist/script"],
            filename: "./site/dist/index.html",
            template: "./common/ui.html",
            inject: "body"
        }),
        new HtmlInlineScriptPlugin()
    ]
};
