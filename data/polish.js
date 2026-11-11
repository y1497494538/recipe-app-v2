/* 收尾脚本：① 按菜名去重（防止不同批次重复录入）② 详情页显示实物图 + Commons 署名。
   本文件在 manifest 里排最后，此时所有 data/dNN.js 已执行完毕、boot() 尚未调用。 */

(function () {
  var pool = window.RECIPES || [];
  var seenName = {};
  var seenId = {};
  var out = [];
  for (var i = 0; i < pool.length; i++) {
    var r = pool[i];
    if (!r || !r.name) continue;
    var n = String(r.name).trim();
    if (seenName[n]) continue;
    var id = String(r.id);
    if (seenId[id]) continue;
    seenName[n] = 1;
    seenId[id] = 1;
    out.push(r);
  }
  window.RECIPES = out;
})();

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
