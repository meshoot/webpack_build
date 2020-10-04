const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

const NODE_ENV = process.env.NODE_ENV || 'development';

function generateHtmlPlugins(templateDir) {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));

    return templateFiles.map((item) => {
        const parts = item.split('.'),
            name = parts[0],
            extension = parts[1];

        return new HtmlWebpackPlugin({
            filename: `../${name}.html`,
            template: path.resolve(
                __dirname,
                `${templateDir}/${name}.${extension}`
            ),
            inject: false,
        });
    });
}

module.exports = {
    entry: path.resolve(__dirname, 'src', 'js', 'index.js'),
    output: {
        path: path.resolve(__dirname, 'dist', 'js'),
        filename: 'bundle.js',
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development',
        }),
    ].concat(generateHtmlPlugins(path.resolve(__dirname, 'src', 'templates'))),
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
        ],
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        compress: true,
        noInfo: true,
        overlay: true,
        port: 9000,
    },
    devtool: NODE_ENV === 'development' ? 'eval-cheap-source-map' : false,
};
