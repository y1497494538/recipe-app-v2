/* 实物菜品图：key = 菜名，value = Wikimedia Commons 文件名（不含 File: 前缀）
   由 index.html 在 boot() 里拼成 Special:FilePath/<name>?width=800 并写入 r.img。
   全部文件名均已通过 Commons API 校验存在，未校验的一律不写，保持 emoji。 */
window.DISH_IMG = {
  '西红柿炒鸡蛋': 'Stir Fried Tomatoes with Scrambled Eggs.jpg',
  '红烧肉': 'Red braised pork (20141106191221).JPG',
  '宫保鸡丁': 'Kung Pao Chicken at Yujiayan Restaurant (20230510123120).jpg',
  '麻婆豆腐': 'Mapo doufu by Chen Mapo Restaurant in Chengdu Sichuan（陳麻婆豆腐店の麻婆豆腐）.JPG',
  '鱼香肉丝': '鱼香肉丝.jpg',
  '回锅肉': 'Twice-cooked Pork 回锅肉 (1648213963).jpg',
  '糖醋里脊': 'Tangcu liji.jpg',
  '黄焖鸡': 'Yellow braised chicken.jpg',
  '白切鸡': '农家菜之白切鸡.jpg',
  '孜然羊肉': '孜然羊肉.jpg',
  '水煮肉片': '家庭水煮肉片.jpg',
  '酸菜鱼': '酸菜鱼 Preserved Mustard Green with Fish - Charming Spice AUD24.80 (4104355401).jpg',
  '清蒸鲈鱼': '清蒸鲈鱼.jpg',
  '京酱肉丝': '京酱肉丝.jpg',
  '木须肉': 'Mu xu rou.jpg',
  '辣子鸡': '辣子鸡.jpg',
  '三杯鸡': 'Three Cup Chicken in Clay Pot.jpg',
  '白灼虾': 'Canto white boiled shrimp.jpg',
  '皮蛋豆腐': 'Pidan Doufu at Changranju, Beijing (20210627193105).jpg',
  '洋葱炒鸡蛋': '洋葱炒鸡蛋.jpg'
};

(function () {
  var base = 'https://commons.wikimedia.org/wiki/Special:FilePath/';
  var list = window.RECIPES || [];
  for (var i = 0; i < list.length; i++) {
    var r = list[i];
    var f = window.DISH_IMG[r.name];
    if (f && !r.img) {
      r.img = base + encodeURIComponent(f) + '?width=800';
    }
  }
})();
