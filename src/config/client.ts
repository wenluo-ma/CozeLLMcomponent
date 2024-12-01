import { CozeAPI, COZE_CN_BASE_URL } from '@coze/api'
export const client = new CozeAPI({
  token: 'pat_eVYleDKSIbf1V8tIzTHAygDeuyjPanvpjC6OV5W6vAkW3KAGpBsJIB9uKNw2kMBu',
  baseURL: COZE_CN_BASE_URL, // Use COZE_CN_BASE_URL for China region
  allowPersonalAccessTokenInBrowser: true
})
export const bot_id = '7433399372433440820'
