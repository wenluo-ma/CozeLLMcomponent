const url = 'https://api.coze.cn/v1/space/published_bots_list'
import { API_KEY } from './API_key'
import axios from 'axios';


export async function publishedBotsList() {
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      params: {
        space_id: '7432962367199182874'
      }
    });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}
