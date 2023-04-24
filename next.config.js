/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const withPWA = require("next-pwa")({
  // disable: process.env.NODE_ENV === 'development', // 测试环境禁用
  sw: "sw.js", // service workder注册入口文件，可选，默认为sw.js
  dest: "public", // sw.js文件输出目录
  runtimeCaching: [
    {
      urlPattern: /.*/, // 运行时缓存路由
      handler: "StaleWhileRevalidate", // 运行时缓存策略
    },
  ],
});

module.exports = withPWA(nextConfig);
