import { createProxyMiddleware } from 'http-proxy-middleware';

export default function setupProxy(app) {
  app.use(
    '/api/user',
    createProxyMiddleware({
      target: 'https://next-js-authentication-jwt-mui-production.up.railway.app',
      changeOrigin: true,
    })
  );
}
