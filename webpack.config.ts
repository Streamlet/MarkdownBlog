import * as fs from 'fs'
import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin'

const production = process.env.NODE_ENV === 'production'

const baseConfig: webpack.Configuration = {
    mode: production ? 'production' : 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: false,
                        }
                    }
                ]
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.css'],
    },
};

const mainConfig = {
    ...baseConfig, ...{
        target: 'electron-main',
        entry: './src/main/app.ts',
        output: {
            path: path.resolve(__dirname, 'build', 'main'),
            filename: 'index.bundle.js'
        },
    }
}

const rendererConfigList = ((): webpack.Configuration[] => {
    let result: webpack.Configuration[] = []
    fs.readdirSync('./src/renderer').filter((f) => {
        return fs.lstatSync(`./src/renderer/${f}`).isDirectory()
    }).forEach((name) => {

        let entry: { [key: string]: string; } = {}
        entry[name] = `./src/renderer/${name}/index.tsx`

        result.push({
            ...baseConfig, ...{
                target: 'electron-renderer',
                entry: entry,
                output: {
                    path: path.resolve(__dirname, 'build', 'renderer'),
                    filename: '[name].bundle.js'
                },
                plugins: [new HtmlWebpackPlugin({
                    filename: `${name}.html`,
                    template: './src/renderer/index.template.html',
                })],

            }
        })
    })
    return result;
})()

export default [mainConfig, ...rendererConfigList]
