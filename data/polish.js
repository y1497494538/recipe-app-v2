/* 详情页增强：点开某道菜时，如果它有实物图，就在弹层顶部显示照片 + Commons 署名。
   这里不改 index.html，而是包一层 window.openDish（index.html 里 openDish 是全局函数声明）。 */
(function () {
  if (typeof window.openDish !== 'function') return;
  var orig = window.openDish;

  window.openDish = function (id) {
    orig(id);

    var pool = window.RECIPES || [];
    var r = null;
    for (var i = 0; i < pool.length; i++) {
      if (String(pool[i].id) === String(id)) { r = pool[i]; break; }
    }
    var panel = document.getElementById('panel');
    if (!r || !r.img || !panel) return;

    var html = '<img src="' + r.img + '" alt="' + r.name + '" ' +
      'style="width:100%;border-radius:12px;display:block;margin:0 0 6px" ' +
      'onerror="this.style.display=\'none\'">';

    var f = (window.DISH_IMG && window.DISH_IMG[r.name]) || '';
    if (f) {
      html += '<div style="font-size:11px;color:#8a827a;margin:0 0 12px">图片：' +
        '<a href="https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(f) + '" ' +
        'target="_blank" rel="noopener" style="color:#8a827a;text-decoration:underline">Wikimedia Commons</a></div>';
    }

    panel.insertAdjacentHTML('afterbegin', html);
  };
})();
