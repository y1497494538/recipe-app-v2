/* 第二批实物图：文件名已在 Wikimedia Commons 搜到并核实存在 */
window.DISH_IMG2 = {
  '糖醋排骨': '糖醋排骨.JPG',
  '红烧排骨': '红烧排骨 Braised Pork Ribs - Dainty Sichuan (2283778476).jpg',
  '可乐鸡翅': '可乐鸡翅.jpg',
  '红烧茄子': '红烧茄子-云南昆明.jpg',
  '地三鲜': 'Di san xian (home-made).jpg'
};

(function () {
  var all = window.RECIPES || [];
  for (var i = 0; i < all.length; i++) {
    var r = all[i];
    if (r.img) continue;
    var file = window.DISH_IMG2[r.name];
    if (file) {
      r.img = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(file) + '?width=800';
    }
  }
})();
