<script setup>
import { defineProps, onMounted, ref, nextTick } from 'vue';
import { client,bot_id } from '@/config/client'

import { ChatEventType } from '@coze/api';
import { useConversationStore } from '@/stores/conversation';
import { storeToRefs } from 'pinia';

// 引入markdown
import { md } from '@/markdownit'

import ClipboardJS from 'clipboard';
import 'highlight.js/styles/github.css'

onMounted(() => {
  nextTick(() => {
    // console.log('chatTest mounted');
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        console.log('点击了复制按钮');
        const clipboard = new ClipboardJS('.copy-btn');
        clipboard.on('success', (e) => {
          console.log('复制成功');
          e.clearSelection();
        });
        clipboard.on('error', (e) => {
          console.log('复制失败');
        });
      });
    })

    // initClipboard();
  })
})

let input = ref('');
let question = ref('');
let answer = ref('');
//接收路由id
const props = defineProps({
  id: {
    type: String,
    // required: true,
    default: '',
  },
});
//定义一个数组接显示所有会话数据
let messages = ref([
])




//定义chatContainer，在该页面滚动到最低端
const chatContainer = ref(null);
onMounted(() => {
  chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  // console.log('滚动到底部');
})
//定义文件id，用来判断是否是文件上传
let fileId = ref('');
//定义页面顶部的对话名
let title = ref('');
// 接收会话历史数据
async function getChatData() {

  let data = await client.conversations.messages.list(
    props.id,
  );
  messages.value = data.data;
  //将messages.value倒序
  messages.value.reverse();
  chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  // console.log(messages.value);
  if (messages.value.length == 1) {
    console.log('没有历史数据', messages.value.length);
    let conversationStore = useConversationStore();
    let { conversationList } = storeToRefs(conversationStore);
    conversationList.value.forEach(item => {
      if (item.id === props.id) {
        input.value = item.firstMessage;
        console.log('firstQuestion', input.value);
        title.value = item.firstMessage;
        submit();

      }
    })
  }
}

getChatData();


//在该页面发送消息并接收回复

async function submit() {
  question.value = input.value;
  chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  input.value = '';
  if (!question.value) {
    return;
  }
  console.log(question.value);
  let response
  if (fileId.value) {
    console.log('有文件上传');
    console.log(fileId.value);
    response = await client.chat.stream({
      bot_id: bot_id,
      stream: true,
      conversation_id: props.id,
      additional_messages: [
        {
          role: 'user',
          file_id: fileId.value,
          content_type: 'file',
        }
      ],
    })
  }
    response = await client.chat.stream({
      bot_id: bot_id,
      stream: true,
      conversation_id: props.id,
      additional_messages: [
        {
          role: 'user',
          content: question.value,
          content_type: 'text',
        },
      ],
    })



  for await (const part of response) {
    if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
      // process.stdout.write(part.data.content) // Real-time response
      answer.value += part.data.content
      // console.log(answer.value);
      //chat-container永远滚动到最低端
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;

    }
    //结束，清空answer,question,并且将question,answer添加到messages.value中
    if (part.event === ChatEventType.CONVERSATION_CHAT_COMPLETED) {
      messages.value.push({
        role: 'user',
        content: question.value,
        content_type: 'text',
      })
      messages.value.push({
        role: 'assistant',
        content: answer.value,
        content_type: 'text',
      })
      answer.value = '';
      question.value = ''
    }
  }

}
//给代码提供复制功能
// onMounted(() => {
//   nextTick(() => {
//   const codeBlocks = document.querySelectorAll('pre');
//   console.log(codeBlocks);
//   //添加一个复制按钮
//   codeBlocks.forEach((block) => {
//     const copyButton = document.createElement('button');
//     copyButton.innerText = '复制';
//     copyButton.classList.add('copy-button');
//     block.appendChild(copyButton);

//     copyButton.addEventListener('click', () => {
//       navigator.clipboard.writeText(block.innerText);
//       copyButton.innerText = '已复制';
//       setTimeout(() => {
//         copyButton.innerText = '复制';
//       }, 2000);
//     });
//   });
// })
// })
//实现文件上传功能
let FileIsUpload = ref(false);
const file = ref(null);
function submitUpload() {
  FileIsUpload.value ? (FileIsUpload.value = false) : (FileIsUpload.value = true);

}
const handleFileChange = async (event) => {
  file.value = event.target.files[0];
  if (!file.value) {
    el.alert('请选择文件');
    return;
  }
  const fileObj = await client.files.upload({ file: file.value });
  console.log('client.files.upload', fileObj);
  fileId.value = fileObj.id;
};
</script>
<template>
  <div class="head">
    <div class="title">{{ title }}</div>
  </div>
  <div class="chat-container" ref="chatContainer">
    <div v-for="(item, index) in messages" :key="index" :class="`message ${item.role}`">
      <div class="message-content markdown-body" v-html="md.render(item.content)"></div>
    </div>
    <div v-show="question" class="message user markdown-body" v-html="md.render(question)"></div>
    <div v-show="answer" class="message assistant markdown-body" v-html="md.render(answer)"></div>
  </div>
  <div class="chatinput">
    <textarea id="large-text-input" name="large-text-input" v-model="input" class="chat-large-text-model haveFile"
      placeholder="问点什么呢">
      </textarea>
    <div class="chat-submit first"  @click="submitUpload"><el-icon><Picture /></el-icon></div>
    <div v-show="FileIsUpload" class="upload">
      <input type="file" id="fileInput" @change="handleFileChange" accept=".pdf,.doc,.docx,.txt">
    </div>
    <div class="chat-submit" @click="submitUpload"><el-icon><DocumentAdd /></el-icon></div>
    <div class="chat-submit" @click.stop="submit"><el-icon><Top /></el-icon></div>
  </div>
</template>
<style>
.head {
  float: left;
  width: calc(100% - 300px);
  height: 50px;
  /* background-color: rgb(234, 234, 234); */
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgb(255, 255, 255));

}

.title {
  text-align: center;
  line-height: 50px;
}

.chat-container {
  /* background-color: azure; */
  height: calc(100vh - 200px);
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  padding: 20px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.chat-container::-webkit-scrollbar {
  display: none;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  max-width: 90%;
  word-wrap: break-word;
}

.message.user {
  align-self: flex-end;
  background-color: #0077ff;
  color: white;
}

.message.assistant {
  align-self: flex-start;
  background-color: #fafafa;
}

.chatinput {
  width: calc(100% - 322px);
  height: 83px;
  float: left;
  /* background-color: antiquewhite; */
  padding: 10px 0;
  margin: 0 10px;
  margin-bottom: 5px;
  border: 1px solid #c9c9c9;
  border-radius: 10px;
}

.chat-large-text-model {
  float: left;
  margin-left: 5px;
  width: calc(100% - 280px);
  height: 100%;
  line-height: 1.5;
  resize: none;
  font-family: "微软雅黑";
  border: none;

}

/* .haveFile{
  float: left;
  margin-left: 5px;
  width: calc(100% - 280px);
  height: 100%;
  line-height: 1.5;
  resize: none;
  font-family: "微软雅黑";
  border: none;
} */
.chat-large-text-model:focus {
  outline: none;
  border: none;
}

.chat-submit {
  margin-top: 50px;
  margin-left: 15px;
  float: left;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background-color: #ededed;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}


.first {
  margin-left: 135px;
}

.upload {
  position: absolute;
  right: 32px;
  bottom: 60px;
  width: 240px;
  height: 40px;
  border-radius: 10px;
  background-color: #ededed;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
#fileInput{
  width: 90%;
  background-color: #ededed;
}
</style>
