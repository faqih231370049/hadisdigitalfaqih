(function($) {
var maxZ = 0;
$.fn.easyDrag = function(params) {
if(params == "kill"){
this.each(function(){ var self = $(this); 
var handle = self.data('handle');
handle.off('mousedown', easyDrag_onMouseDown);
handle.off('touchstart', easyDrag_onTouchStart);
handle.css('cursor', '');
self.removeClass('easydrag_enabled');
}); 
} else if(params == 'killall'){ 
$('.easydrag_enabled').easyDrag('kill'); 
} else {
params = $.extend({
handle: '.handle', 
axis: false, 
container: false, 
start: function(){},
drag: function(){},
stop: function(){},
cursor: 'move', 
ontop: true,
clickable: true
}, params);
this.each(function(){ var self = $(this);
if(!self.hasClass('easydrag_enabled')){ 
if(params.handle == 'this' || self.find(params.handle).length==0){
var handle = self;
} else {
var handle = self.find(params.handle);
}
if(params.cursor != ''){ handle.css('cursor', params.cursor); } 
handle.data(params);
var boulet = self;
boulet.addClass('easydrag_enabled'); 
boulet.data('handle', handle); 
handle.data('boulet', boulet);
if(self.css('z-index')!='auto' && params.ontop){
maxZ = Math.max(maxZ, self.css('z-index'));
};
if(self.css('position') != 'absolute' && self.css('position') != 'fixed'){
if(self.css('left') == 'auto'){ self.css('left', '0'); } 
if(self.css('top') == 'auto'){ self.css('top', '0'); }
self.css('position', 'relative');
}
handle.on('mousedown', easyDrag_onMouseDown);
handle.on('touchstart', easyDrag_onTouchStart);
}
});
}
return this;
};
var self, t, boulet, initItemX, initItemY, initEventX, initEventY, axis, container, refX, refY; 
function easyDrag_onMouseDown(event){ event.preventDefault();
t = Date.now();
self = $(this); 
boulet = self.data('boulet');
initItemX = parseInt(boulet.css('left'));
initItemY = parseInt(boulet.css('top'));
axis = self.data('axis');
container = self.data('container');
initEventX = event.pageX;
initEventY = event.pageY;
if(container.length){
refX = self.offset().left;
refY = self.offset().top;
}
self.data('start').call(boulet);
$(document).on('mousemove', easyDrag_onMouseMove);
$(document).on('click', easyDrag_onMouseUp);
if(self.data('ontop')){ 
maxZ++;
boulet.css('z-index', maxZ);
}
}
function easyDrag_onMouseMove(e){ e.preventDefault();
self.data('drag').call(boulet); 
var nextX = initItemX + e.pageX-initEventX;
var nextY = initItemY + e.pageY-initEventY;
if(!axis || axis=='x'){ boulet.css({'left': nextX+'px'}); }
if(!axis || axis=='y'){ boulet.css({'top': nextY+'px'}); }
easyDrag_contain();
}
function easyDrag_onMouseUp(e){ 
$(document).off('mousemove', easyDrag_onMouseMove);
$(document).off('click', easyDrag_onMouseUp);
self.data('stop').call(boulet); 
var d = Date.now() - t;
if(d>300 || !self.data('clickable')){
e.preventDefault(); 
e.stopPropagation();
} 
}
function easyDrag_onTouchStart(event){ event.preventDefault(); 
t = Date.now();
self = $(this); 
boulet = self.data('boulet');
initItemX = parseInt(boulet.css('left'));
initItemY = parseInt(boulet.css('top'));
axis = self.data('axis');
container = self.data('container');
if(container.length){
refX = self.offset().left;
refY = self.offset().top;
}
var touch = event.originalEvent.changedTouches[0];
initEventX = touch.pageX;
initEventY = touch.pageY;
self.data('start').call(boulet);
$(document).on('touchmove', easyDrag_onTouchMove);
$(document).on('touchend', easyDrag_onTouchEnd);
if(self.data('ontop')){ 
maxZ++;
boulet.css('z-index', maxZ);
}
}
function easyDrag_onTouchMove(e){ e.preventDefault();
self.data('drag').call(boulet); 
var touch = e.originalEvent.changedTouches[0];
var nextX = initItemX + touch.pageX-initEventX;
var nextY = initItemY + touch.pageY-initEventY;
if(!axis || axis=='x'){ boulet.css({'left': nextX+'px'}); }
if(!axis || axis=='y'){ boulet.css({'top': nextY+'px'}); }
easyDrag_contain();
}
function easyDrag_onTouchEnd(e){
$(document).off('touchmove', easyDrag_onTouchMove);
$(document).off('touchend', easyDrag_onTouchEnd);
self.data('stop').call(boulet); 
var d = Date.now() - t;
if(d>300 || !self.data('clickable')){
e.preventDefault(); 
e.stopPropagation();
} 
}
function easyDrag_contain(){
if(container.length){
var cur_offset = boulet.offset();
var container_offset = container.offset();
var limite1 = container_offset.left;
var limite2 = limite1+container.width()-boulet.innerWidth();
limite1 += parseInt(boulet.css('margin-left'));
if(cur_offset.left<limite1){
boulet.offset({left: limite1});
} else if(cur_offset.left>limite2){
boulet.offset({left: limite2});
}
var limite1 = container_offset.top;
var limite2 = limite1+container.height()-boulet.innerHeight();
limite1 += parseInt(boulet.css('margin-top'));
if(cur_offset.top<limite1){
boulet.offset({top: limite1});
} else if(cur_offset.top>limite2){
boulet.offset({top: limite2});
}
}
};
})(jQuery);
jQuery.extend({
highlight: function (node, re, hwRE1, hwRE2, nodeName, className) {
if (node.nodeType === 3) {
var match = node.data.match(re);
if (match) {
var matchIndex = match.index;
var matchLength = match[0].length;
if (hwRE1 !== null) {
var text = match.input;
var matchHead = text.substring(0, matchIndex).match(hwRE1);
if (matchHead !== null) {
matchIndex -= matchHead[1].length;
}
var matchTail =
text.substring(matchIndex + matchLength).match(hwRE2);
if (matchTail !== null) {
matchLength += matchTail[1].length;
}
}
var highlight = document.createElement(nodeName || 'span');
highlight.className = className || 'highlight';
var wordNode = node.splitText(matchIndex);
wordNode.splitText(matchLength);
var wordClone = wordNode.cloneNode(true);
highlight.appendChild(wordClone);
wordNode.parentNode.replaceChild(highlight, wordNode);
return 1; 
}
} else if ((node.nodeType === 1 && node.childNodes) && 
!/^(script|style|text|tspan|textpath)$|(^svg:)/i.test(node.tagName) && 
!(node.tagName === nodeName.toUpperCase() && node.className === className)) { 
for (var i = 0; i < node.childNodes.length; i++) {
i += jQuery.highlight(node.childNodes[i], re, hwRE1, hwRE2, nodeName, className);
}
}
return 0;
}
});
jQuery.fn.unhighlight = function (options) {
var settings = { className: 'highlight', element: 'span' };
jQuery.extend(settings, options);
return this.find(settings.element + "." + settings.className).each(function () {
var parent = this.parentNode;
parent.replaceChild(this.firstChild, this);
parent.normalize();
}).end();
};
jQuery.fn.highlight = function (words, options) {
var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false, highlightWord: false };
jQuery.extend(settings, options);
if (words.constructor === String) {
words = [words];
}
words = jQuery.grep(words, function(word, i){
return word != '';
});
words = jQuery.map(words, function(word, i) {
return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
});
if (words.length == 0) { return this; };
var flag = settings.caseSensitive ? "" : "i";
var pattern = "(" + words.join("|") + ")";
if (settings.wordsOnly) {
pattern = "\\b" + pattern + "\\b";
}
var re = new RegExp(pattern, flag);
var hwRE1 = null;
var hwRE2 = null;
if (settings.highlightWord) {
try {
hwRE1 = new RegExp("([\\p{L}\\p{N}_-]+)$", "u");
hwRE2 = new RegExp("^([\\p{L}\\p{N}_-]+)", "u");
} catch (ignored) {}
}
return this.each(function () {
jQuery.highlight(this, re, hwRE1, hwRE2, settings.element, settings.className);
});
};
;(function ($) {
var methods = {
init: function (options) { 
var settings = $.extend({ checked: false, ontoggle: null }, 
options);
var toggle = this.first();
toggle.addClass("toggle-toggle");
toggle.removeData("toggleState"); 
toggle.click(function (event) {
event.preventDefault();
methods.check.call(toggle, "toggle");
});
if (typeof settings.ontoggle === "function") {
toggle.data("onChangeState", settings.ontoggle);
}
methods.check.call(toggle, settings.checked);
return toggle;
},
check: function (checked) { 
var toggle = this.first();
var isChecked = toggle.data("toggleState");
if (checked === "toggle") {
if (typeof isChecked === "boolean") {
checked = !isChecked;
} else {
checked = false;
}
}
if (typeof checked === "boolean") {
var toggle = this.first();
if ((typeof isChecked === "undefined") ||
checked !== isChecked) {
if (checked) {
toggle.addClass("toggle-checked");
} else {
toggle.removeClass("toggle-checked");
}
toggle.data("toggleState", checked);
if (toggle.data("onChangeState")) {
toggle.data("onChangeState").call(toggle, checked);
}
}
return toggle;
} else {
return isChecked;
}
},
};
$.fn.toggle = function (method) {
if (methods[method]) {
return methods[method].apply(
this, 
Array.prototype.slice.call(arguments, 1));
} else if ((typeof method === "object") || !method) {
return methods.init.apply(this, arguments);
} else {
$.error("Method '" + method + "' does not exist in jQuery.toggle");
return this;
} 
};
})(jQuery);
;(function ($) {
var methods = {
init: function (options) { 
var settings = $.extend({ selected: 0, onselect: null,
position: "north" }, 
options);
var tabs = this.first();
tabs.addClass("tabs-tabs");
if (settings.position === "west") {
tabs.addClass("tabs-west");
}
tabs.children("li").each(function (itemIndex) {
$(this).addClass("tabs-tab");
var links = $(this).children("a[href]");
links.each(function (i) {
$(this).attr("draggable", "false");
});
$(this).add(links).click(function (event) {
event.preventDefault();
event.stopImmediatePropagation();
methods.select.call(tabs, itemIndex);
});
});
if (typeof settings.onselect === "function") {
tabs.data("onSelectTab", settings.onselect);
}
methods.select.call(tabs, settings.selected);
return tabs;
},
select: function (index) { 
var tabs = this.first();
if (typeof index === "number") {
var items = tabs.children("li");
if (index < 0) {
index = 0;
} else if (index >= items.length) {
index = items.length - 1;
}
tabs.removeData("selectedTab");
var selected = false;
items.each(function (itemIndex) {
var panel = methods.getPanel.call(tabs, $(this));
if (itemIndex === index) {
$(this).addClass("tabs-selected");
panel.show();
selected = true;
} else {
$(this).removeClass("tabs-selected");
panel.hide();
}
});
if (selected) {
tabs.data("selectedTab", index);
if (tabs.data("onSelectTab")) {
tabs.data("onSelectTab").call(tabs, index);
}
}
return tabs;
} else {
return tabs.data("selectedTab");
}
},
getPanel: function (item) {
var href = item.children("a[href]").first().attr("href");
if (href && href.indexOf("#") === 0) {
return $(href);
} else {
return $();
}
},
};
$.fn.tabs = function (method) {
if (methods[method]) {
return methods[method].apply(
this, 
Array.prototype.slice.call(arguments, 1));
} else if ((typeof method === "object") || !method) {
return methods.init.apply(this, arguments);
} else {
$.error("Method '" + method + "' does not exist in jQuery.tabs");
return this;
} 
};
})(jQuery);
;(function ($) {
var methods = {
init: function (options) { 
var settings = $.extend({ initiallyCollapsed: false }, options);
var toc = this.first();
toc.addClass("toc-toc");
toc.data("toc", settings);
var collapsible = methods.getCollapsibleEntries.call(toc);
if (collapsible.length > 0) {
var hasSingleRoot = (toc.children("li").length === 1);
methods.restoreCollapsibleEntries.call(toc, collapsible, 
hasSingleRoot);
var clickEndX = NaN;
var paddingLeft = collapsible.css("padding-left");
if (paddingLeft.substr(-2) === "px") {
clickEndX = 
parseInt(paddingLeft.substring(0, paddingLeft.length-2));
}
if (isNaN(clickEndX)) {
clickEndX = 16;
}
collapsible.click(function (event) {
var entry = $(this);
var x = event.pageX - entry.offset().left;
if (x >= 0 && x < clickEndX) {
event.stopImmediatePropagation();
var contents = entry.children("ul");
if (entry.hasClass("toc-collapsed")) {
entry.removeClass("toc-collapsed")
.addClass("toc-expanded");
contents.show();
} else {
entry.removeClass("toc-expanded")
.addClass("toc-collapsed");
contents.hide();
}
methods.saveCollapsibleEntries.call(toc, collapsible);
}
});
}
return toc;
},
expandCollapseAll: function (expand) {
var toc = this.first();
var collapsible = methods.getCollapsibleEntries.call(toc);
collapsible.each(function () { 
var entry = $(this);
if (expand && entry.hasClass("toc-collapsed")) {
entry.removeClass("toc-collapsed")
.addClass("toc-expanded");
entry.children("ul").show();
} else if (!expand && entry.hasClass("toc-expanded")) {
entry.removeClass("toc-expanded")
.addClass("toc-collapsed");
entry.children("ul").hide();
}
});
methods.saveCollapsibleEntries.call(toc, collapsible);
return toc;
},
showEntry: function (entry, scroll) {
var toc = this.first();
entry.parents(toc, "li").each(function () {
var e = $(this);
if (e.hasClass("toc-collapsed")) {
e.removeClass("toc-collapsed").addClass("toc-expanded");
e.children("ul").show();
}
});
if (scroll && toc.is(":visible")) {
var scrollable = methods.getScrollParent.call(toc);
scrollable.scrollTop(entry.offset().top - 
scrollable.offset().top);
}
return toc;
},
getScrollParent: function() {
var position = this.css("position");
var excludeStaticParent = (position === "absolute");
var scrollParent = this.parents().filter(function() {
var parent = $(this);
if (excludeStaticParent && 
parent.css("position") === "static") {
return false;
}
return (/(auto|scroll)/).test(parent.css("overflow") + 
parent.css("overflow-y") + 
parent.css("overflow-x"));
}).eq(0);
return (position === "fixed" || scrollParent.length === 0)? 
$(this[0].ownerDocument || document) : scrollParent;
},
getCollapsibleEntries: function () {
return $("li", this).filter(function () {
return $(this).children("ul").length > 0;
});
},
saveCollapsibleEntries: function (collapsible) {
var settings = this.data("toc");
if (settings.storageKey) {
var state = [];
collapsible.each(function () {
state.push($(this).hasClass("toc-collapsed")? 0 : 1);
});
window.sessionStorage.setItem(settings.storageKey,
state.join(""));
}
},
restoreCollapsibleEntries: function (collapsible, hasSingleRoot) {
var fallback = true;
var settings = this.data("toc");
if (settings.storageKey) {
var storedValue = 
window.sessionStorage.getItem(settings.storageKey);
if (storedValue) {
var state = storedValue.split("");
if (state.length === collapsible.length) {
fallback = false;
collapsible.each(function (index) {
var entry = $(this);
var contents = entry.children("ul");
if (parseInt(state[index], 10) === 0) {
entry.addClass("toc-collapsed");
contents.hide();
} else {
entry.addClass("toc-expanded");
contents.show();
}
});
}
}
}
if (fallback) {
if (settings.initiallyCollapsed) {
collapsible.each(function (index) {
var entry = $(this);
if (hasSingleRoot && index === 0) {
entry.addClass("toc-expanded");
} else {
entry.addClass("toc-collapsed");
entry.children("ul").hide();
}
});
} else {
collapsible.each(function (index) {
$(this).addClass("toc-expanded");
});
}
}
}
};
$.fn.toc = function (method) {
if (methods[method]) {
return methods[method].apply(
this, 
Array.prototype.slice.call(arguments, 1));
} else if ((typeof method === "object") || !method) {
return methods.init.apply(this, arguments);
} else {
$.error("Method '" + method + "' does not exist in jQuery.toc");
return this;
} 
};
})(jQuery);
var wh = (function () {
var toc_entries = [
["Shahih Bukhari 3301 - 3400","231370041-%20HD%20website.html",[
["Cover","231370041-%20HD%20website.html#__PAGE1__",null],
["KATA PENGANTAR","231370041-%20HD%20website.html#_Toc165736158",null],
["PERILAKU BUDI PEKERTI YANG TERPUJI","231370041-%20HD%20website-3.html",[
["Sifat – sifat Nabi Muhammad SAW.","231370041-%20HD%20website-3.html#_Toc165736161",null],
["Kemiripan Al Hassan dengan Nabi SAW.","231370041-%20HD%20website-5.html",null],
["Ciri – ciri kemiripan dengan Nabi SAW.","231370041-%20HD%20website-6.html",null],
["Salah satu ciri Nabi SAW.","231370041-%20HD%20website-7.html",null],
["Rambut yang memutih ketika lanjut usia","231370041-%20HD%20website-8.html",null],
["Menceritakan sifat – sifat Nabi SAW.","231370041-%20HD%20website-9.html",null],
["Kesempurnaan Nabi Muhammad SAW.","231370041-%20HD%20website-10.html",null],
["Ketampanan Nabi Muhammad SAW.","231370041-%20HD%20website-11.html",null],
["Seseorang yang bertanya tentang penyemiran Nabi SAW.","231370041-%20HD%20website-12.html",null],
["Rambut yang terjuntai hingga bagian pundaknya","231370041-%20HD%20website-13.html",null],
["Wajah Nabi SAW. yang seperti rembulan","231370041-%20HD%20website-14.html",null],
["Tangan nabi SAW. yang dingin melebihi salju dan wangi melebihi\n        kasturi","231370041-%20HD%20website-15.html",null],
["Sifat dermawan Nabi SAW.","231370041-%20HD%20website-16.html",null],
["Wajah Nabi SAW. yang berseri dan bercahaya","231370041-%20HD%20website-17.html",null],
["Wajah yang bersinar ketika bergembira","231370041-%20HD%20website-18.html",null],
["Nabi Muhammad SAW. yang diutus pada generasi terbaik","231370041-%20HD%20website-19.html",null],
["Cara bersisir Nabi Muhammad SAW.","231370041-%20HD%20website-20.html",null],
["Nabi SAW. Yang paling baik akhlaknya","231370041-%20HD%20website-21.html",null],
["Nabi SAW. Yang tidak pernah memusuhi seseorang","231370041-%20HD%20website-22.html",null],
["Telapak tangan yang lembut melebihi sutra","231370041-%20HD%20website-23.html",null],
["Sifat pemalu Nabi SAW.","231370041-%20HD%20website-24.html",null],
["Nabi SAW. Yang tidak pernah membenci makanan","231370041-%20HD%20website-25.html",null],
["Mengangkat tangan ketika Nabi SAW. Berdoa meminta hujan","231370041-%20HD%20website-26.html",null],
["Seakan – akan ada cahaya yang keluar dari betis Nabi\n        SAW.","231370041-%20HD%20website-27.html",null],
["Nabi SAW. Menyampaikan hadis tidak secara berturut –\n        turut","231370041-%20HD%20website-28.html",null],
["Nabi Muhammad Saw kedua matanya tidur tetapi hatinya tidak\n        tidur","231370041-%20HD%20website-29.html",null],
["Nabi SAW. Didatangi tiga malaikat ketika sedang tidur dalam\n        perjalanan isra’ mi’raj","231370041-%20HD%20website-30.html",null],
["Tanda kenabian dalam islam","231370041-%20HD%20website-31.html",null],
["Terpancarkan air di sela – sela jari Nabi Muhammad SAW.","231370041-%20HD%20website-32.html",null],
["Orang – orang berwudhu melalui sela – sela jari Nabi\n        SAW.","231370041-%20HD%20website-33.html",null],
["Sekitar 70 orang berwudhu dengan di perintahkan oleh Nabi\n        SAW.","231370041-%20HD%20website-34.html",null],
["Sekitar 80 orang yang berwudhu di bejana yang berisi tangan\n        Nabi SAW.","231370041-%20HD%20website-35.html",null],
["Sekitar 1.500 orang yang berwudhu di sela – sela jari Nabi\n        SAW.","231370041-%20HD%20website-36.html",null],
["Peristiwa hudaibiyah yang terdapat sumur berisi penuh yang di\n        kumur – kumurkan Nabi SAW.","231370041-%20HD%20website-37.html",null],
["Sekitar 70 atau 80 orang yang kenyang dengan memakan beberapa\n        potongan roti dari gandum","231370041-%20HD%20website-38.html",null],
["Mu’jizat – mu’jizat lainnya","231370041-%20HD%20website-39.html",null],
["Siapa yang memiliki makanan untuk dua orang hendaklah dia\n        mengajak orang yang ketiga, dst..","231370041-%20HD%20website-40.html",null],
["Nabi SAW. Berdoa menurunkan hujan karena kota telah di landa\n        kekeringan","231370041-%20HD%20website-41.html",null],
["Ketika Nabi SAW. Mengusap batang pohon yang pernah menjadi\n        mimbar untuk khotbah","231370041-%20HD%20website-42.html",null],
["Ketika Nabi SAW. Menggendong batang pohon kurma yang menangis\n        seperti bayi","231370041-%20HD%20website-43.html",null],
["Ketika Nabi SAW. Meletakkan tangan nya di tiang – tiang di\n        masjid","231370041-%20HD%20website-44.html",null],
["Sabda Nabi Muhammad SAW. Tentang fitrah","231370041-%20HD%20website-45.html",null],
["Tidak akan terjadi hari kiamat hingga kalian memerangi suatu\n        kaum bangsa turki yang bermata kecil dan hidung pesek","231370041-%20HD%20website-46.html",null],
["Tidak akan terjadi hari kiamat hingga kalian memerangi bangsa\n        khuzan dan karman dari bangsa nonArab","231370041-%20HD%20website-47.html",null],
["Diantara dekatnya kedatangan hari kiamat, kalian akan memerangi\n        suatu kaum yang sandal mereka terbuat dari rambut. Dan itu adalah\n        bangsa Persi","231370041-%20HD%20website-48.html",null],
["Diantara dekatnya kedatangan kiamat kalian akan perangi kaum\n        yang wajah mereka bagaikan perisai yang di tempa","231370041-%20HD%20website-49.html",null],
["Peristiwa – peristiwa akan datangnya hari kiamat","231370041-%20HD%20website-50.html",null],
["Akan ada orang yang di beri kemenangan kepada orang bersahabat\n        dengan Nabi SAW. Dan dengan para sahabatnya","231370041-%20HD%20website-51.html",null],
["Banyak kejadian – kejadian aneh lainnya yang terjadi di masa\n        yang akan datang","231370041-%20HD%20website-52.html",null],
["Ketika Nabi SAW. Melaksanakan sholat jenazah untuk para\n        syuhada","231370041-%20HD%20website-53.html",null],
["Tempat-tempat terjadinya fitnah","231370041-%20HD%20website-54.html",null],
["Akan terjadi kejadian jika keburukan telah mewabah","231370041-%20HD%20website-55.html",null],
["Harta dunia dan fitnah-fitnah yang turunkan","231370041-%20HD%20website-56.html",null],
["Akan datang kepada manusia suatu zaman yang saat itu kambing\n        akan menjadi harta seorang muslim yang paling baik","231370041-%20HD%20website-57.html",null],
["Diantara salat ada satu salat yang apabila seseorang\n        meninggalkannya seakan-akan dia kehilangan keluarga dan\n        hartanya","231370041-%20HD%20website-58.html",null],
["Akan ada sifat-sifat egoisme yang di ingkari","231370041-%20HD%20website-59.html",null],
["Menjauhi sekelompok orang yang akan mebinasakan kita","231370041-%20HD%20website-60.html",null],
["Sekelompok anak kecil yang akan membinasakan kita","231370041-%20HD%20website-61.html",null],
["Perkara-perkara keburukan dan kebaikan yang akan datang","231370041-%20HD%20website-62.html",null],
["Belajarlah dari perkara yang buruk juga","231370041-%20HD%20website-63.html",null],
["Kejadian yang datang sebelum hari kiamat","231370041-%20HD%20website-64.html",null],
["Nabi Muhammad SAW. Adalah orang yang adil","231370041-%20HD%20website-65.html",null],
["Akan datang di akhir zaman suatu kaum yang masih muda belia\n        namun lemah pemahaman","231370041-%20HD%20website-66.html",null],
["Akan ada laki-laki yang di galikan lubangnya dan diletakkan\n        gergaji di dalamnya","231370041-%20HD%20website-67.html",null],
["Ada seorang laki-laki yang merasa dirinya penghuni neraka\n        padahal menurut Nabi SAW. Dia adalah penghuni surga","231370041-%20HD%20website-68.html",null],
["Sakinah ( angin yang berhembus mengenai wajah","231370041-%20HD%20website-69.html",null],
["Abu bakar menceritakan perjalanannya bersama Nabi Muhammad\n        SAW.","231370041-%20HD%20website-70.html",null],
["Kebiasaan Nabi SAW. Jika menjenguk orang sakit","231370041-%20HD%20website-71.html",null],
["Yang terjadi kepada orang yang mendustakan agama","231370041-%20HD%20website-72.html",null],
["Ghanimah yang di peroleh dari kekayaan kisra dan\n        qaishar","231370041-%20HD%20website-73.html",null],
["Perbendaharaan kekayaan kisra dan qaishar","231370041-%20HD%20website-74.html",null],
["Ada 2 orang pendusta yang akan di binasakan","231370041-%20HD%20website-75.html",null],
["Nabi Muhammad SAW. Bermimpi perang uhud","231370041-%20HD%20website-76.html",null],
["Pembicaraan rahasia antara Nabi Muhammad SAW. Dengan\n        fathimah","231370041-%20HD%20website-77.html",null],
["Pembicaraan yang membuat fathimah menangis sekaligus\n        tertawa","231370041-%20HD%20website-78.html",null],
["Telah datang pertolongan Allah dan kemenangan","231370041-%20HD%20website-79.html",null],
["Peristiwa pada majlis terakhir sebelum kepulangan Nabi Muhammad\n        SAW.","231370041-%20HD%20website-80.html",null],
["Peristiwa ketika Nabi SAW. Mendudukan Al Hassan di atas\n        mimbarnya","231370041-%20HD%20website-81.html",null],
["Nabi Muhammad SAW. Berkabung atas ja’far dan zaid","231370041-%20HD%20website-82.html",null],
["Akan terjadi suatu hari nanti yang ketika itu kalian memiliki\n        permadani","231370041-%20HD%20website-83.html",null],
["Nabi Muhammad SAW. Tidak pernah berdusta","231370041-%20HD%20website-84.html",null],
["Diantara tarikannya abu bakr terdapat kelemahan dan Allah\n        mengampuninya","231370041-%20HD%20website-85.html",null],
["Malaikat jibril mendatangi Nabi Muhammad SAW.","231370041-%20HD%20website-86.html",null],
["Permasalahan hukum rajam","231370041-%20HD%20website-87.html",null],
["Peristiwa bulan terbelah","231370041-%20HD%20website-88.html",null],
["Terbelahnya bulan salah satu bukti mu’jizatnya Nabi\n        SAW.","231370041-%20HD%20website-89.html",null],
["Pernyataan terbelahnya bulan","231370041-%20HD%20website-90.html",null],
["Cerita dua sahabat Nabi SAW.","231370041-%20HD%20website-91.html",null],
["Akan ada sekelompok orang yang menang hingga datang ketetapan\n        Allah","231370041-%20HD%20website-92.html",null],
["Senantiasa akan ada sekelompok umat yang tegak atas urusan\n        agama Allah SWT.","231370041-%20HD%20website-93.html",null],
["Keberkahan dalam jual-beli","231370041-%20HD%20website-94.html",null],
["Akan ada kebaikan hingga kiamat","231370041-%20HD%20website-95.html",null],
["Kuda, pada ubun-ubunnya senantiasa ada kebaikan","231370041-%20HD%20website-96.html",null],
["Ada 3 jenis kuda","231370041-%20HD%20website-97.html",null],
["Peristiwa seseorang yang lupa pada setiap hadis","231370041-%20HD%20website-98.html",null]
]],
["SAHABAT-SAHABAT NABI","231370041-%20HD%20website-99.html",[
["keutamaan sahabat nabi Saw.","231370041-%20HD%20website-99.html#_Toc164429367",null],
["Sebaik-baiknya umat yaitu yang hidup pada zaman Nabi\n        SAW.","231370041-%20HD%20website-101.html",null],
["Kemudian akan datang suatu kaum persaksian","231370041-%20HD%20website-102.html",null],
["kisah teladan kaum muhajirin dan keutamaan mereka","231370041-%20HD%20website-103.html",null],
["Pembicaraan abu bakr dan Nabi Muhammad SAW. Ketika di\n        goa","231370041-%20HD%20website-104.html",null],
["Sabda nabi Muhammad Saw. : {Semua pintu tertutup kecuali\n        pintunya abu bakar}","231370041-%20HD%20website-105.html",null],
["Keutamaan abu bakar setelah Rasulullah Saw.","231370041-%20HD%20website-106.html",null],
["Sabda Nabi Saw. : {Sekiranya aku boleh mengambil\n        kekasih}","231370041-%20HD%20website-107.html",null],
["Penduduk kuffah yang menulis surat kepada ibnu Az\n        Zubair","231370041-%20HD%20website-108.html",null],
["Kedekatannya abu bakr dengan Nabi Muhammad SAW.","231370041-%20HD%20website-109.html",null],
["Abu bakar yang selalu menemani Nabi SAW.","231370041-%20HD%20website-110.html",null],
["Percayanya abu bakar terhadap Nabi Muhammad SAW.","231370041-%20HD%20website-111.html",null],
["Orang-orang yang di cintai Nabi Muhammad SAW.","231370041-%20HD%20website-112.html",null],
["Kejadian seorang pengembala dan serigala","231370041-%20HD%20website-113.html",null],
["Mimpi Nabi SAW.","231370041-%20HD%20website-114.html",null],
["Adab memakai pakaian","231370041-%20HD%20website-115.html",null],
["Amalan menginfakkan dua jenis barang di jalan Allah","231370041-%20HD%20website-116.html",null],
["Peristiwa ketika Nabi Muhammad SAW. Meninggal dunia","231370041-%20HD%20website-117.html",null],
["Khalifah-khalifah setelah Nabi SAW.","231370041-%20HD%20website-118.html",null],
["Peristiwa tayamum","231370041-%20HD%20website-119.html",null],
["Pentingnya sahabat-sahabat Nabi Muhammad SAW.","231370041-%20HD%20website-120.html",null],
["Riwayat barisan kuburan Nabi SAW. dengan para sahabat","231370041-%20HD%20website-121.html",null],
["Orang yang jujur dan dua orang yang akan mati syahid","231370041-%20HD%20website-122.html",null],
["Antara umar bin khatab dengan abu bakar assidiq","231370041-%20HD%20website-123.html",null],
["Kemuliannya umar bin khatab","231370041-%20HD%20website-124.html",null],
["Cinta besarnya abu bakar terhadap Nabi Muhammad SAW.","231370041-%20HD%20website-125.html",null]
]],
["Profil penulis","231370041-%20HD%20website-126.html",null]
]]];
var toc_initiallyCollapsed = false;
var messages = [
"Contents",
"Index",
"Search",
"Collapse All",
"Expand All",
"Previous Page",
"Next Page",
"Print Page",
"Toggle search result highlighting",
"No results found for %W%.",
"1 result found for %W%.",
"%N% results found for %W%.",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"See",
"See also" 
];
var messageTranslations = {
"de": [
"Inhalt",
"Index",
"Suchen",
"Alle ausblenden",
"Alle einblenden",
"Vorherige Seite",
"Nächste Seite",
"Print Page",
"Hervorhebung von Suchergebnissen ein-/ausschalten",
"Keine Ergebnisse für %W% gefunden.",
"1 Ergebnis für %W% gefunden.",
"%N% Ergebnisse für %W% gefunden.",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"Siehe",
"Siehe auch"
],
"es": [
"Contenido",
"Índice",
"Buscar",
"Contraer todo",
"Expandir todo",
"Página anterior",
"Página siguiente",
"Print Page",
"Alternar el resaltado de los resultados de la búsqueda",
"No se ha encontrado ningún resultado para %W%.",
"Se ha encontrado un resultado para %W%.",
"Se han encontrado %N% resultados para %W%.",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"Ver",
"Ver también"
],
"fr": [
"Sommaire",
"Index",
"Rechercher",
"Replier Tout",
"Déplier Tout",
"Page Précédente",
"Page Suivante",
"Imprimer Page",
"Basculer la mise en surbrillance",
"Aucun résultat trouvé pour %W%.",
"1 résultat trouvé pour %W%.",
"%N% résultats trouvés pour %W%.",
"Arrêter de rechercher",
"Ouvrir le panneau de navigation",
"Fermer le panneau de navigation",
"terme",
"mot",
"Atteindre",
"Voir",
"Voir aussi"
],
"it": [
"Sommario",
"Indice",
"Ricerca",
"Comprimi tutto",
"Espandi tutto",
"Pagina precedente",
"Pagina successiva",
"Print Page",
"Attiva/Disattiva evidenziazione risultati ricerca",
"Nessun risultato trovato per %W%.",
"1 risultato trovato per %W%.",
"%N% risultati trovati per %W%.",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"Vedere",
"Vedere anche"
],
"ja": [
"目次",
"索引",
"検索",
"すべて折りたたむ",
"すべて展開",
"前のページ",
"次のページ",
"Print Page",
"検索キーワードをハイライト表示",
"%W% の検索結果は見つかりませんでした。",
"%W% の検索結果が 1 件見つかりました。",
"%W% の検索結果が%N% 件見つかりました。%N%",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"参照：",
"その他参照："
],
"pl": [
"Spis treści",
"Indeks",
"Wyszukaj",
"Zwiń wszystko",
"Rozwiń wszystko",
"Poprzednia strona",
"Następna strona",
"Print Page",
"Przełącz wyróżnianie wyników wyszukiwania",
"Brak wyników dla %W%.",
"Znaleziono 1 wynik dla %W%.",
"Znaleziono następującą liczbę wyników dla %W%: %N%",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"Zobacz",
"Zobacz również"
],
"ru": [
"Содержание",
"Указатель",
"Поиск",
"Свернуть все",
"Развернуть все",
"Предыдущая",
"Следующая",
"Print Page",
"Выделение результатов поиска",
"Ничего не найдено по запросу \"%W%\".",
"Найдено результатов по запросу \"%W%\": 1.",
"Найдено результатов по запросу \"%W%\": %N%.",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"См.",
"См. также"
],
"zh-cn": [
"目录",
"索引",
"搜索",
"全部折叠",
"全部展开",
"上一页",
"下一页",
"Print Page",
"切换搜索结果高亮",
"未找到有关 %W% 的结果。",
"找到 1 条有关 %W% 的结果。",
"找到 %N% 条有关 %W% 的结果。",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"See",
"See also"
],
"zh-tw": [
"目錄",
"索引",
"搜尋",
"收合全部",
"展開全部",
"上一頁",
"下一頁",
"Print Page",
"反白顯示切換搜尋結果",
"找不到 %W% 的結果。",
"找到 １ 個 %W% 的結果。",
"找到 %N% 個 %W% 的結果。",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"See",
"See also"
]
};
var preferredUserLanguage = null; 
function getUserLanguage(lang) {
if (lang === null) {
lang = window.navigator.userLanguage || window.navigator.language;
}
if (lang) {
lang = lang.toLowerCase();
if (lang.length > 5) {
lang = lang.substring(0, 5);
}
if (lang.indexOf("_") >= 0) {
lang = lang.replace(/_/g, "-");
}
if (lang in messageTranslations) {
return lang;
} else {
var pos = lang.indexOf("-");
if (pos > 0) {
lang = lang.substring(0, pos);
}
if (lang in messageTranslations) {
return lang;
} else {
return null;
}
}
} else {
return null;
}
}
var userLanguage = getUserLanguage(preferredUserLanguage);
function msg(message) {
if (userLanguage !== null) {
var translation = messageTranslations[userLanguage];
if (translation !== undefined) {
var index = -1;
var count = messages.length;
for (var i = 0; i < count; ++i) {
if (messages[i] === message) {
index = i;
break;
}
}
if (index >= 0) {
message = translation[index];
}
}
}
return message;
}
var storageId = "vf2lylvaobub-1vii263yatym0";
function storageSet(key, value) {
window.sessionStorage.setItem(key + storageId, String(value));
}
function storageGet(key) {
return window.sessionStorage.getItem(key + storageId);
}
function storageDelete(key) {
window.sessionStorage.removeItem(key + storageId);
}
function initMenu() {
var menu = $("#wh-menu");
menu.attr("title", msg("Open navigation pane"));
menu.click(function () {
if (menu.hasClass("wh-icon-menu")) {
openNavigation();
} else {
closeNavigation();
}
});
}
function openNavigation() {
var menu = $("#wh-menu");
menu.removeClass("wh-icon-menu").addClass("wh-icon-close");
menu.attr("title", msg("Close navigation pane"));
var glass = $('<div id="wh-body-glass"></div>');
glass.css({ "position": "absolute",
"top": "0px",
"left": "0px",
"z-index": "50",
"width": "100%",
"height": "100%",
"background-color": "#808080",
"opacity": "0.5" });
$("body").append(glass);
glass.click(closeNavigation);
var top = menu.position().top;
top += menu.outerHeight( false);
var height = $("#wh-body").height() - top;
var nav = $("#wh-navigation");
nav.css({ "position": "absolute",
"top": top + "px",
"right": "0px",
"z-index": "100",
"width": "66%",
"height": height + "px",
"border-style": "solid",
"display": "flex" }); 
}
function closeNavigation() {
var menu = $("#wh-menu");
menu.removeClass("wh-icon-close").addClass("wh-icon-menu");
menu.attr("title", msg("Open navigation pane"));
$("#wh-body-glass").remove();
var nav = $("#wh-navigation");
nav.css({ "position": "",
"top": "",
"right": "",
"z-index": "",
"width": "",
"height": "",
"border-style": "",
"display": "" });
var position = parseInt(storageGet("whSeparatorPosition"), 10);
if (!isNaN(position)) {
nav.width(position);
}
}
function initSeparator() {
var navigation = $("#wh-navigation");
var separator = $("#wh-separator");
var content = $("#wh-content");
separator.easyDrag({
axis: "x",
container: $("#wh-body"),
clickable: false,
cursor: "", 
start: function() { 
$(this).data("startDragLeftOffset", $(this).offset().left);
},
stop: function() {
var delta = 
$(this).offset().left - $(this).data("startDragLeftOffset");
if (delta !== 0) {
var availableW = $("#wh-body").width();
var reservedW = 1 + getPad(navigation,  false)/2 +
separator.outerWidth( true) +
getPad(content,  false)/2;
var maxW = availableW - reservedW;
var w = navigation.width() + delta;
if (w < reservedW) {
w = reservedW; 
} else if (w > maxW) {
w = maxW;
}
saveSeparatorPosition(separator, w);
navigation.width(w);
}
}
});
var position = parseInt(storageGet("whSeparatorPosition"), 10);
if (isNaN(position)) {
position = navigation.width();
}
saveSeparatorPosition(separator, position);
navigation.width(position);
}
function getPad(pane, vertical) {
if (vertical) {
return pane.outerHeight( true) - pane.height();
} else {
return pane.outerWidth( true) - pane.width();
}
}
function saveSeparatorPosition(separator, position) {
separator.css("left", "0px");
storageSet("whSeparatorPosition", position.toString());
}
function populateTOC() {
var tocPane = $("#wh-toc-pane");
var list = $("<ul id='wh-toc'></ul>");
tocPane.append(list);
if (typeof toc_entries !== "undefined") {
var count = toc_entries.length;
for (var i = 0; i < count; ++i) {
addTOCEntry(toc_entries[i], list);
}
toc_entries = undefined; 
}
}
function addTOCEntry(entry, list) {
var text = entry[0];
var href = entry[1];
var children = entry[2];
var count = (children !== null)? children.length : 0;
var item = $("<li></li>");
list.append(item);
if (href !== null) {
var link = $("<a></a>");
link.attr("href", href);
link.attr("draggable", "false");
link.html(text);
item.append(link);
} else {
item.html(text);
}
if (count > 0) {
var sublist = $("<ul></ul>");
item.append(sublist);
for (var i = 0; i < count; ++i) {
addTOCEntry(children[i], sublist);
}
}
}
function doInitTOC() {
populateTOC();
var toc = $("#wh-toc");
var tocOptions = { storageKey: ("whTOCState" + storageId) };
if ((typeof toc_initiallyCollapsed !== "undefined") &&
toc_initiallyCollapsed) {
tocOptions.initiallyCollapsed = true;
}
toc.toc(tocOptions);
}
var fieldKeys = {
ENTER: 13,
ESCAPE: 27,
UP: 38,
DOWN: 40
};
function startSearch(field) {
stopSearch(field);
var query = $.trim(field.val());
if (query.length === 0) {
field.val("");
return null;
}
var words = splitWords(query);
if (words === null) {
field.val("");
return null;
}
return [query, words];
}
function splitWords(query) {
var split = query.split(/\s+/);
var words = [];
for (var i = 0; i < split.length; ++i) {
var segment = split[i];
if (stringStartsWith(segment, '"') || stringStartsWith(segment, "'")) {
segment = segment.substring(1);
}
if (stringEndsWith(segment, '"') || stringEndsWith(segment, "'")) {
segment = segment.substring(0, segment.length-1);
}
if (segment.length > 0) {
words.push(segment.toLowerCase());
}
}
if (words.length === 0) {
words = null;
}
return words;
}
function stringStartsWith(text, prefix) {
return (text.indexOf(prefix) === 0);
}
function stringEndsWith(text, suffix) {
return (text.substr(-suffix.length) === suffix);
}
function stopSearch(field) {
$("#wh-search-results").empty();
var pane = $("#wh-search-pane");
pane.scrollTop(0);
var words = pane.removeData("whSearchedWords2");
if (words !== null) {
unhighlightSearchedWords();
}
clearSearchState();
}
function highlightSearchedWords(words) {
$("#wh-content").highlight(words, 
{ caseSensitive: false, highlightWord: true,
className: "wh-highlighted" });
}
function unhighlightSearchedWords() {
$("#wh-content").unhighlight({ className: "wh-highlighted" });
}
function doSearch(query, words) {
var searchResults = $("#wh-search-results");
var searchedWords = [];
var resultIndices = findWords(words, searchedWords);
displaySearchResults(query, words, searchedWords, 
resultIndices, searchResults);
saveSearchState(query, words, searchedWords, resultIndices);
}
function displaySearchResults(query, words, searchedWords, 
resultIndices, searchResults) {
searchResults.empty();
if (resultIndices === null || resultIndices.length === 0) {
searchResults.append(searchResultHeader(0, words));
return;
}
searchResults.append(searchResultHeader(resultIndices.length, words));
searchResults.append(searchResultList(resultIndices));
var resultLinks = $("#wh-search-result-list a");
highlightSearchedWordsImmediately(searchedWords, resultLinks);
var currentPage = trimFragment(window.location.href);
resultLinks.click(function (event) {
if (this.href === currentPage) {
event.preventDefault();
} 
});
}
function findWords(words, searchedWords) {
var pageCount = wh.search_baseNameList.length;
var hits = new Array(pageCount);
var i, j, k;
for (i = 0; i < pageCount; ++i) {
hits[i] = 0;
}
var wordCount = words.length;
for (i = 0; i < wordCount; ++i) {
var indices;
var fallback = true;
var word = words[i];
if (wh.search_stemmer !== null && 
word.search(/^[-+]?\d/) < 0) { 
var stem = wh.search_stemmer.stemWord(word);
if (stem != word) {
indices = wh.search_wordMap[stem];
if (indices !== undefined) {
fallback = false;
searchedWords.push(stem);
if (word.indexOf(stem) < 0) {
searchedWords.push(word);
}
}
}
}
if (fallback) {
indices = wh.search_wordMap[word];
searchedWords.push(word);
}
if (indices !== undefined) {
var hitPageCount = 0;
var indexCount = indices.length;
for (j = 0; j < indexCount; ++j) {
var index = indices[j];
if ($.isArray(index)) {
hitPageCount += index.length;
} else {
++hitPageCount;
}
}
var unit = 100.0 * ((pageCount - hitPageCount + 1)/pageCount);
for (j = 0; j < indexCount; ++j) {
var index = indices[j];
if ($.isArray(index)) {
var hitIncr = 
10000.0 + (((indexCount - j)/indexCount) * unit);
for (k = 0; k < index.length; ++k) {
hits[index[k]] += hitIncr;
}
} else {
hits[index] += 
10000.0 + (((indexCount - j)/indexCount) * unit);
}
}
} else {
return null;
}
}
var resultIndices = [];
var minHitValue = 10000.0 * wordCount; 
for (i = 0; i < pageCount; ++i) {
if (hits[i] > minHitValue) {
resultIndices.push(i);
}
}
if (resultIndices.length === 0) {
resultIndices = null;
} else if (resultIndices.length > 1) {
function comparePageIndices(i, j) {
var delta = hits[j] - hits[i];
if (delta !== 0) {
return delta;
} else {
return (i - j);
}
};
resultIndices.sort(comparePageIndices);
}
return resultIndices;
}
function searchResultHeader(resultCount, words) {
var header = $("<div id='wh-search-result-header'></div>");
var message;
switch (resultCount) {
case 0:
message = msg("No results found for %W%.");
break;
case 1:
message = msg("1 result found for %W%.");
break;
default:
message = 
msg("%N% results found for %W%.").replace(new RegExp("%N%", "g"),
resultCount.toString());
}
message = escapeHTML(message);
var spans = "";
for (var i = 0; i < words.length; ++i) {
if (i > 0) {
spans += " ";
}
spans += "<span class='wh-highlighted'>";
spans += escapeHTML(words[i]);
spans += "</span>";
}
header.html(message.replace(new RegExp("%W%", "g"), spans));
return header;
}
function escapeHTML(text) {
return text.replace(/&/g, "&amp;")
.replace(/</g, "&lt;")
.replace(/>/g, "&gt;")
.replace(/"/g, "&quot;");
}
function searchResultList(resultIndices) {
var list = $("<ul id='wh-search-result-list'></ul>");
var resultCount = resultIndices.length;
for (var i = 0; i < resultCount; ++i) {
var index = resultIndices[i];
var item = $("<li class='wh-search-result-item'></li>");
if ((i % 2) === 1) {
item.addClass("wh-odd-item");
}
list.append(item);
var link = $("<a></a>");
link.attr("href", wh.search_baseNameList[index]);
link.attr("draggable", "false");
link.html(wh.search_titleList[index]);
item.append(link);
}
return list;
}
function highlightSearchedWordsImmediately(searchedWords, resultLinks) {
var currentPage = trimFragment(window.location.href);
var resultLink = resultLinks.filter(function () {
return this.href === currentPage;
});
if (resultLink.length === 1) {
$("#wh-search-pane").data("whSearchedWords2", searchedWords);
var highlightToggle = $("#wh-search-highlight");
if (highlightToggle.length === 0 || highlightToggle.toggle("check")) {
highlightSearchedWords(searchedWords);
}
}
}
function saveSearchState(query, words, searchedWords, resultIndices) {
storageSet("whSearchQuery", query);
storageSet("whSearchedWords", words.join(" "));
storageSet("whSearchedWords2", searchedWords.join(" "));
storageSet("whSearchResults", 
((resultIndices === null || resultIndices.length === 0)? 
"" : resultIndices.join(",")));
}
function clearSearchState() {
storageDelete("whSearchQuery");
storageDelete("whSearchedWords");
storageDelete("whSearchedWords2");
storageDelete("whSearchResults");
}
function restoreSearchState(field) {
var query = storageGet("whSearchQuery");
if (query) {
var words = storageGet("whSearchedWords");
var searchedWords = storageGet("whSearchedWords2");
var list = storageGet("whSearchResults");
if (query.length > 0 && 
words !== undefined && 
searchedWords !== undefined && 
list !== undefined) {
words = words.split(" ");
if (words.length > 0) {
searchedWords = searchedWords.split(" ");
if (searchedWords.length > 0) {
var resultIndices = [];
if (list.length > 0) {
var items = list.split(",");
var count = items.length;
for (var i = 0; i < count; ++i) {
var index = parseInt(items[i], 10);
if (index >= 0) {
resultIndices.push(index);
} else {
return;
}
}
}
field.val(query);
displaySearchResults(query, words, searchedWords,
resultIndices, $("#wh-search-results"));
}
}
}
}
}
function initContent() {
selectTOCEntry(window.location.href);
$("#wh-toc a[href], #wh-content a[href]").click(function () {
if (trimFragment(this.href) === trimFragment(window.location.href)) {
selectTOCEntry(this.href);
}
});
}
function trimFragment(href) {
var hash = href.lastIndexOf("#");
if (hash >= 0) {
return href.substring(0, hash);
} else {
return href;
}
}
function selectTOCEntry(url) {
var links = $("#wh-toc a");
links.removeClass("wh-toc-selected");
var selectable = links.filter(function () {
return (this.href === url);
});
var hash;
if (selectable.length === 0 && (hash = url.lastIndexOf("#")) >= 0) {
url = url.substring(0, hash);
selectable = links.filter(function () {
return (this.href === url);
});
}
if (selectable.length === 0) {
selectable = links.filter(function () {
return (trimFragment(this.href) === url);
});
}
if (selectable.length > 0) {
selectable = selectable.first();
selectable.addClass("wh-toc-selected");
var entry = selectable.parent("li");
$("#wh-toc").toc("showEntry", entry,  false);
var pane = $("#wh-toc-pane");
if (pane.is(":visible")) {
pane.removeData("whPendingScroll");
pane.scrollTop(entry.offset().top - pane.offset().top);
} else {
pane.data("whPendingScroll", { container: pane, component: entry });
}
}
}
function processPendingScroll(pane) {
var scroll = pane.data("whPendingScroll");
if (scroll !== undefined) {
pane.removeData("whPendingScroll");
scroll.container.scrollTop(scroll.component.offset().top - 
scroll.container.offset().top);
}
}
function layout(resizeEvent) {
var menu = $("#wh-menu");
if (menu.hasClass("wh-icon-close")) {
if (resizeEvent === null) {
closeNavigation();
} else if (window.matchMedia("(max-width: 575.98px)").matches) {
var top = menu.position().top;
top += menu.outerHeight( false);
var height = $("#wh-body").height() - top;
$("#wh-navigation").css("height", height + "px");
} else {
closeNavigation();
}
}
var h = $(window).height();
var pane = $("#wh-header");
if (pane.length > 0 && pane.is(":visible")) {
h -= pane.outerHeight( true);
}
pane = $("#wh-footer");
if (pane.length > 0 && pane.is(":visible")) {
h -= pane.outerHeight( true);
}
var body = $("#wh-body");
body.outerHeight(h,  true);
}
function scrollToFragment() {
var fragment = getFragment(window.location.href);
if (fragment !== null) {
fragment = fragment.replace(/\./g, "\\.");
var anchor = $(fragment);
if (anchor) {
var content = $("#wh-content");
content.scrollTop(anchor.offset().top - content.offset().top + 
content.scrollTop());
}
}
}
function getFragment(href) {
var hash = href.lastIndexOf("#");
if (hash >= 0) {
return href.substring(hash); 
} else {
return null;
}
}
 function initPage() {
initMenu();
initSeparator();
initNavigation();
initTOC();
var hasIndex = ($("#wh-index-container").length === 1);
var indexField = null;
if (hasIndex) {
indexField = $("#wh-index-field");
initIndex(indexField);
}
var searchField = $("#wh-search-field");
initSearch(searchField);
initContent();
$(window).resize(layout);
layout( null);
if (hasIndex) {
restoreIndexTerm(indexField);
}
restoreSearchState(searchField);
scrollToFragment();
}
function initNavigation() {
var indexTab = $("#wh-index-tab");
if ($("#wh-toc-tab > a").css("font-weight") > 
$("#wh-toc-tab").css("font-weight")) { 
$("#wh-toc-tab > a").text(msg("Contents"));
if (indexTab.length === 1) {
$("#wh-index-tab > a").text(msg("Index"));
}
$("#wh-search-tab > a").text(msg("Search"));
} else {
$("#wh-toc-tab").attr("title", msg("Contents"));
if (indexTab.length === 1) {
indexTab.attr("title", msg("Index"));
}
$("#wh-search-tab").attr("title", msg("Search"));
}
var index = 0;
var tabsState = storageGet("whTabsState");
if (tabsState) {
index = parseInt(tabsState);
}
$("#wh-tabs").tabs({ selected: index, onselect: tabSelected });
}
function tabSelected(index) {
var index = $("#wh-tabs").tabs("select");
storageSet("whTabsState", index);
var pane;
switch (index) {
case 0:
pane = $("#wh-toc-pane");
break;
case 1:
pane = $("#wh-index-pane");
if (pane.length === 1) {
$("#wh-index-field").focus();
break;
}
case 2:
pane = $("#wh-search-pane");
$("#wh-search-field").focus();
break;
}
processPendingScroll(pane);
}
function initTOC() {
var title = $("#wh-toc-title");
if (title.length === 1) {
title.text(msg("Contents"));
}
doInitTOC();
initTOCButtons();
}
function initTOCButtons() {
var toc = $("#wh-toc");
var button = $("#wh-toc-collapse-all");
button.attr("title", msg("Collapse All"))
.click(function (event) { 
event.preventDefault();
toc.toc("expandCollapseAll", false); 
});
button = $("#wh-toc-expand-all");
button.attr("title", msg("Expand All"))
.click(function (event) { 
event.preventDefault();
toc.toc("expandCollapseAll", true); 
});
button = $("#wh-toc-previous");
button.attr("title", msg("Previous Page"))
.click(function (event) { 
goTo(true);
});
button = $("#wh-toc-next");
button.attr("title", msg("Next Page"))
.click(function (event) { 
goTo(false);
});
button = $("#wh-toc-print");
button.attr("title", msg("Print Page"))
.click(function (event) { 
print();
});
}
function goTo(previous) {
var anchors = $("#wh-toc a[href]");
var currentPage = trimFragment(window.location.href);
var currentAnchor = anchors.filter(function (index) {
return (trimFragment(this.href) === currentPage);
});
var target = null;
if (currentAnchor.length > 0) {
if (previous) {
currentAnchor = currentAnchor.first();
} else {
currentAnchor = currentAnchor.last();
}
var index = anchors.index(currentAnchor);
if (index >= 0) {
if (previous) {
--index;
} else {
++index;
}
if (index >= 0 && index < anchors.length) {
target = anchors.get(index);
}
}
} else if (anchors.length > 0) {
if (previous) {
target = anchors.last().get(0);
} else {
target = anchors.first().get(0);
}
}
if (target !== null) {
window.location.href = trimFragment(target.href);
}
}
function print() {
var anchors = $("#wh-toc a[href]");
var currentPage = trimFragment(window.location.href);
var currentAnchor = anchors.filter(function (index) {
return (trimFragment(this.href) === currentPage);
});
if (currentAnchor.length > 0) {
currentAnchor = currentAnchor.first();
var currenTitle = currentAnchor.text();
var popup = 
window.open("", "whPrint", 
"left=0,top=0,height=400,width=600" +
",resizable=yes,scrollbars=yes,status=yes");
if (popup) {
var doc = popup.document;
doc.open();
doc.write("<html><head><title>");
doc.write(escapeHTML(currenTitle));
doc.write("</title>");
doc.write("<base href=\"");
doc.write(currentPage);
doc.write("\">");
$("head > link[rel='stylesheet'][href], head > style").each(
function (index) {
if (!$(this).is("link") ||
$(this).attr("href").indexOf("_wh/wh.css") < 0) {
var div = $("<div></div>").append($(this).clone());
doc.write(div.html());
}
});
doc.write("</head><body>");
doc.write($("#wh-content").html());
doc.write("</body></html>");
doc.close();
popup.setTimeout(function() { popup.print(); popup.close(); }, 250);
}
}
}
function populateIndex() {
var indexPane = $("#wh-index-pane");
var list = $("<ul id='wh-index'></ul>");
indexPane.append(list);
if (typeof index_entries !== "undefined") {
var count = index_entries.length;
for (var i = 0; i < count; ++i) {
addIndexEntry(index_entries[i], list);
}
index_entries = undefined; 
}
}
function addIndexEntry(entry, list) {
var item = $("<li class='wh-index-entry'></li>");
list.append(item);
var term = $("<span class='wh-index-term'></span>");
term.html(entry.term);
item.append(term);
var i;
var terms = entry.see;
if (terms !== undefined) {
var seeList = $("<ul class='wh-index-entries'></ul>");
item.append(seeList);
addSee("see", terms, seeList);
} else {
var hrefs = entry.anchor;
if (hrefs !== undefined) {
var j = 0;
var hrefCount = hrefs.length;
for (i = 0; i < hrefCount; i += 2) {
var href = hrefs[i];
var href2 = hrefs[i+1];
item.append("\n");
var link = $("<a class='wh-index-anchor'></a>");
link.attr("href", href);
link.attr("draggable", "false");
++j;
link.text("[" + j + "]");
item.append(link);
if (href2 !== null) {
item.append("&#8212;");
var link2 = $("<a class='wh-index-anchor'></a>");
link2.attr("href", href2);
link2.attr("draggable", "false");
++j;
link2.text("[" + j + "]");
item.append(link2);
}
}
}
var entries = entry.entry;
terms = entry.seeAlso;
if (entries !== undefined || terms !== undefined) {
var subList = $("<ul class='wh-index-entries'></ul>");
item.append(subList);
if (entries !== undefined) {
var entryCount = entries.length;
for (i = 0; i < entryCount; ++i) {
addIndexEntry(entries[i], subList);
}
}
if (terms !== undefined) {
addSee("see-also", terms, subList);
}
}
}
}
function addSee(refType, terms, list) {
var termCount = terms.length;
for (var i = 0; i < termCount; ++i) {
var term = terms[i];
var item = $("<li></li>");
item.addClass("wh-index-" + refType);
item.html("\n" + term);
list.append(item);
var see = $("<span class='wh-index-ref-type'></span>");
see.text((refType === "see")? msg("See") : msg("See also"));
see.prependTo(item);
}
}
function initIndex(field) {
var title = $("#wh-index-title");
if (title.length === 1) {
title.text(msg("Index"));
}
populateIndex();
$("#wh-index > li:odd").addClass("wh-odd-item");
field.attr("autocomplete", "off").attr("spellcheck", "false")
.attr("placeholder", msg("term"));
var allItems = $("#wh-index li");
field.keyup(function (event) {
switch (event.which) {
case fieldKeys.ENTER:
goSuggestedIndexEntry(field, allItems);
break;
case fieldKeys.ESCAPE:
cancelSuggestIndexEntry(field, allItems);
break;
case fieldKeys.UP:
autocompleteIndexEntry(field, allItems, true);
break;
case fieldKeys.DOWN:
autocompleteIndexEntry(field, allItems, false);
break;
default:
suggestIndexEntry(field, allItems);
}
});
$("#wh-go-page").attr("title", msg("Go"))
.click(function (event) {
goSuggestedIndexEntry(field, allItems);
});
$("#wh-index a.wh-index-anchor").click(function (event) {
selectIndexEntry(this, field, allItems);
});
}
var indexEntries = null;
function suggestIndexEntry(field, allItems) {
cancelSuggestIndexItem(field, allItems);
var prefix = normalizeTerm(field.val());
if (prefix.length > 0) {
if (indexEntries === null) {
initIndexEntries();
}
var entryCount = indexEntries.length;
for (var i = 0; i < entryCount; i += 2) {
if (indexEntries[i].indexOf(prefix) === 0) {
suggestIndexItem(indexEntries[i+1]);
break;
}
}
}
}
function normalizeTerm(term) {
if (term.length > 0) {
term = term.replace(/^\s+|\s+$/g, "")
.replace(/\s{2,}/g, " ")
.toLowerCase();
}
return term;
}
function initIndexEntries() {
indexEntries = [];
collectIndexEntries($("#wh-index > li"), null, indexEntries);
}
function collectIndexEntries(items, parentTerm, list) {
items.each(function () {
var termSpan = $(this).children("span.wh-index-term");
if (termSpan.length === 1) {
var term = normalizeTerm(termSpan.text());
if (parentTerm !== null) {
term = parentTerm + " " + term;
}
list.push(term);
list.push(this);
var subItems = $(this).children("ul.wh-index-entries")
.children("li.wh-index-entry");
if (subItems.length > 0) {
collectIndexEntries(subItems, term, list);
}
}
});
}
function suggestIndexItem(item) {
var suggest = $(item);
suggest.addClass("wh-suggested-item");
var pane = $("#wh-index-pane");
if (pane.is(":visible")) {
pane.removeData("whPendingScroll");
pane.scrollTop(suggest.offset().top - pane.offset().top);
} else {
pane.data("whPendingScroll", { container: pane, component: suggest });
}
}
function cancelSuggestIndexEntry(field, allItems) {
field.val("");
cancelSuggestIndexItem(field, allItems);
}
function cancelSuggestIndexItem(field, allItems) {
storageDelete("whIndexTerm");
allItems.removeClass("wh-suggested-item");
var pane = $("#wh-index-pane");
pane.scrollTop(0);
pane.removeData("whPendingScroll");
}
function goSuggestedIndexEntry(field, allItems) {
var item = allItems.filter(".wh-suggested-item");
if (item.length === 1) {
var anchors = item.children("a.wh-index-anchor");
if (anchors.length > 0) {
var anchor = anchors.get(0);
selectIndexEntry(anchor, field, allItems);
window.location.href = anchor.href;
}
}
}
function autocompleteIndexEntry(field, allItems, previous) {
cancelSuggestIndexItem(field, allItems);
var term = null;
var item = null;
if (indexEntries === null) {
initIndexEntries();
}
var prefix = normalizeTerm(field.val());
if (prefix.length > 0) {
var entryCount = indexEntries.length;
var i;
for (i = 0; i < entryCount; i += 2) {
if (indexEntries[i] === prefix) {
var index;
if (previous) {
index = i - 2;
} else {
index = i + 2;
}
if (index >= 0 && index+1 < entryCount) {
term = indexEntries[index];
item = indexEntries[index+1];
} else {
term = indexEntries[i];
item = indexEntries[i+1];
}
break;
}
}
if (item === null) {
for (i = 0; i < entryCount; i += 2) {
if (indexEntries[i].indexOf(prefix) === 0) {
term = indexEntries[i];
item = indexEntries[i+1];
break;
}
}
}
} else {
term = indexEntries[0];
item = indexEntries[1];
}
if (item !== null) {
field.val(term);
suggestIndexItem(item);
}
}
function selectIndexEntry(anchor, field, allItems) {
var term = null;
var item = $(anchor).parent().get(0);
if (indexEntries === null) {
initIndexEntries();
}
var entryCount = indexEntries.length;
for (var i = 0; i < entryCount; i += 2) {
if (indexEntries[i+1] === item) { 
term = indexEntries[i];
break;
}
}
if (term === null) {
storageDelete("whIndexTerm");
} else {
storageSet("whIndexTerm", term);
field.val(term);
allItems.removeClass("wh-suggested-item");
$(item).addClass("wh-suggested-item");
}
}
function restoreIndexTerm(field) {
var term = storageGet("whIndexTerm");
if (term) {
field.val(term);
if (indexEntries === null) {
initIndexEntries();
}
var entryCount = indexEntries.length;
for (var i = 0; i < entryCount; i += 2) {
if (indexEntries[i] === term) {
suggestIndexItem(indexEntries[i+1]);
break;
}
}
}
}
function initSearch(field) {
var title = $("#wh-search-title");
if (title.length === 1) {
title.text(msg("Search"));
}
field.attr("autocomplete", "off").attr("spellcheck", "false")
.attr("placeholder", msg("word"));
field.keyup(function (event) {
switch (event.which) {
case fieldKeys.ENTER:
search(field);
break;
case fieldKeys.ESCAPE:
cancelSearch(field);
break;
}
});
$("#wh-do-search").attr("title", msg("Search"))
.click(function (event) {
search(field);
});
$("#wh-cancel-search").attr("title", msg("Stop searching"))
.click(function (event) { 
cancelSearch(field);
});
var toggle = $("#wh-search-highlight");
toggle.attr("title", msg("Toggle search result highlighting"));
toggle.toggle({ checked: storageGet("whHighlightOff")? false : true,
ontoggle: toggleHighlight });
}
function toggleHighlight(checked) {
if (checked) {
storageDelete("whHighlightOff");
} else {
storageSet("whHighlightOff", "1");
}
var words = $("#wh-search-pane").data("whSearchedWords2");
if (words !== undefined) {
if (checked) {
highlightSearchedWords(words);
} else {
unhighlightSearchedWords();
}
}
}
function search(field) {
var pair = startSearch(field);
if (pair === null) {
return;
}
doSearch(pair[0], pair[1]);
}
function cancelSearch(field) {
field.val("");
stopSearch(field);
}
return {
initPage: initPage,
}
})();
$(document).ready(function() {
wh.initPage();
$("#wh-body").css({ "visibility": "visible", "opacity": "1" }); 
});
