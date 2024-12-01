<script setup>
import { useConversationStore } from '@/stores/conversation';
import { storeToRefs } from 'pinia';
import router from '@/router';
//更新历史记录
const conversationStore = useConversationStore()
const { conversationList} = storeToRefs(conversationStore)
// console.log(conversationList);
//处理跳转到已有的历史记录
function handleHistory(id) {
  // console.log('跳转到历史记录');
  // console.log(id);

  router.push({
    name: 'Chat',
    params: {
      id: id
    }
  })
  router.beforeEach((to, from, next) => {
  if (to.name === 'Chat' && from.name === 'Chat') {
    next(); // 先完成路由跳转
    setTimeout(() => {
      window.location.reload(true); // 使用 true 强制从服务器重新加载
    }, 0);
  } else {
    next();
  }
})
}
//处理新建会话
function newConversation() {
  // console.log('新建会话');
  router.push({
    name:'Home'
  })
}
//删除历史记录
function deleteHistory(id) {
  console.log('删除历史记录',id);
  conversationStore.removeConversation(id)
}
</script>

<template>
  <div class="left">

      <div class="title">
        <h5>chaojiwudixihuanluosifen</h5>
      </div>
      <div class="new box" @click="newConversation">
        新建对话
      </div>
    <div class="history">
      历史对话
    </div>
    <div class="perhistory" v-for="item in conversationList" :key="item.id" @click="handleHistory(item.id)">
      {{item.firstMessage}}
      <div class="delete" @click.stop="deleteHistory(item.id)"><el-icon><Delete /></el-icon></div>
    </div>
  </div>
</template>
<style>
.left{
  display: flex;
  flex-direction: column;
  justify-content:flex-start;
  align-items: center;
}
.title{
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.new:hover{
  cursor: pointer;
}
.history{
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  /* margin-bottom: 15px; */
  border-bottom: #c9c9c9 2px solid;
  margin-bottom: 20px;
}
.perhistory{
  height: 20px;
  width: 270px;
  padding-bottom: 5px;
  margin-bottom: 10px;
  border-bottom: 1px solid #c9c9c9;
  font-size: 15px;
}
.perhistory:hover{
  cursor: pointer;
}
.perhistory:hover .delete{
  display: block;
  float: right;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  /* background-color: #d5d5d5; */
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box{
  height: 50px;
  width: 270px;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
}
.delete{
  display: none;
  float: right;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  /* background-color: #d5d5d5; */
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
