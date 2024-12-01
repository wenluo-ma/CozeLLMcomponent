import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import ClipboardJS from 'clipboard';

const md = new MarkdownIt();

md.set({
  highlight: function (str, lang) {
    let highlighted = str; // 默认为原始字符串
    if (lang && hljs.getLanguage(lang)) {
      try {
        highlighted = hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true,
        }).value;
      } catch (__) {
        highlighted = md.utils.escapeHtml(str); // 确保对于高亮失败的情况进行处理
      }
    } else {
      highlighted = md.utils.escapeHtml(str);
    }

    // 为代码块添加复制按钮，注意data-clipboard-text属性需要使用escapeHtml处理，避免HTML特殊字符导致的问题
    return `<div class="code-block"><pre class="hljs"><code>${highlighted}</code></pre><button class="copy-btn">复制</button></div>`;
  },
});


function initClipboard() {
  // 选择所有的复制按钮
  document.querySelectorAll('.copy-btn').forEach((button) => {
    console.log(button);
    // 为每个按钮创建一个ClipboardJS实例
    const clipboard = new ClipboardJS(button, {
      text: function (trigger) {
        // 检查trigger.previousElementSibling是否存在
        if (trigger.previousElementSibling) {
          return trigger.previousElementSibling.textContent || '';
        }
        return '';
      },

    });

    clipboard
      .on('success', function (e) {
        // 清除之前的定时器（如果有）
        clearTimeout(timeoutId);

        // 设置复制成功的反馈
        const originalText = '复制'; // 假设原始按钮文本是"复制"
        e.trigger.textContent = '已复制'; // 更改按钮文本为“复制成功”

        // 设置定时器，3秒后恢复原始文本
        timeoutId = setTimeout(() => {
          e.trigger.textContent = originalText; // 3秒后恢复原始文本
        }, 3000);

        e.clearSelection(); // 清除选中状态
      })
      .on('error', function (e) {
        console.error('复制失败！');
      });
  });
}

export { md, initClipboard };
