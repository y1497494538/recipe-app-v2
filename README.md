# 今日点菜 · 夫妻菜谱协作

对象在公司用网页点菜，你的微信立刻收到「菜名 + 完整食材清单 + 做法步骤」。零成本、零续费、无需小程序审核。

线上地址：`https://y1497494538.github.io/recipe-app-v2/`

---

## 当前采用方案（免费、不需要绑卡）

**GitHub Pages 静态页 + ServerChan 直接推送**，没有后端服务器。

- 页面托管：GitHub Pages（永久免费）
- 消息通道：ServerChan（个人微信，免费额度，额度以 sct.ftqq.com 控制台为准）
- 费用：0 元/月，不需要银行卡

### 密钥怎么放才安全

`SendKey` **不写在仓库代码里**，只通过链接片段传递：

```
https://y1497494538.github.io/recipe-app-v2/#SCT你的SendKey
```

第一次打开时页面把 Key 存进本机 localStorage，然后从地址栏抹掉（`history.replaceState`），之后直接访问不带 Key 的地址也能用。

- 仓库是公开的，但**代码里没有密钥**
- 搜索引擎抓不到 `#` 后面的片段
- 只要把这条带 Key 的链接发给对象即可，不要发到公开群

> 风险提示：这条链接本身就是凭证。谁拿到它，谁就能给你发点菜消息（消耗你的 ServerChan 额度）。丢了就去 sct.ftqq.com 重置 SendKey，再生成新链接。

---

## 待完成：启用 GitHub Pages（只能账号本人点几下）

仓库文件已经全部上传，但 GitHub 的 Pages 开关必须由账号本人在网页上打开一次：

1. 打开 https://github.com/y1497494538/recipe-app-v2/settings/pages
2. **Source** 选 `Deploy from a branch`
3. **Branch** 选 `main`，目录选 `/ (root)`
4. 点 **Save**
5. 等 1–2 分钟，访问 `https://y1497494538.github.io/recipe-app-v2/`

---

## 可选方案：带后端的版本（需要绑卡）

仓库里同时保留了 Express 版本，适合以后想加「点菜历史 / 多设备 / 隐藏密钥」时用。

Render 目前要求**免费实例也必须先绑定银行卡**才能创建服务（接口返回 `402 Payment information is required`），所以你如果愿意绑卡：

1. https://dashboard.render.com/billing 添加卡片
2. 新建 Web Service → 连接本仓库
3. Build Command：`npm install --omit=dev`
4. Start Command：`npm start`
5. 环境变量：`SCT_SERVERCHAN_KEY` = 你的 SendKey
6. 部署完成后访问 Render 域名，前后端同源，不再需要 GitHub Pages

本地跑：`npm install && npm start`，打开 `http://localhost:3000`。

---

## 文件说明

| 文件 | 作用 |
| --- | --- |
| `index.html` | **线上用的纯静态页面**（GitHub Pages 部署的就是它） |
| `server.js` | 可选的 Express 后端，`/api/recipes`、`/api/send-wechat` |
| `public/index.html` | 后端版的同源前端页面 |
| `env.example` | 环境变量模板，**只有参数名，没有真实值** |
| `.gitignore` | 忽略 `.env`、`node_modules` |
| `Dockerfile` / `docker-compose.yml` | 容器化部署（可选） |

---

## 加菜 / 改菜

静态版：编辑 `index.html` 里的 `RECIPES` 数组，提交后 Pages 自动更新。
后端版：编辑 `server.js` 里的 `RECIPES` 数组。

```js
{ id:7, name:'可乐鸡翅', image:'图片URL',
  ingredients:['鸡翅 500g','可乐 1 罐','生抽 2 勺'],
  steps:['鸡翅划刀焯水','煎至两面金黄','倒可乐焖 20 分钟'], difficulty:'简单', time:'30 分钟' }
```

`id` 不能重复。

---

## 排查

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 页面 404 | Pages 没开或还在构建 | 检查 Settings → Pages，等 2 分钟 |
| 点发送没反应，微信没消息 | Key 错 / 额度用完 | 重新打开带 `#SCT...` 的链接；去 sct.ftqq.com 看额度和 SendKey |
| 页面显示"还差一步" | 本机没存到 Key | 用带 `#SCT...` 的完整链接再打开一次 |
| 图片加载慢 | Unsplash 国内偶尔慢 | 换成自己的图床链接 |