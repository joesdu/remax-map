module.exports = {
  rootDir: 'src',
  output: 'dist/' + process.env.PLATFORM,
  alias: {
    '@/*': './src/*',
    '@components': './src/components',
    '@vant/weapp/*': './node_modules/@vant/weapp/dist/*'
  },
  pxToRpx: true // 是否将 px 转换为 rpx, 默认是 true
};
