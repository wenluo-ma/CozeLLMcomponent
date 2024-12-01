<template>
  <div class="home">
    <div class="top">
      <div class="search" ref="search">
        <div><el-icon>
            <Search />
          </el-icon></div>

      </div>
    </div>
    <h2>chaojiwudixihuanluosifen</h2>
    <div class="input">
      <textarea id="large-text-input" name="large-text-input" class="large-text-model" v-model="question"
        placeholder="问点什么呢">
      </textarea>
      <div class="submit"><el-icon>
          <Picture />
        </el-icon></div>
      <div class="submit"><el-icon>
          <DocumentAdd />
        </el-icon></div>
      <div class="submit" @click.stop="submit"><el-icon>
          <Top />
        </el-icon></div>
    </div>


  </div>

</template>
<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { client } from '@/config/client'
import { RoleType, type Conversation } from '@coze/api';
import { useConversationStore } from '@/stores/conversation';
import router from '@/router';

const conversationStore = useConversationStore()

let question = ref('')

let search = ref(null)



async function submit() {
  if (question.value == '') return
  console.log(question.value);
  //新建一个会话，发送携带问题的请求
  //输入内容是纯文本的情况下，新建一个会话

  const conversation = await client.conversations.create({
    messages: [
      {
        role: RoleType.Assistant,
        content_type: 'text',
        content: '我是Coze。人，你可以向我提问',
      }
    ]
  }
  )

  // console.log(conversation);

  //把得到的会话id和问题存入pinia里

  conversationStore.addConversation(
    conversation.id,
    question.value
  )

  //动态路由根据会话id跳转到会话页面
  router.push({
    name: 'Chat',
    params: {
      id: conversation.id
    }
  })
  //第一个问题也传给会话页面



  question.value = ''

}

</script>
<style>
.home {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  height: 100vh;
}

.top {
  height: 60px;
  /* background-color: silver; */
  /* line-height: 50px; */
  width: 100%;
}

.search {
  position: absolute;
  right: 50px;
  top: 20px;
  width: 200px;
  height: 40px;
  border-radius: 10px;
  padding-left: 10px;
  background-color: #f2f2f2;
  display: flex;
  justify-content: left;
  align-items: center;

}

.active {
  display: block;
  width: 70vw;
  height: 80vh;
  z-index: 999;
}

h2 {
  margin-top: 80px;
  margin-bottom: 60px;
}

.input {
  width: 700px;
  height: 100px;
  font-size: 16px;
  padding: 10px;
  border: 1px solid #c9c9c9;
  border-radius: 10px;
  box-shadow: 10px 10px 15px rgba(215, 215, 215, 0.5)
}

.large-text-model {
  float: left;

  width: 80%;
  height: 100%;
  line-height: 1.5;
  resize: none;
  font-family: "微软雅黑";
  border: none;

}

.large-text-model:focus {
  outline: none;
  border: none;
}

.submit {
  margin-top: 60px;
  margin-left: 10px;
  float: left;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background-color: #e6e6e6;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease-in-out;
}

.demo {
  margin-top: 40px;
  width: 720px;
  height: 330px;
  /* background-color: #c9c9c9; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.demobox {
  border: 1px solid #c9c9c9;
  border-radius: 10px;
  width: 47%;
  height: 100%;
  /* background-color: #e3e3e3; */
}

.demoTitle {
  font-size: 18px;
  height: 20px;
  padding: 10px;
}

.writingBox {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
</style>
