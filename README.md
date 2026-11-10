# 今日点菜 · 夫妻菜谱协作

对象在公司用网页点菜 → 你的微信立刻收到「**合并后的采购清单** + 每道菜的食材用量 + 分步做法」。

零成本、零续费、不用绑卡、不用小程序审核、页面**不依赖任何外部 CDN**。

---

## 已经上线了

| | 地址 |
| --- | --- |
| 你自己打开（不带密钥，只看菜） | https://y1497494538.github.io/recipe-app-v2/ |
| **发给对象的（带推送密钥）** | `https://y1497494538.github.io/recipe-app-v2/#SCT467513TGVvpMesdHzXOsblxqyeTVoQl` |

她第一次用这条带 `#SCT...` 的链接打开，页面把密钥存进她这台设备，然后自动从地址栏抹掉。之后她用不带密钥的地址也能正常点菜。

> ⚠️ 带 `#SCT...` 的链接本身就是凭证。谁拿到都能给你发点菜消息、消耗你的 ServerChan 额度。别发到公开群；万一外泄，去 https://sct.ftqq.com 重置 SendKey，重新生成一条链接。

---

## 它是怎么工作的

```
对象手机浏览器
   │  打开 GitHub Pages 静态页（index.html，零依赖）
   │
   └─► POST https://sctapi.ftqq.com/<SendKey>.send   (mode: no-cors)
            │
            └─► 你的微信（「方糖」服务号通知）
```

- **没有后端服务器** → 不产生费用，也不会因为免费额度到期停机
- **没有外部 JS/CSS**：不引 Vue、不引 Tailwind、没有图床。公司内网、弱网、断网重开都不影响页面本身
- 密钥不在仓库代码里，只在链接 `#` 片段（`#` 后面不会发给服务器，搜索引擎也搜不到）

页面底部两个按钮：

| 按钮 | 作用 |
| --- | --- |
| **发送** | 把清单推到你的微信 |
| **复制** | 把同一份文字复制到剪贴板，推送失败时手动粘到微信 |

推送用的是「发射后不管」（`no-cors`），浏览器读不到 ServerChan 的返回码。所以按钮提示写的是「**已发送请求**」，不是「已确认送达」。没收到就用「复制」。

---

## 改菜 / 加菜

**只改一个文件：`main` 分支的 `index.html` 里的 `RECIPES` 数组。**

推送到 `main` 后，GitHub Actions（`.github/workflows/sync-gh-pages.yml`）会自动把 `index.html` 发布到 `gh-pages` 分支，Pages 再重建。**不用手动碰 `gh-pages`。**

```js
{ id: 9, name: '可乐鸡翅', emoji: '🍖', time: '30 分钟', difficulty: '简单',
  ingredients: ['鸡中翅 500g', '可乐 1 罐', '生抽 2 勺'],
  steps: ['鸡翅划刀焯水', '煎到两面金黄', '倒可乐焖 20 分钟'] }
```

- `id` 不能重复
- `ingredients` 写成「名称 + 空格 + 用量」。采购清单会自动取空格前的名称去重合并（所以「盐 1 小勺」和「盐 适量」会合并成一个「盐」）
- `emoji` 是卡片顶部图标，纯字符，不依赖图片
- 改完等 1–2 分钟，或在地址后加 `?v=2` 强制刷新看新版

---

## 文件说明

| 文件 | 作用 |
| --- | --- |
| `index.html` | **纯静态版页面**（线上真正跑的就是它，原生 JS，零依赖） |
| `.github/workflows/sync-gh-pages.yml` | `main` → `gh-pages` 自动发布 |
| `server.js` | 可选的 Express 后端（想隐藏密钥 / 记录历史时用） |
| `public/index.html` | 后端版的同源前端 |
| `env.example` | 环境变量模板，**只有参数名，没有真实值** |
| `.gitignore` | 忽略 `.env`、`node_modules` |
| `Dockerfile` / `docker-compose.yml` | 容器化部署（可选） |

真实的 `.env` 只放在自己电脑上，永远不进仓库。

---

## 可选：后端版本

如果你以后想要「点菜历史 / 密钥不暴露在链接里 / 多设备统一」，用 Express 版更合适：密钥只存在服务端。

但 **Render 免费实例现在要求先绑卡**（接口返回 `402 Payment information is required`），所以只有在你自己愿意绑卡时才走这条路：

1. https://dashboard.render.com/billing 加卡
2. 新建 Web Service → 选本仓库
3. Build：`npm install --omit=dev`　Start：`npm start`
4. 环境变量 `SCT_SERVERCHAN_KEY` = 你的 SendKey

本地跑：`npm install && npm start` → http://localhost:3000

---

## 排查

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 页面显示「还差一步：绑定推送链接」 | 这台设备没存过密钥 | 用带 `#SCT...` 的完整链接再打开一次 |
| 点发送后微信没消息 | SendKey 错 / 免费额度用完 | 登录 https://sct.ftqq.com 看额度和 SendKey |
| 按钮提示已发送但没收到 | `no-cors` 读不到返回码，可能静默失败 | 用「复制」，粘到微信里发 |
| 改了菜页面没变 | Pages 还在构建 / 浏览器缓存 | 等 2 分钟，或加 `?v=2` |
| 想彻底不用链接带密钥 | 需要后端 | 见「可选：后端版本」 |
