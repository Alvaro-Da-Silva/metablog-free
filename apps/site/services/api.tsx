import axios from "axios";

const basePath = process.env.NEXT_PUBLIC_BASE_URL || ''

const baseURL = typeof window !== 'undefined'
  ? `${basePath}/api/blog`  // browser: usa proxy local (prefixado com basePath)
  : (process.env.APIBLOG_BASE_URL || process.env.NEXT_PUBLIC_APIBLOG_BASE_URL || '') // SSR: direto

export const api = axios.create({
  baseURL,
})

export default api