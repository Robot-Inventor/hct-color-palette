const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");

module.exports = {
    mode: "production",
    entry: {
        "site/dist/script": "./site/script.ts",
        "figma/dist/code": "./figma/code.ts",
        "figma/dist/ui_script": "./figma/ui_script.ts",
    },
    output: {
        filename: "[name].js",
        path: __dirname,
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
            template: "./figma/ui.html",
            inject: "body",
            cache: false
        }),
        new HtmlInlineScriptPlugin()
    ]
};
