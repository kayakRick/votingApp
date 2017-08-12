let path = require("path");

module.exports = {
    entry: './public/javascripts/index.js',
    output: {
        path: path.resolve(__dirname, "public/dist"),
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react']
                }
            }
        ]
    }

};