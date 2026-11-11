/* 文字修正层：统一修正生成时被替换坏的字（同形异义字），
   只改 ing / steps / tip，不动菜名与结构。
   目标字用 fromCharCode 拼出来，避免修正表本身再被写错。 */
(function () {
  var C = String.fromCharCode;
  var YUN = C(21248);   // 匀
  var KONG = C(25471);  // 控
  var KUAI = C(22359);  // 块
  var YA = C(21387);    // 压
  var ZHE = C(25240);   // 折
  var BAN = C(25292);   // 拌
  var TANG = C(28907);  // 烫
  var GAN = C(24178);   // 干
  var JI = C(25380);    // 挤

  var map = [
    ['拌勺', BAN + YUN],
    ['拌' + YUN + YUN, BAN + YUN],
    ['权' + GAN, KONG + GAN],
    ['四塊', '四' + KUAI],
    ['小嚷', '少许'],
    ['关锤', '要点'],
    ['招断', ZHE + '断'],
    ['撜', YA],
    ['氟', '内层'],
    ['汄', TANG],
    ['掘', BAN],
    ['溿', GAN],
    ['瓒', BAN],
    ['戳牙', '硬'],
    ['肺 ', '放 '],
    ['酉豆瓣酱', '豆瓣酱'],
    ['撤掉浮沫', '舀掉浮沫'],
    ['撤干净浮沫', '舀掉浮沫'],
    ['攥' + GAN, JI + GAN]
  ];

  function fixStr(s) {
    if (typeof s !== 'string') return s;
    for (var i = 0; i < map.length; i++) {
      if (s.indexOf(map[i][0]) !== -1) s = s.split(map[i][0]).join(map[i][1]);
    }
    return s;
  }

  var all = window.RECIPES || [];
  for (var i = 0; i < all.length; i++) {
    var r = all[i];
    if (r.ing && r.ing.length) {
      for (var a = 0; a < r.ing.length; a++) r.ing[a] = fixStr(r.ing[a]);
    }
    if (r.steps && r.steps.length) {
      for (var b = 0; b < r.steps.length; b++) r.steps[b] = fixStr(r.steps[b]);
    }
    if (typeof r.tip === 'string') r.tip = fixStr(r.tip);
  }
})();
