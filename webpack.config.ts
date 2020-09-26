import * as fs from 'fs'
import * as path from 'path';
import * as webpack from 'webpack';

const production = process.env.NODE_ENV === 'production'

const baseConfig: webpack.Configuration = {
    mode: production ? 'production' : 'development',
    module: {
        rules: [
            {
                test: /\.ts$/,
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
                            modules: true
                        }
                    }
                ]
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.css'],
    },
};

const mainConfig = {
    ...baseConfig, ...{
        target: 'electron-main',
        entry: './src/main/app.ts',
        output: {
            path: path.resolve(__dirname, 'build', 'main'),
            filename: 'index.bundle.js'
        }
    }
}

const rendererConfig = {
    ...baseConfig, ...{
        target: 'electron-renderer',
        entry: ((): { [key: string]: string; } => {
            let r: { [key: string]: string; } = {}
            fs.readdirSync('./src/renderer').filter((f) => {
                return fs.lstatSync(`./src/renderer/${f}`).isDirectory()
            }).forEach((e) => {
                r[e] = `./src/renderer/${e}/index.ts`
            })
            return r;
        }),
        output: {
            path: path.resolve(__dirname, 'build', 'renderer'),
            filename: '[name].bundle.js'
        }
    }
}

export default [mainConfig, rendererConfig]
