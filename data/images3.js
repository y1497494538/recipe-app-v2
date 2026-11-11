window.DISH_IMG3 = {
'剁椒鱼头': 'Steamed fish head with diced hot red peppers 20211206.jpg',
'大盘鸡': 'Dapanji Uyghur Style.jpg',
'咕咾肉': '菠萝咕噜肉.jpg',
'木须肉': 'Mu xu rou.jpg',
'卤蛋': 'Soy egg.jpg',
'鸡蛋羹': '鸡蛋羹配野生菌-云南昆明.jpg',
'韭菜盒子': 'Jiucai Hezi at Dongsi Minfang Restaurant, Chongwenmen (20220215114852).jpg',
'小笼包': 'Xiao Long Bao by Junhao!.jpg',
'葱油饼': 'Spring onion pancake 2013.JPG',
'肉夹馍': 'Roujiamo.jpg',
'牛肉面': '兰州牛肉面.jpg',
'千层饼': '蒋孝顺千层饼.jpg',
'台式卤肉饭': 'Lurou fan(Taiwanese cuisine).jpg',
'凉拌黄瓜': '凉拌黄瓜.jpg',
'蒜泥白肉': '蒜泥白肉 Sliced Belly Pork and Cucumber Rolls with Garlic Sauce.jpg',
'糖醋鲤鱼': '糖醋鲤鱼2024（德州）.jpg',
'蒜蓉蒸扇贝': 'Minced garlic glass noodle scallops.jpg',
'梅菜扣肉': '11月17日 梅菜扣肉.jpg',
'粉蒸肉': '粉蒸肉.jpg',
'香辣鸡翅': '香辣鸡翅（2026年7月14日）.jpg',
'锅包肉': '东北锅包肉.jpg',
'蚂蚁上树': '蚂蚁上树01.jpg',
'家常豆腐': 'Jiācháng dòufǔ, marinated cucumbers, miso soup with wakame seaweed and scallions, and rice 家常豆腐、キュウリの即席昆布漬け、ワカメとネギの味噌汁、白米.jpg'
};
(function(){
  var m = window.DISH_IMG3 || {};
  var list = window.RECIPES || [];
  for (var i = 0; i < list.length; i++) {
    var r = list[i];
    if (!r.img && m[r.name]) {
      r.img = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(m[r.name]) + '?width=800';
    }
  }
})();
