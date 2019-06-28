const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: "./src/index.tsx",
    output: {
        //path: path.resolve(__dirname, "dist"),
        filename: "./support/rm-cs-bundle-[hash:6].js?rm_voyager=true",
        publicPath: '/'
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json", ".scss"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

            {
                test: /\.html$/,
                use: 'raw-loader'
            },

            // style-loader: creates style tags from JS strings
            //   css-loader: translates CSS into JS strings
            //  sass-loader: translates Sass into CSS
            //   node-sassr: Sass compiler used by the loader above
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIdentName: '[path][name]__[local]--[hash:6]',
                        }
                    },
                    "sass-loader"
                ]
            },

            {
                test: /\.(jpg|jpeg|png|gif|svg|pdf|ico)$/,
                use: [
                    { loader: 'url-loader' }
                    // {
                    //     loader: 'file-loader',
                    //     options: {
                    //         name: '[name]--[hash:6].[ext]',
                    //         outputPath: 'support/assets'
                    //     },
                    // },
                ]
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: 'support/m/index.html',
            template: './mobile.html',
            inject: true
        }),
        new HtmlWebpackPlugin({
            filename: 'support/index.html',
            template: './desktop.html',
            inject: true
        }),
        new MiniCssExtractPlugin({
            filename: "./support/rm-cs-bundle-[hash:6].css?rm_voyager=true",
            chunkFilename: "[name].css"
        }),
        new CopyWebpackPlugin([
            { from: './windvane.html', to: './support' }
        ])
    ],

    externals: {
        Mtop: 'mtop'
    }
};
