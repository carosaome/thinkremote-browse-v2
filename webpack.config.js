module.exports = {
	module: {
		rules: [
			{
				test: /\.svg$/i,
				issuer: /\.[jt]sx?$/,
				use: ["@svgr/webpack"],
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				use: [
					{
						loader: "file-loader",
					},
				],
			},
		],
	},
};