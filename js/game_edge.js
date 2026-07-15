// 寸止忍耐挑战
var eState='idle',eRound=0,eTotal=5,eBar=0,eBeatOn=false,eTick=null,eBgTimer=null,eBeatTimer=null,eBeatPhase=0,ePhaseTime=0,eMsgTimer=0,eCurSp=1,eSpTab=[0.5,0.8,1.3,2.0],eSpName=['慢','正常','快','极快'],eBeatMs=[1500,1000,650,450],eResolve=null,eVideo=null;
var eVideoPool=['videos/10.mp4','videos/10 (2).mp4','videos/15.mp4','videos/16.mp4','videos/17.mp4','videos/23.mp4','videos/29.mp4','videos/30.mp4','videos/33.mp4','videos/34.mp4','videos/39.mp4','videos/44.mp4','videos/45.mp4','videos/55.mp4','videos/56.mp4','videos/101.MP4'];
var eVideoIdx=0;

function e_clear_video(){
  if(eVideo){eVideo.pause();eVideo.remove();eVideo=null;}
}

function e_click(){
  try{
    var c=new(window.AudioContext||window.webkitAudioContext)();
    var o=c.createOscillator(),g=c.createGain();
    o.type='sine';o.frequency.value=500;
    g.gain.setValueAtTime(0.12,c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.06);
    o.connect(g);g.connect(c.destination);
    o.start(c.currentTime);o.stop(c.currentTime+0.06);
  }catch(e){}
}

var e_lines=[
  '鸡巴硬成这样。才刚开始。',
  '慢一点。龟头在袜子里胀。',
  '加速。手跟上。跟不上的话重来。',
  '你在抖。爽还是怕？',
  '龟头露出来。全部。我要看着。',
  '呼吸乱了。想射？不准。',
  '这根鸡巴从初二就想被脚踩。',
  '快到了？忍住。废物才射。',
  '丝袜破了没备用。撸轻点。',
  '差点射对吧。龟头跳了。',
  '手酸？对着屏幕撸怎么不酸。',
  '慢。慢。慢。记住这感觉。',
  '丝袜磨过冠状沟——跳了一下。',
  '握着别动。就这个速度。',
  '快了快了。慢下来——没让你停。',
  '你脸红了。对着我的图撸了这么多年。',
  '撸出声音来。我要听到。',
  '这根鸡巴现在是我的。我让你快你才能快。',
  '你裤子里硬了多久了？从看到我的脚开始？',
  '停下来。现在就停。三、二、一——继续撸。'
];
var e_edgeWarn=[
  '寸止——要来了。','忍住。80%以上再按。','注意——快到了。','别射。我没说可以。','手别抖。看准了。',
  '快了……快了……忍住！','龟头在胀了对吧。忍住！','不许射。我盯着呢。','到了。按！不对——还差一点！'
];
var e_roundOk=['第一次。撑住了。换个节奏。','第二次。不错。加快。','三次了。比我想的能忍。','还剩两次。别在这时候射。','最后一次。最快速度——撑住。'];
var e_failEarly=['太早了。废物。重来。','还没到80%急什么。重来。'];
var e_failLate=['没忍住。脑子里全是精液。重来。','叫你忍你不忍。重来。'];

function e_cleanup(){
  clearInterval(eTick);clearInterval(eBgTimer);clearInterval(eBeatTimer);
  eTick=null;eBgTimer=null;eBeatTimer=null;eBeatOn=false;
  e_clear_video();
}

// ===== 主循环，每100ms一次 =====
function e_loop(){
  if(eState==='beat'){
    ePhaseTime--;
    // 切换羞辱台词
    eMsgTimer--;if(eMsgTimer<=0){var em=document.getElementById('emsg');if(em){em.textContent=e_lines[Math.floor(Math.random()*e_lines.length)];eMsgTimer=20;}}
    if(ePhaseTime<=0)e_go_edge();
  }else if(eState==='edge'){
    eBar+=100/150;
    if(eBar>=100){eBar=100;eState='late';e_cleanup();e_render();return;}
    var p=Math.round(eBar);var bar=document.getElementById('ebar');if(bar)bar.style.width=p+'%';
    eMsgTimer--;if(eMsgTimer<=0){var em2=document.getElementById('emsg');if(em2)em2.textContent=e_edgeWarn[Math.floor(Math.random()*e_edgeWarn.length)];eMsgTimer=15;}
  }
}

// ===== 节拍脉冲 =====
function e_beat_pulse(){
  if(eState!=='beat')return;
  eBeatPhase=1-eBeatPhase;
  var el=document.getElementById('ebeat');if(!el)return;
  el.style.transform='scale('+(eBeatPhase?'1.4':'1')+')';
  el.style.opacity=eBeatPhase?'1':'0.3';
  e_click();
}

// ===== 进入寸止 =====
function e_go_edge(){
  eState='edge';eBar=0;eBeatOn=false;eMsgTimer=0;
  clearInterval(eBeatTimer);eBeatTimer=null;
  clearInterval(eBgTimer);eBgTimer=null;
  if(G&&G.setBg)G.setBg('');
  e_clear_video();
  var vid=document.createElement('video');
  vid.src=eVideoPool[eVideoIdx%eVideoPool.length];eVideoIdx++;
  vid.loop=false;vid.autoplay=true;vid.playsInline=true;
  vid.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:5;opacity:0;transition:opacity .5s;';
  vid.onended=function(){if(eState==='edge'){vid.src=eVideoPool[eVideoIdx%eVideoPool.length];eVideoIdx++;vid.play();}};
  document.getElementById('game').appendChild(vid);
  eVideo=vid;
  requestAnimationFrame(function(){requestAnimationFrame(function(){vid.style.opacity='1';});});
  var bw=document.getElementById('ebarwrap');if(bw)bw.style.display='block';
  var be=document.getElementById('ebeatwrap');if(be)be.style.display='none';
  var st=document.getElementById('estatus');if(st)st.textContent=eRound+'/'+eTotal+' ⚡寸止！';
  // 大号寸止弹出
  var em=document.getElementById('emsg');if(em){
    em.textContent='寸止！！';
    em.style.color='#ff6b9d';em.style.fontSize='48px';em.style.fontWeight='bold';
    em.style.transition='all .5s ease';
    setTimeout(function(){if(em){em.style.fontSize='28px';em.style.fontWeight='normal';em.textContent='忍住！！';}},1200);
    setTimeout(function(){if(em){em.textContent=e_edgeWarn[0];em.style.fontSize='14px';eMsgTimer=15;}},2500);
  }
}

// ===== 进入跟拍 =====
function e_go_beat(){
  eState='beat';ePhaseTime=100+Math.floor(Math.random()*300);eMsgTimer=0;eBeatOn=true;
  eBeatTimer=setInterval(e_beat_pulse,eBeatMs[eCurSp]);
  eBgTimer=setInterval(function(){if(IMG_POOL.length>0&&G&&G.setBg)G.setBg(IMG_POOL[Math.floor(Math.random()*IMG_POOL.length)]);},2000);
  edge_random_bg();
  var bw=document.getElementById('ebarwrap');if(bw)bw.style.display='none';
  var be=document.getElementById('ebeatwrap');if(be)be.style.display='flex';
  var st=document.getElementById('estatus');if(st)st.textContent=eRound+'/'+eTotal;
  var em=document.getElementById('emsg');if(em){em.style.color='#ffcc80';em.style.fontSize='14px';}
}

// ===== 按忍住 =====
function edge_hold(){
  if(eState!=='edge')return;
  if(eBar>=80&&eBar<100){
    eRound++;
    clearInterval(eTick);eTick=null;clearInterval(eBeatTimer);eBeatTimer=null;
    e_clear_video();
    if(eRound>=eTotal){eState='win';e_cleanup();e_render();return;}
    eCurSp=Math.floor(Math.random()*4);
    e_setup_ui();
    var em=document.getElementById('emsg');if(em){em.textContent=e_roundOk[eRound-1];em.style.color='#66cc99';em.style.fontSize='15px';}
    var st=document.getElementById('estatus');if(st){st.textContent=eRound+'/'+eTotal;st.style.color='#66cc99';}
    setTimeout(function(){e_go_beat();eTick=setInterval(e_loop,100);},1800);
  }else if(eBar<80){
    eState='early';e_cleanup();e_render();
  }else{
    eState='late';e_cleanup();e_render();
  }
}

// ===== UI =====
function e_setup_ui(){
  var gb=document.getElementById('gb');
  gb.innerHTML=
    '<div id="estatus" style="color:rgba(255,255,255,.35);font-size:14px;margin-bottom:8px;">'+eRound+'/'+eTotal+'</div>'+
    '<div id="ebeatwrap" style="display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:12px;padding:10px 0;">'+
      '<div id="ebeat" style="width:22px;height:22px;border-radius:50%;background:#ff6b9d;transition:all .2s;opacity:0.3;box-shadow:0 0 12px rgba(255,107,157,.3);"></div>'+
      '<div style="color:rgba(255,255,255,.5);font-size:13px;">'+eSpName[eCurSp]+'</div>'+
    '</div>'+
    '<div id="ebarwrap" style="display:none;width:600px;height:28px;background:rgba(255,255,255,.08);border-radius:14px;overflow:hidden;margin-bottom:10px;"><div id="ebar" style="width:0%;height:100%;background:linear-gradient(90deg,#ff6b9d,#ff3366);border-radius:14px;"></div></div>'+
    '<div id="emsg" style="color:#ffcc80;font-size:14px;min-height:22px;margin-bottom:10px;line-height:1.5;"></div>'+
    '<button class="cb" id="eholdbtn" style="background:#ff6b9d88;color:#fff;font-size:20px;padding:12px 40px;">忍 住</button>';
  document.getElementById('eholdbtn').onclick=edge_hold;
  gb.classList.add('on');
}

function e_render(){
  var gb=document.getElementById('gb');
  if(eState==='intro'){
    gb.innerHTML='<div style="color:#ff6b9d;font-size:18px;">寸止忍耐挑战</div><div style="color:#ffcc80;font-size:12px;margin-bottom:6px;">—— 苏婉</div><div style="color:#ddd;font-size:14px;line-height:1.6;">跟着节拍撸。随时会变快变慢。<br>进度条出现=寸止开始。15秒内80-99%点「忍住」。<br>早了重来。晚了就射。5次全撑住算过关。<br><br>准备好了？</div><button class="cb" style="background:#ff6b9d88;color:#fff;margin-top:8px;" onclick="edge_start()">开始挑战</button>';
  }else if(eState==='early'){
    gb.innerHTML='<div style="color:#cc6666;font-size:20px;">太早了</div><div style="color:#ccc;font-size:13px;margin:6px 0;">「'+e_failEarly[Math.floor(Math.random()*e_failEarly.length)]+'」</div><button class="cb" style="background:#ff6b9d88;color:#fff;" onclick="edge_start()">重来</button>';
  }else if(eState==='late'){
    gb.innerHTML='<div style="color:#ff4444;font-size:20px;">没忍住</div><div style="color:#ccc;font-size:13px;margin:6px 0;">「'+e_failLate[Math.floor(Math.random()*e_failLate.length)]+'」</div><button class="cb" style="background:#ff6b9d88;color:#fff;" onclick="edge_start()">重来</button>';
  }else if(eState==='win'){
    gb.innerHTML='<div style="color:#ff6b9d;font-size:20px;">五次全撑住了</div><div style="color:#ccc;font-size:13px;margin:6px 0;">「五次都没射……已经学会把身体交给我了。」</div><button class="cb" style="background:#ff6b9d88;color:#fff;" onclick="var gb=document.getElementById(\'gb\');gb.classList.remove(\'on\');if(eResolve)eResolve()">继续</button>';
  }
  gb.classList.add('on');
}

// ===== 开始 =====
function edge_start(){
  e_cleanup();
  eRound=0;eCurSp=1;eBar=0;eState='beat';
  e_setup_ui();
  e_go_beat();
  eTick=setInterval(e_loop,100);
  eBgTimer=setInterval(function(){if(IMG_POOL.length>0&&G&&G.setBg)G.setBg(IMG_POOL[Math.floor(Math.random()*IMG_POOL.length)]);},2000);
}

function edge_random_bg(){
  if(IMG_POOL.length>0&&typeof G!=='undefined'&&G.setBg)G.setBg(IMG_POOL[Math.floor(Math.random()*IMG_POOL.length)]);
}

async function pe(){
  eState='intro';eRound=0;eCurSp=1;
  await new Promise(function(rs){eResolve=rs;e_render();});
  e_cleanup();
  if(eState==='win'){G.mo('obedience',12);G.mo('endurance',10);G.mo('shame',-5);G.toast('解锁CG：寸止通关');}
  else{G.mo('shame',-10);G.mo('endurance',-5);G.mo('obedience',3);}
  eState='idle';eResolve=null;
}
