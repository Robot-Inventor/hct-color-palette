module.exports = {
    mode: "production",
    entry: "./index.js",
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
