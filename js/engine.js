// ============ 引擎核心 ============
var PLAYER_NAME='林逸';
const G=(()=>{
let S={day:1,obedience:0,foot_need:10,armpit_need:5,shame:30,endurance:20,flags:{},gallery:[],action_round:1,actions_used:[],today_theme:'foot',today_fw:'black_stockings',d:null,di:0,isC:false,isT:false};
const SK='tgs';
const $bg=ge('bg'),$dn=ge('dn'),$dt=ge('dt'),$dh=ge('dh'),$ch=ge('ch'),$st=ge('st'),$bt=ge('bt'),$to=ge('to'),$gb=ge('gb'),$dlg=ge('dlg');
function ge(id){return document.getElementById(id);}
const sl=ms=>new Promise(r=>setTimeout(r,ms));
let tt,curImg=null;

function toast(m,d){d=d||2000;$to.textContent=m;$to.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){$to.classList.remove('show');},d);}
function mod(a,v){S[a]=Math.max(0,Math.min(100,S[a]+v));renderStats();}
function rpi(){return IMG_POOL[Math.floor(Math.random()*IMG_POOL.length)];}

function renderStats(){
  $st.innerHTML='<div>第<span class="sv">'+S.day+'</span>天 / 3</div>'+
    '<div><span class="sl">服从</span> <span class="sv">'+S.obedience+'</span><div class="sb"><div class="sf" style="width:'+S.obedience+'%;background:#ff6b9d"></div></div></div>'+
    '<div><span class="sl">足部依赖</span> <span class="sv">'+S.foot_need+'</span><div class="sb"><div class="sf" style="width:'+S.foot_need+'%;background:#ffcc80"></div></div></div>'+
    '<div><span class="sl">腋下依赖</span> <span class="sv">'+S.armpit_need+'</span><div class="sb"><div class="sf" style="width:'+S.armpit_need+'%;background:#81d4fa"></div></div></div>'+
    '<div><span class="sl">羞耻</span> <span class="sv">'+S.shame+'</span></div><div><span class="sl">耐受</span> <span class="sv">'+S.endurance+'</span></div>';
}
function renderBtns(){
  $bt.innerHTML='<button class="ab" onclick="G.sv()">存档</button><button class="ab" onclick="G.ld()">读档</button><button class="ab" onclick="G.gl()">画廊</button>';
}

function setBg(src){
  if(!src||src===curImg)return;curImg=src;
  $bg.style.opacity='0';$bg.src=src;
  $bg.onload=function(){$bg.style.opacity='1';$bg.style.transition='opacity .3s';};
  $bg.onerror=function(){$bg.classList.add('fb');};
}

async function sli(line){
  if(!line)return;$dh.style.display='block';
  $dn.style.display=line.speaker?'block':'none';$dn.textContent=line.speaker||'';
  if(line.img)setBg(line.img);
  S.isT=true;$dt.textContent='';var t=line.text||'';
  for(var i=0;i<t.length;i++){$dt.textContent+=t[i];await sl(20+Math.random()*15);}
  S.isT=false;
  if(line.c&&line.c.length>0){S.isC=true;$dh.style.display='none';rc(line.c);}
}

function sd(lines){S.d=lines;S.di=0;S.isC=false;$ch.innerHTML='';sli(lines[0]);}

function adv(){
  if(!S.d)return;if(S.isT){sk();return;}if(S.isC)return;
  S.di++;if(S.di<S.d.length)sli(S.d[S.di]);else{S.d=null;ap();}
}
function sk(){S.isT=false;var l=S.d[S.di];$dt.textContent=l.text||'';$dn.style.display=l.speaker?'block':'none';$dn.textContent=l.speaker||'';if(l.img)setBg(l.img);if(l.c&&l.c.length>0){S.isC=true;$dh.style.display='none';rc(l.c);}}
function rc(list){$ch.innerHTML=list.map(function(c,i){return'<button class="cb" onclick="G.sc('+i+')">'+c.label+'</button>';}).join('');}
function sc(idx){
  var c=S.d[S.di].c[idx];$ch.innerHTML='';S.isC=false;
  if(c.o)mod('obedience',c.o);if(c.f)mod('foot_need',c.f);if(c.a)mod('armpit_need',c.a);if(c.s)mod('shame',c.s);if(c.e)mod('endurance',c.e);
  if(c.fg)S.flags[c.fg]=true;if(c.gl&&!S.gallery.includes(c.gl))S.gallery.push(c.gl);
  if(c.n&&c.n.length>0)sd(c.n);else ap();
}
function ap(){if(S.ended)return;da();}

function sv(s){var d=Object.assign({},S);d.d=null;d.di=0;d.isC=false;d.isT=false;d.ts=new Date().toLocaleString();localStorage.setItem(SK+'_'+s,JSON.stringify(d));toast('存档成功');}
function ld(s){var r=localStorage.getItem(SK+'_'+s);if(!r){toast('空槽位');return;}var d=JSON.parse(r);Object.keys(S).forEach(function(k){delete S[k];});Object.assign(S,d);S.d=null;S.isC=false;S.isT=false;$ch.innerHTML='';$dn.style.display='none';$dt.textContent='';$dh.style.display='none';setBg('');$gb.classList.remove('on');closeModal();renderStats();renderBtns();toast('读档成功');setBg(rpi());sd([{speaker:'苏婉',text:'继续吧。'}]);}

var md;
function showModal(h){closeModal();md=document.createElement('div');md.className='modal';md.innerHTML=h;md.onclick=function(e){if(e.target===md)closeModal();};ge('game').appendChild(md);}
function closeModal(){if(md){md.remove();md=null;}}
function sm(){var h='<div class="mb"><h3>存档</h3>';for(var i=1;i<=5;i++){var r=localStorage.getItem(SK+'_'+i);var n='空';if(r){try{var d=JSON.parse(r);n='Day '+d.day+' | 服从 '+d.obedience;}catch(e){}}h+='<div class="mr"><span>存档'+i+': <small>'+n+'</small></span><button class="ma mp" onclick="G.sv2('+i+')">保存</button></div>';}h+='<div style="text-align:center;margin-top:10px"><button class="ma" onclick="G.closeModal()">关闭</button></div></div>';showModal(h);}
function lm(){var h='<div class="mb"><h3>读档</h3>';for(var i=1;i<=5;i++){var r=localStorage.getItem(SK+'_'+i);var n='空';if(r){try{var d=JSON.parse(r);n='Day '+d.day+' | 服从 '+d.obedience;}catch(e){}}h+='<div class="mr"><span>存档'+i+': <small>'+n+'</small></span><button class="ma mp" onclick="G.ld2('+i+')">读取</button></div>';}h+='<div style="text-align:center;margin-top:10px"><button class="ma" onclick="G.closeModal()">关闭</button></div></div>';showModal(h);}
function gl(){var items=['第一次足部高潮','寸止挑战通关','主动乞求','高潮控制','完美识图','完美服从'];var h='<div class="mb"><h3>画廊</h3><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">';items.forEach(function(n,i){var id='cg_'+i;var ul=S.gallery.includes(id);h+='<div style="aspect-ratio:3/4;background:rgba(255,255,255,'+(ul?'.1':'.03')+');border:1px '+(ul?'solid #ff6b9d44':'dashed rgba(255,255,255,.1)')+';border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;color:'+(ul?'#ffcc80':'#444')+'">'+(ul?n:'🔒')+'</div>';});h+='</div><div style="text-align:center;margin-top:10px"><button class="ma" onclick="G.closeModal()">关闭</button></div></div>';showModal(h);}

function ce(){if(S.foot_need>=30&&S.obedience>=15&&!S.flags['e1']){S.flags['e1']=true;toast('解锁：第一次足部高潮');}if(S.obedience>=50&&!S.flags['e2']){S.flags['e2']=true;toast('解锁：主动乞求');}if(S.obedience>=70&&S.endurance>=40&&!S.flags['e3']){S.flags['e3']=true;toast('解锁：高潮控制');}}
function cend(){S.ended=true;sd([{text:'三天训练结束。'},{speaker:'苏婉',text:'你比第一天变了不少。'},{text:'后续内容，敬请期待。'}]);}

// 每日行动 — 苏婉指定
function da(){
  var games=[{gm:'obey',l:'服从测试',t:'第一件事——我要知道你的一切。诚实回答。'},
    {gm:'edge',l:'寸止挑战',t:'跟紧我的节拍。别想偷懒。'},
    {gm:'scent',l:'气味记忆',t:'闻清楚。认准了。错了加罚。'}];
  var pick;
  if(S.day===1){pick=games[0];S.played=[0];}
  else{
    var avail=[];
    for(var i=0;i<games.length;i++){if(S.played.indexOf(i)===-1)avail.push(i);}
    if(avail.length===0){S.played=[0,1];avail=[1,2];}
    pick=games[avail[Math.floor(Math.random()*avail.length)]];
    S.played.push(games.indexOf(pick));
  }
  $gb.classList.add('on');
  $gb.innerHTML='<div style="color:#ff6b9d;font-size:16px;">第'+S.day+'天</div>'+
    '<div style="color:#ffcc80;font-size:13px;margin:6px 0;">苏婉：'+pick.t+'</div>'+
    '<button class="cb" style="background:#ff6b9d88;color:#fff;margin-top:8px;" id="dabtn">开始</button>';
  var fn=pick.gm==='edge'?pe:pick.gm==='obey'?po:ps;
  document.getElementById('dabtn').onclick=function(){
    $gb.classList.remove('on');
    $dlg.style.display='none';$st.style.display='none';$bt.style.display='none';$ch.style.display='none';
    fn().then(function(){
      $dlg.style.display='';$st.style.display='';$bt.style.display='';$ch.style.display='';
      S.day++;renderStats();
      if(S.day>3){cend();return;}
      setBg(rpi());
      night_trans();
    });
  };
}
// ====== 天间过渡剧情 ======
var TR_NIGHT_IMG='images/室内瓷砖地面场景，端坐姿势，穿白色丝袜搭配蓝色毛绒拖鞋，从正面角度拍摄双腿及脚部。.jpg';
var TR_STREET_IMG='images/室外街道场景，行走姿势，未穿丝袜搭配白色运动跑鞋，从侧面角度拍摄全身及脚部.jpg';
var TR_APT_IMG='images/室内地毯场景，翘腿姿势，穿肉色丝袜搭配红黑渐变尖头高跟鞋，从侧下方角度拍摄小腿及足部.jpg';

function night_trans(){
  setBg(TR_NIGHT_IMG);
  var ob=S.obedience;
  var lines=[];
  if(S.day===2){
    // Day1→2 用蓝拖鞋夜景
    lines.push({text:'灯光调暗。窗外是夜景。苏婉坐在沙发上，白色丝袜裹着小腿，套着一双蓝色毛绒拖鞋。林逸还跪在地毯上。她把手机放到一边。'});
    lines.push({speaker:'苏婉',text:'第一天结束了。'});
    if(ob<20){lines.push({speaker:'苏婉',text:'你几乎没对我说一句实话。每道题都在躲，每条指令都在犹豫。'});lines.push({speaker:'苏婉',text:'我不生气。第一天，你会怕，我理解。'});lines.push({speaker:'苏婉',text:'但明天，我希望你记住。在我面前撒谎，没有半点好处。'});lines.push({speaker:'苏婉',text:'想清楚。明天同一时间。'});}
    else if(ob<40){lines.push({speaker:'苏婉',text:'还行。至少有一半是实话。'});lines.push({speaker:'苏婉',text:'你犹豫的时候手指在抖，嘴唇动了好几下又把话吞回去。我都看到了。没关系。'});lines.push({speaker:'苏婉',text:'第一天能到这个程度，不算差了。'});lines.push({speaker:'苏婉',text:'明天继续。希望你比今天更诚实一点。多一点点就好。'});}
    else{lines.push({speaker:'苏婉',text:'你今天很诚实。'});lines.push({speaker:'苏婉',text:'每一个回答我都记得。你跪在这里说出的那些话，十年了，你是第一次对别人说出口。对不对。'});lines.push({speaker:'苏婉',text:'你没有让我失望。回去好好休息。明天会比今天更难。但你既然第一天就敢说实话，我猜你不会怕。'});}
    lines.push({text:'林逸离开公寓。走廊的灯亮了又灭。躺到床上，没睡着。'});
    var D='images/第一天/';
    lines.push({img:D+'室内瓷砖地面场景，翘腿姿势，穿着白色罗纹袜搭配白色运动跑鞋，从侧面角度拍摄脚部。林婉在教室拖鞋勾引你.jpg',text:'第二天。下午最后一节课。人走得差不多了，苏婉坐在他前排，翘着腿，白色罗纹袜裹着脚背。她回头看了林逸一眼，轻轻一踢，右脚的运动鞋滑落在地。'});
    lines.push({text:'林逸心跳漏了一拍。苏婉没回头，用脚尖勾着鞋的边缘晃了两下。她明知道他在看。'});
    lines.push({img:D+'室内瓷砖地面场景，翘腿姿势，穿着白色短袜搭配白色运动跑鞋，从上方俯视角度拍摄全脚，在教室假意透气.jpg',text:'她把鞋子蹬掉，白色短袜踩在鞋面上，脚趾在袜子里蜷了蜷。歪头看了他一眼。'});
    lines.push({speaker:'苏婉',text:'闷了一整天。走吧，跟我回家。'});
    lines.push({img:D+'走路.jpg',text:'两人走出教学楼。苏婉还是走在他前面半步，换回了白色运动鞋。林逸跟在后面，脑子里还停在她脚尖勾鞋的那个画面。'});
    lines.push({img:D+'室内瓷砖地面场景，端坐姿势，穿着黄色运动跑鞋，从脚底视角拍摄，重点展示鞋底纹理，回家后还没换鞋.jpg',text:'公寓。苏婉在玄关坐下。黄色运动跑鞋的鞋底在灯光下纹理分明。她今天穿的不是昨天那双。'});
    lines.push({speaker:'苏婉',text:'帮我脱。'});
    lines.push({text:'林逸跪下来解鞋带。鞋脱下来，闷了一天的热气和皮革味涌出来。'});
    lines.push({img:D+'室内瓷砖地面场景，翘腿姿势，穿着白色短袜搭配白色运动跑鞋，从上方俯视角度拍摄全脚，回家后脱鞋后还没有换.jpg',text:'她把双脚伸到他面前。白色短袜的袜底微微发灰。'});
    lines.push({img:D+'脱下来的棉袜.jpg',text:'苏婉从鞋柜里抽出昨天那双白棉袜，丢在他膝盖上。'});
    lines.push({speaker:'苏婉',text:'昨天的。今天的。比一下，哪个味道重。'});
    lines.push({img:D+'棉袜怼脸，回家后.jpg',text:'林逸把两双袜子凑到鼻尖。今天的温热，昨天的酸闷。他的脸在烧。'});
    lines.push({speaker:'苏婉',text:'怎么样。'});
    lines.push({text:'林逸说不出话。她笑了。'});
    lines.push({img:D+'室内床铺场景，翘腿姿势，穿着白色短袜，从正面角度拍摄双脚，回家后脱完鞋的自拍.jpg',text:'苏婉站起来走到床边坐下，翘起腿，白色短袜的脚尖朝向他。这个角度的她看起来放松了很多。'});
    lines.push({img:D+'室内瓷砖场景，交叉腿姿势，穿着白色短袜搭配粉色兔子毛绒拖鞋，从俯视角度拍摄双脚，同样的袜子，但是到家换成了拖鞋.jpg',text:'她套上粉色兔子毛绒拖鞋，交叉腿坐着。白袜配粉拖，但眼神的温度没变。'});
    lines.push({img:D+'室内沙发场景，躺姿，穿着白色棉袜，从侧上方角度拍摄双脚，怼脸2.jpg',text:'苏婉走到沙发前躺下。白色棉袜裹着的双脚搭在扶手上，跟昨天一样的位置。'});
    lines.push({speaker:'苏婉',text:'好了。今天的训练，正式开始。'});
    lines.push({img:D+'室内瓷砖地面场景，翘腿姿势，穿着白色短袜搭配白色运动跑鞋，从上方俯视角度拍摄全脚，脱鞋后让你舔.jpg',text:'她踢掉拖鞋，白袜脚尖点在茶几边缘。'});
  }else if(S.day===3){
    setBg('images/第三天/室内床上场景，躺姿，穿着黑色连裤袜，未穿鞋，从侧后方角度拍摄双脚及腿部，黑丝趴在床上.jpg');
    var D3='images/第三天/';
    lines.push({img:'images/室内木地板场景，蹲姿，未穿丝袜和鞋子。拍摄重点为脚底，从低角度近距离拍摄.jpg',text:'训练结束。苏婉去了浴室。出来的时候光着脚踩在木地板上，脚底还是湿的。她在林逸面前蹲下来，赤足踩实地面。从跪着的角度，第一次平视她的脚底。没有丝袜，没有鞋子。她没说话，只是让他看着。'});
    lines.push({text:'第二天结束了。林逸比昨天更晚离开。他的手还在微微发抖。'});
    lines.push({text:'第三天清晨。手机没有消息。林逸自己醒了。他站在镜子前看了看自己，已经不太像三天前那个人了。'});
    lines.push({img:D3+'室内地毯场景，翘腿姿势，穿肉色丝袜搭配红黑渐变尖头高跟鞋，从侧下方角度拍摄小腿及足部，开会时的偷拍.jpg',text:'下午，他在教学楼走廊碰到苏婉。她刚从外面开会回来。肉色丝袜配红黑渐变尖头高跟鞋，西装裙，头发盘起来。完全不像教室里的她。她正和别人说话，脚踝轻轻转了一下，高跟鞋在地板上敲出清脆的一声。林逸远远看着，没敢靠近。'});
    lines.push({img:D3+'室内木地板场景，交叉腿坐姿，穿黑色丝袜搭配棕色芭蕾平底鞋。从正面视角拍摄，展示了双腿及脚部整体形态，在外的形象，完全是学校相反.jpg',text:'苏婉在校外的形象跟教室判若两人。黑色丝袜配棕色芭蕾平底鞋，低调但精致。她看到林逸，嘴角动了一下，没说话。只是用鞋尖轻轻点了点地面。'});
    lines.push({img:D3+'室内木地板场景，人物呈蹲姿，身穿黑色皮草外套与肉色丝袜，搭配黑色尖头高跟鞋，从侧前方角度拍摄腿部及足部。.jpg',text:'傍晚。公寓门推开的时候，林逸已经在里面等着了。苏婉今天比昨天晚回来——黑色皮草外套搭在手臂上，肉色丝袜裹着小腿，黑色尖头高跟鞋踩在地板上。她看起来不像同学。像一个要审问他的人。'});
    lines.push({speaker:'苏婉',text:'等很久了？'});lines.push({text:'林逸摇头。'});lines.push({speaker:'苏婉',text:'今天开会开了一天。脚很累。'});
    lines.push({img:D3+'室内瓷砖地面场景，交叉腿姿势，穿着肉色丝袜搭配黑色铆钉芭蕾平底鞋，从侧面角度拍摄双脚，在家，无丝袜，挑着高跟.jpg',text:'她在玄关坐下，肉色丝袜裹着的脚从铆钉芭蕾平底鞋里滑出来，脚尖勾着鞋晃了两圈。高跟鞋在脚尖上悬着，像要掉不掉。'});
    lines.push({speaker:'苏婉',text:'帮我把鞋放好。'});
    lines.push({text:'林逸接过鞋，鞋内还带着体温。'});
    lines.push({img:D3+'室内瓷砖地面场景，端坐姿势，穿着黑色丝袜，旁边放置尖头高跟鞋，从正面低角度拍摄双脚。.jpg',text:'她换上黑色丝袜，旁边放着一双尖头细跟高跟鞋。端坐在椅子上，双腿并拢，黑丝的脚尖轻轻点着地面。这个姿势太正式了，像是要谈正事。'});
    lines.push({speaker:'苏婉',text:'最后一天了，林逸。'});lines.push({speaker:'苏婉',text:'前两天你是被动服从。今天，我要看看你能不能主动。'});
    lines.push({img:D3+'室内床上场景，躺姿，穿着黑色连裤袜，未穿鞋，从侧后方角度拍摄双脚及腿部，黑丝趴在床上.jpg',text:'她站起来，走到床边趴下。黑色连裤袜裹着的双腿从侧后方看线条分明。她把脸埋进臂弯里，声音闷闷的。'});
    lines.push({speaker:'苏婉',text:'过来。'});
    lines.push({img:D3+'室内床铺场景，端坐姿势，穿着黑色丝袜，赤足状态。从脚底视角拍摄，重点展示脚底及脚趾细节，黑丝怼脸.jpg',text:'林逸走过去。她翻过身，穿着黑色丝袜的脚底凑到他面前。脚尖几乎碰到他的鼻尖。这个距离太近了，黑丝的纹理一根根都看得清。'});
    lines.push({speaker:'苏婉',text:'跪好。我们开始。'});
    // 结束后
    lines.push({img:D3+'室内瓷砖地面场景，翘腿姿势，赤足状态，从上方俯视角度拍摄脚底，忙完一条后，洗澡时发红的脚底.jpg',text:'训练结束。苏婉去了浴室。林逸还跪在地毯上。浴室里水声响了很久。她出来的时候赤足踩在地板上，脚底微微发红。没穿拖鞋，也没穿袜子。就这样走到他面前。'});
    lines.push({speaker:'苏婉',text:'三天了。'});lines.push({speaker:'苏婉',text:'你知道我最满意的是什么吗。不是你撑了多久。是这三天——你一次都没有逃。'});
  }
  sd(lines);
}
function de(){de=function(){};}

return {adv,sc,st:null,sv,ld,sv2:sv,ld2:ld,sm,lm,gl,closeModal,mo:mod,toast,setBg,sd,rpi,renderStats,renderBtns,mod,S,da,de,nd:null,night_trans,cend};
})();
