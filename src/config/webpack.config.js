const path = require("path");

const PROJECT_DIR = path.resolve(__dirname, "..", "..");

module.exports = {
    entry: path.join(PROJECT_DIR, 'tmp', 'script', 'main.js'),
    output: {
        filename: 'main.js',
        path: path.join(PROJECT_DIR, 'docs/script'),
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        "@babel/preset-env",
                        {
                            modules: false,
                            targets: "> 0.25%, not dead"
                        }
                    ]
                }
            }
        ]
    }
}
