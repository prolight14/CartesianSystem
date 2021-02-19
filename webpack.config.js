"use strict";

// Modified from OldCartesianSystem

// const webpack = require("webpack");

module.exports = {

    context: `${__dirname}/src/`,

    devtool: "source-map",

    mode: "development",
    // mode: "production",

    entry: {
        CartesianSystem: "./index.js",
    },

    output: {
        path: `${__dirname}/dist/`,
        filename: "[name].js",
        library: "CartesianSystem",
        libraryTarget: "umd",
        sourceMapFilename: '[file].map',
        umdNamedDefine: true
    },
};