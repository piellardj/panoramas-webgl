const path = require("path");

const PROJECT_DIR = path.resolve(__dirname, "..", "..");

module.exports = {
    devtool: 'none',
    entry: path.join(PROJECT_DIR, 'tmp', 'script', 'main.min.js'),
    output: {
        filename: 'main.js',
        path: path.join(PROJECT_DIR, 'docs/script'),
    },
    mode: "production"
}
