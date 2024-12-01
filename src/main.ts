// import './assets/main.css'

import { createApp } from 'vue'
import store from '@/stores'
import App from './App.vue'
import router from './router';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIconList from '@element-plus/icons-vue'
//@ts-ignore
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
//@ts-ignore
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js'; // highlightjs
VMdPreview.use(githubTheme, {
  Hljs: hljs,
});

const app = createApp(App)
app.use(router)
// const pinia = createPinia();
// pinia.use(piniaPluginPersist);
app.use(store)
app.use(ElementPlus)
app.use(VMdPreview);
for (const name in ElIconList) {
  app.component(name, ElIconList[name as keyof typeof ElIconList]);
}

app.mount('#app')
