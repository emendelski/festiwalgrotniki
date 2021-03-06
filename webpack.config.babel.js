/* eslint-disable */
const path = require('path');
const webpack = require('webpack');

const Autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const StyleLintPlugin = require('stylelint-webpack-plugin');

const DEV_MODE = process.env.NODE_ENV === 'dev'

module.exports = {
  devtool: DEV_MODE ? 'source-map' : false,
  entry: {
    main: './src/main.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'scripts/[name].js'
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: DEV_MODE,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: DEV_MODE,
              includePaths: [
                path.resolve(__dirname, 'node_modules')
              ],
              plugins() {
                return [
                  Autoprefixer,
                ];
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: DEV_MODE,
              includePaths: [
                path.resolve(__dirname, 'node_modules')
              ],
            }
          },
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8 * 1024,
              outputPath: 'images/',
              publicPath: '../images/',
              name: '[name]-[hash:5].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 85
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: 85,
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              }
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new StyleLintPlugin(),
    new MiniCssExtractPlugin({
      filename: "styles/[name].css",
      chunkFilename: "styles/[id].css"
    }),
    new CopyWebpackPlugin([
      {
        from: '*.html',
        to:  path.resolve(__dirname, 'dist'),
      },
      {
        from: path.resolve(__dirname, 'static'),
        to:  path.resolve(__dirname, 'dist/static'),
        cache: DEV_MODE
      },
    ]),
    // compress images
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      cacheFolder: path.resolve('cache'),
    })
  ]
}
