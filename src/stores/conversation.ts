import type { Conversation, Messages } from '@coze/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';
interface PerConversation {
  id: string,
  firstMessage: string
}
export const useConversationStore = defineStore('conversation', () => {
  const conversationList = ref<PerConversation[]>([]);

  // const storedConversationList = localStorage.getItem('conversationList');

  const addConversation = (id: string, firstMessage: string) => {
    conversationList.value.push({
      id: id,
      firstMessage: firstMessage
    })
    //pinia持久化
    // localStorage.setItem('conversationList', JSON.stringify(conversationList.value));

  }
  const removeConversation = (id: string) => {
    conversationList.value = conversationList.value.filter((item) => item.id!== id);
  }
  return {
    conversationList,
    // storedConversationList,
    addConversation,
    removeConversation

  }

},{
  persist: true
})
