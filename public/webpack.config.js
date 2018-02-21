const webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// creates an index.html for us and put it in the dist folder
// will also include the script in the index.html for us

var isProd = process.env.NODE_ENV === 'production' // true or false
console.log("is production :" + isProd);

module.exports = {
  entry: './src/App.js',
  output: {
    path : path.resolve(__dirname, '../../../HomeBankingDeplo/serverDist/public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
    module: {
      rules: [
        { test: /\.(js)$/, use: 'babel-loader', exclude: [/node_modules/]},
        { test: /\.css$/, use: [ 'style-loader', 'css-loader' ]},
        { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
      ]
    },


    devServer: {
    historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),

        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV) // default value if not specified
            }
        })
    ],

    node: {
      net: 'empty',
      dns: 'empty'
    }
}
