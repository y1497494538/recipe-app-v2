# 今日点菜 · 夫妻菜谱协作

对象在公司用网页点菜，你的微信立刻收到「**合并后的采购清单** + 每道菜的食材用量 + 分步做法」。

零成本、零续费、不用绑卡、不用小程序审核。

---

## 已经能用了

**线上地址**：https://y1497494538.github.io/recipe-app-v2/

**对象用的地址（带推送密钥，发她微信即可）**：

```
https://y1497494538.github.io/recipe-app-v2/#SCT467513TGVvpMesdHzXOsblxqyeTVoQl
```

她第一次打开这个链接，页面会把密钥存进她手机，然后自动从地址栏抹掉。之后她直接开不带密钥的地址也能用。

> ⚠️ 这条带 `#SCT...` 的链接本身就是凭证。谁拿到都能给你发点菜消息、消耗你的 ServerChan 额度。别发到公开群；万一外泄，去 https://sct.ftqq.com 重置 SendKey，换一条新链接。

---

## 它是怎么工作的

```
对象的手机浏览器  ──►  GitHub Pages 静态页（免费托管）
                          │
                          └─► fetch POST https://sctapi.ftqq.com/<KEY>.send
                                   │
                                   └─►  你的微信（服务号「方糖」）
```

没有后端服务器，所以：

- **不需要信用卡**（Render 的免费实例现在也要求绑卡，所以没走那条路）
- **不会产生任何费用**
- 密钥不在仓库代码里，只在链接的 `#` 片段里（`#` 后面的内容不会发给服务器，也搜不到）

页面上有两个按钮：

| 按钮 | 作用 |
| --- | --- |
| **发送** | 直接把清单推到你的微信 |
| **复制** | 把同一份文字复制到剪贴板，万一推送失败可以手动粘到微信 |

推送是 `mode: 'no-cors'` 的「发射后不管」，浏览器读不到 ServerChan 的返回。所以按钮显示的是「已发送请求」，**不是「已确认送达」**。没收到就用「复制」。

---

## 改了菜之后怎么上线

线上实际服务的分支是 **`gh-pages`**（GitHub 在没有 Pages 配置时，检测到 `gh-pages` 分支会自动发布，这次就是靠它零点击上线的）。

所以改菜要改两处、保持一致：

| 分支 | 文件 | 用途 |
| --- | --- | --- |
| `main` | `index.html` | 源码副本 / 以后换托管时用 |
| `gh-pages` | `index.html` | **线上真正跑的那份** |

改完 `gh-pages` 后等 1–2 分钟，Pages 会重新构建。

菜谱数据就是文件里的 `RECIPES` 数组：

```js
{ id:9, name:'可乐鸡翅', emoji:'🍖', time:'30 分钟', difficulty:'简单',
  ingredients:['鸡中翅 500g','可乐 1 罐','生抽 2 勺'],
  steps:['鸡翅划刀焯水','煎到两面金黄','倒可乐焖 20 分钟'] }
```

- `id` 不能重复
- `ingredients` 里「名称 + 空格 + 用量」，采购清单会自动取空格前的名称去重合并（所以「盐 1 小勺」和「盐 适量」会合并成一个「盐」）
- `emoji` 决定卡片顶部的图标，不依赖任何外链图片，国内加载也快

---

## 可选：想要更稳的推送 / 后端版本

仓库里保留了 Express 版本（`server.js` + `public/index.html`），前后端同源、密钥放在服务端，比纯静态更安全。

但 Render 免费实例现在要求先绑卡（接口返回 `402 Payment information is required`），所以只有在你自己愿意绑卡时再考虑：

1. https://dashboard.render.com/billing 加卡
2. 新建 Web Service → 选本仓库
3. Build：`npm install --omit=dev`　Start：`npm start`
4. 环境变量 `SCT_SERVERCHAN_KEY` = 你的 SendKey

本地跑：`npm install && npm start` → http://localhost:3000

---

## 文件说明

| 文件 | 作用 |
| --- | --- |
| `index.html` | 纯静态版页面（无后端，Pages 用） |
| `server.js` | 可选的 Express 后端 |
| `public/index.html` | 后端版的同源前端 |
| `env.example` | 环境变量模板，**只有参数名，没有真实值** |
| `.gitignore` | 忽略 `.env`、`node_modules` |
| `Dockerfile` / `docker-compose.yml` | 容器化部署（可选） |

真实的 `.env` 只放在自己电脑上，永远不进仓库。

---

## 排查

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 页面显示「还差一步：绑定推送链接」 | 这台设备没存过密钥 | 用带 `#SCT...` 的完整链接再打开一次 |
| 点发送后微信没消息 | SendKey 错 / 免费额度用完 | 登录 https://sct.ftqq.com 看额度和 SendKey |
| 微信收到但内容乱码 | 极少数客户端编码问题 | 用页面上的「复制」按钮，粘过去一定正常 |
| 改了菜页面没变 | Pages 还在构建 / 浏览器缓存 | 等 2 分钟，或加 `?v=2` 强制刷新 |
| 想换服务器 / 停机 | Pages 免费且稳定 | 无需处理 |
