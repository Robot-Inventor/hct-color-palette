const path = require("path");

module.exports = {
    mode: "production",
    entry: {
        "site/dist/script": "./site/script.ts",
        "figma/dist/code": "./figma/code.ts",
    },
    output: {
        filename: "[name].js",
        path: __dirname,
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
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    }
};
