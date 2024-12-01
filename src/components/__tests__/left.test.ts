import { describe, it, expect, vi } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import { mount } from '@vue/test-utils';
import { useConversationStore } from '@/stores/conversation';
import { createPinia, storeToRefs } from 'pinia';
import left from '../left.vue';

// 创建一个模拟的路由器
const routes = [
  { path: '/home', name: 'Home', component: { template: '<div>Home</div>' } },
  { path: '/chat/:id', name: 'Chat', component: { template: '<div>Chat</div>' } },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 创建一个模拟的 Pinia 存储
const pinia = createPinia();
pinia.use(({ store }) => {
  store.conversationList = [
    { id: 1, firstMessage: 'Hello' },
    { id: 2, firstMessage: 'Hi' },
  ];
  store.removeConversation = vi.fn();
});

// 挂载组件
const wrapper = mount(left, {
  global: {
    plugins: [router, pinia],
  },
});

describe('left', () => {
  it('should render the component correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should display the conversation list', () => {
    const conversationItems = wrapper.findAll('.perhistory');
    expect(conversationItems).toHaveLength(2);
    expect(conversationItems[0].text()).toBe('Hello');
    expect(conversationItems[1].text()).toBe('Hi');
  });

  it('should navigate to the chat page when a conversation is clicked', async () => {
    const conversationItem = wrapper.findAll('.perhistory')[0];
    await conversationItem.trigger('click');
    expect(router.currentRoute.value.name).toBe('Chat');
    expect(router.currentRoute.value.params.id).toBe('1');
  });

  it('should navigate to the home page when the new conversation button is clicked', async () => {
    const newConversationButton = wrapper.find('.new');
    await newConversationButton.trigger('click');
    expect(router.currentRoute.value.name).toBe('Home');
  });

  it('should call removeConversation when a conversation is deleted', async () => {
    const deleteButton = wrapper.findAll('.delete')[0];
    await deleteButton.trigger('click');
    expect(useConversationStore().removeConversation).toHaveBeenCalledWith(1);
  });
});
