const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: './src/js/main.js',
        auth: './src/js/auth.js',
        products: './src/js/products.js',
        register: './src/js/register.js',
        cart: './src/js/cart.js',
        'product-form': './src/js/product-form.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['main']
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/login.html',
            filename: 'login.html',
            chunks: ['auth']
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/register.html',
            filename: 'register.html',
            chunks: ['register']
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/products.html',
            filename: 'products.html',
            chunks: ['products']
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/cart.html',
            filename: 'cart.html',
            chunks: ['cart']
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/product-form.html',
            filename: 'product-form.html',
            chunks: ['product-form']
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/dashboard.html',
            filename: 'dashboard.html',
            chunks: ['dashboard']
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        historyApiFallback: true,
        port: 3000,
        hot: true,
        open: true
    }
}; 