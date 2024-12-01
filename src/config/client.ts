import { CozeAPI, COZE_CN_BASE_URL } from '@coze/api'
export const client = new CozeAPI({
  token: '',
  baseURL: COZE_CN_BASE_URL, // Use COZE_CN_BASE_URL for China region
  allowPersonalAccessTokenInBrowser: true
})
export const bot_id = ''
