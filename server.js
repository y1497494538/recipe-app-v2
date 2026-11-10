require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// 菜谱主数据（唯一数据源，前端只读，服务端按 id 查）
const RECIPES = [
  {
    id: 1,
    name: '红烧肉',
    image: 'https://images.unsplash.com/photo-1544025162-d76694255947?w=400&h=300&fit=crop',
    ingredients: ['五花肉 500g', '生抽 2 勺', '老抽 1 勺', '冰糖 适量', '姜片 3 片', '料酒 2 勺'],
    steps: ['五花肉切块焯水', '锅中放油炒糖色', '放入肉块翻炒上色', '加入调料炖煮 60 分钟'],
    difficulty: '中等',
    time: '60 分钟'
  },
  {
    id: 2,
    name: '宫保鸡丁',
    image: 'https://images.unsplash.com/photo-1512058564366-18b5b5d279dc?w=400&h=300&fit=crop',
    ingredients: ['鸡胸肉 300g', '花生米 50g', '葱姜蒜 适量', '干辣椒 5 个', '酱油 2 勺', '醋 1 勺', '糖 1 勺'],
    steps: ['鸡肉切丁腌制', '热油炒鸡丁', '加入调料翻炒', '放入花生米出锅'],
    difficulty: '简单',
    time: '25 分钟'
  },
  {
    id: 3,
    name: '西红柿炒鸡蛋',
    image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&h=300&fit=crop',
    ingredients: ['西红柿 3 个', '鸡蛋 3 个', '葱花 适量', '盐 1 勺', '糖 0.5 勺', '油 2 勺'],
    steps: ['鸡蛋炒散盛出', '炒西红柿出汁', '混合翻炒', '调味装盘'],
    difficulty: '简单',
    time: '15 分钟'
  },
  {
    id: 4,
    name: '麻婆豆腐',
    image: 'https://images.unsplash.com/photo-1599305090598-352551758723?w=400&h=300&fit=crop',
    ingredients: ['豆腐 400g', '肉末 100g', '豆瓣酱 2 勺', '花椒 适量', '葱姜蒜 适量', '蒜苗 1 根'],
    steps: ['豆腐切块焯水', '炒肉末和豆瓣酱', '加入豆腐炖煮', '撒花椒粉和蒜苗'],
    difficulty: '中等',
    time: '30 分钟'
  },
  {
    id: 5,
    name: '清蒸鲈鱼',
    image: 'https://images.unsplash.com/photo-1519708277372-4378ab417234?w=400&h=300&fit=crop',
    ingredients: ['鲈鱼 1 条', '姜片 5 片', '葱段 2 根', '蒸鱼豉油 3 勺', '油 2 勺', '盐 1 勺'],
    steps: ['鱼处理干净', '放葱姜腌制 10 分钟', '蒸 8-10 分钟', '淋热油和豉油'],
    difficulty: '容易',
    time: '20 分钟'
  },
  {
    id: 6,
    name: '回锅肉',
    image: 'https://images.unsplash.com/photo-1539422539213-6a2b92a6a8c5?w=400&h=300&fit=crop',
    ingredients: ['五花肉 400g', '青蒜 2 根', '豆瓣酱 2 勺', '豆豉 1 勺', '甜面酱 1 勺', '糖 0.5 勺'],
    steps: ['肉煮熟切片', '煸炒出油', '加入酱料', '放入青蒜翻炒'],
    difficulty: '中等',
    time: '35 分钟'
  }
];

const byId = new Map(RECIPES.map((r) => [r.id, r]));

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '64kb' }));

// 前端静态页（与 API 同源，免去 CORS 和双地址配置）
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/recipes', (req, res) => {
  res.json({ success: true, data: RECIPES });
});

function buildMessage(picked) {
  const lines = ['有人点菜啦 🥢', ''];
  picked.forEach((item, i) => {
    lines.push((i + 1) + '. ' + item.name + '（' + item.time + '）');
    lines.push('   食材：' + item.ingredients.join('、'));
    lines.push('   做法：' + item.steps.join(' → '));
    lines.push('');
  });
  const total = picked.reduce((sum, r) => sum + parseInt(r.time, 10), 0);
  lines.push('合计约 ' + total + ' 分钟');
  return lines.join('\n');
}

app.post('/api/send-wechat', async (req, res) => {
  try {
    const ids = Array.isArray(req.body && req.body.ids) ? req.body.ids : [];
    if (ids.length === 0) {
      return res.status(400).json({ success: false, message: '还没选菜' });
    }

    // 只信任服务端主数据，忽略前端传过来的任何文本
    const picked = ids.map((id) => byId.get(Number(id))).filter(Boolean);
    if (picked.length === 0) {
      return res.status(400).json({ success: false, message: '菜品不存在' });
    }

    const SCKEY = process.env.SCT_SERVERCHAN_KEY;
    if (!SCKEY) {
      console.error('SCT_SERVERCHAN_KEY missing');
      return res.status(500).json({ success: false, message: '服务端未配置推送密钥' });
    }

    const note = typeof req.body.note === 'string' ? req.body.note.slice(0, 200) : '';
    const desp = note ? buildMessage(picked) + '\n\n留言：' + note : buildMessage(picked);
    const title = '今日点菜：' + picked.map((r) => r.name).join('、');

    const body = new URLSearchParams({ title, desp });
    const { data } = await axios.post(
      'https://sctapi.ftqq.com/' + SCKEY + '.send',
      body,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 15000 }
    );

    if (data && data.code !== 0) {
      console.error('serverchan rejected', data);
      return res.status(502).json({ success: false, message: data.message || '推送被拒绝' });
    }

    res.json({ success: true, message: '已推送', data: { code: data && data.code } });
  } catch (error) {
    console.error('push failed:', error.message);
    res.status(500).json({ success: false, message: '推送失败，请稍后重试' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log('recipe server listening on ' + PORT);
});
