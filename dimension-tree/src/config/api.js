/**
 * API 配置
 * 开发环境使用相对路径（通过 Vite 代理）
 * 生产环境使用完整后端域名
 */
const API_BASE = import.meta.env.VITE_API_BASE || '';

export const API_URL = API_BASE;
