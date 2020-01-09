/**
 * 公用库打包配置
 * antd 按需加载 不用全量打包
 * @type {*[]}
 */

module.exports = [
  {
    name: 'react',
    libs: ['react', 'react-dom'],
    version: '169'
  },
  {
    name: 'axios',
    libs: ['axios'],
    version: '0190'
  }
]

