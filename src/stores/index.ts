import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
const store = createPinia();
store.use(
  // 默认即为JSON序列化
  piniaPluginPersistedstate
);
export default store;
