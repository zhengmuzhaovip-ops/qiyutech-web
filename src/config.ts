// API 配置
// 开发环境使用 localhost，生产环境使用部署后的地址

const getApiUrl = (): string => {
  // 优先使用环境变量
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // 根据当前域名自动判断
  const hostname = window.location.hostname;
  
  // 本地开发
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // 生产环境 - Vercel 部署的后端地址
  return 'https://qiyutech-server.vercel.app/api';
};

export const API_BASE_URL = getApiUrl();

// 其他配置
export const config = {
  api: {
    baseUrl: API_BASE_URL,
    timeout: 30000, // 请求超时时间 30秒
  },
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },
  pagination: {
    defaultPageSize: 12,
    pageSizeOptions: [12, 24, 48, 96],
  },
};

export default config;
