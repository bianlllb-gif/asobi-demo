// 气味记忆游戏
async function ps(){
var gb=document.getElementById('gb');gb.classList.add('on');
var PAIR=[
  {t:'酸涩。闷了一整天。',        act:'黑丝套上去。裹住龟头。上下动。',     pool:['黑丝','连裤袜']},
  {t:'温热。潮湿的汗息。',        act:'鼻子贴脚底。手握着鸡巴。一起动。',      pool:['赤足','脚底','抬脚']},
  {t:'甜。底下是皮肤的咸。',      act:'抬手臂。把鼻子埋进腋下。手别停。',    pool:['腋下','抬手','汗腋']},
  {t:'皮革混着丝袜。密闭了一下午。', act:'肉丝套上去。丝袜磨龟头。撸。',     pool:['肉丝','高跟鞋','尖头']},
  {t:'暖烘烘。刚脱下来的。',      act:'棉袜裹住整根。从根到头顶。来回。',      pool:['棉袜','短袜','罗纹袜']},
  {t:'皮筋味。袜口勒久了。',      act:'过膝袜套上去。袜口那一圈卡在冠状沟。撸。',    pool:['连裤袜','腿部','袜口','蕾丝链条']},
  {t:'没擦。汗干了又湿。',        act:'鼻子埋进腋窝。舌头伸出来。手撸快一点。',    pool:['蹲姿','脚底','未穿丝袜','赤足']},
  {t:'潮闷。雨水闷在帆布里。',    act:'鞋口对着鼻子。另一只手握鸡巴。上下。',          pool:['帆布鞋','鞋架','运动鞋','老爹鞋']}
];
var imgs=[],actPool=[],pairTimes=[];
// 建全图池(含子目录)
var ALL_IMGS=IMG_POOL.slice();
try{
  var dirs=['images/序章','images/第一天','images/第三天'];
  for(var di=0;di<dirs.length;di++){
    var fs=document.querySelectorAll('img'); // 无法列举目录,改用预知方式
  }
}catch(e){}
for(var i=0;i<PAIR.length;i++){
  var pool=[];var kw=PAIR[i].pool;
  for(var j=0;j<IMG_POOL.length;j++){
    var hit=false;for(var k=0;k<kw.length;k++){if(IMG_POOL[j].indexOf(kw[k])!==-1){hit=true;break;}}
    if(hit)pool.push(IMG_POOL[j]);
  }
  imgs.push(pool.length>0?pool[Math.floor(Math.random()*pool.length)]:IMG_POOL[Math.floor(Math.random()*IMG_POOL.length)]);
  actPool.push(pool.length>0?pool:IMG_POOL); // 动作阶段用全池
  pairTimes.push(0);
}
var MSG=[
  '对。就这样。丝袜裹着龟头上下蹭。',
  '感觉到了吗。袜子的纹理磨过冠状沟。',
  '不准闭眼。睁眼看着屏幕上的图。',
  '套紧了没？松了我叫你重新来。',
  '你在抖。因为袜子的触感还是因为我看着你？',
  '鸡巴硬成这样。丝袜都被你撑薄了。',
  '呼吸乱了。想射是不是？还早。',
  '手快一点。龟头在袜子里顶到最前面。',
  '快了。别在这时候认输。还有几秒。'
];
var FAIL=[
  '错。+10秒。—— 鼻子废了？贴上去闻都闻不出来。',
  '不对。你自己的袜子和我的差远了。废物。',
  '刚才翻过这张。脑子里撸傻了闻不出来？',
  '又错了。袜子裹着鸡巴还把味道忘了？贱货。',
  '同样的错。你是故意想被多罚是吧。',
  '错。把袜子按在鼻孔上。吸。闻不到？',
  '不对。你手上有自己鸡巴的腥味。闻我的手——差远了。',
  '错了。你满脑子精液味。我的脚可比那个好闻一百倍。'
];
var EDGE_MSGS=[
  '全配完了。八种味道你都认了一遍。',
  '现在寸止。撸到龟头发胀——然后手拿开。',
  '你分清了每一种味道。证明你能忍。',
  '不准射。射了你今天就白做了。',
  '快到边缘了对不对？鸡巴在跳。我看到了。',
  '忍。我还没说可以。'
];
var order=[];for(var i=0;i<8;i++)order.push(i);
for(var i=7;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=order[i];order[i]=order[j];order[j]=t;}
var done={},selPid=-1,selSide='',lock=false,matched=0,mistakes=0,timers=[],resolve=null,pairStart=0;

function clrT(){for(var i=0;i<timers.length;i++){clearTimeout(timers[i]);clearInterval(timers[i]);}timers=[];}
function tip(m){var e=document.getElementById('_stip');if(e)e.textContent=m;}
function heel(){try{if(typeof o_heel_click!=='undefined')o_heel_click()}catch(e){}}

function render(flashPid){
  var h='<div style="color:#ff6b9d;font-size:13px;margin-bottom:6px;padding-top:20px;">气味记忆 '+matched+'/8</div>';
  h+='<div style="display:flex;gap:10px;justify-content:center;max-height:780px;overflow-y:auto;padding-top:30px;">';
  h+='<div id="_sleft" style="display:flex;flex-direction:column;gap:4px;">';
  for(var a=0;a<order.length;a++){var pid=order[a];if(done[pid])continue;
    var bd=(selSide==='i'&&selPid===pid)?'2px solid #ff6b9d':'2px solid rgba(255,255,255,.08)';
    if(flashPid===pid)bd='2px solid #66cc99';
    h+='<div data-s="i" data-p="'+pid+'" style="width:160px;height:110px;border-radius:6px;overflow:hidden;cursor:pointer;border:'+bd+';background:#1a1a2e;transition:all .2s;">';
    h+='<img src="'+imgs[pid]+'" draggable="false" style="width:100%;height:100%;object-fit:cover;"></div>';
  }
  h+='</div><div id="_sright" style="display:flex;flex-direction:column;gap:4px;">';
  for(var b=0;b<PAIR.length;b++){if(done[b])continue;
    var bd2=(selSide==='t'&&selPid===b)?'2px solid #ff6b9d':'2px solid rgba(255,255,255,.08)';
    if(flashPid===b)bd2='2px solid #66cc99';
    h+='<div data-s="t" data-p="'+b+'" style="width:170px;height:66px;background:#1a1a2e;border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;border:'+bd2+';transition:all .2s;">';
    h+='<span style="color:#ffcc80;font-size:13px;">'+PAIR[b].t+'</span></div>';
  }
  h+='</div></div><div id="_stip" style="color:#ff6b9d;font-size:13px;margin-top:8px;min-height:36px;text-align:center;line-height:1.4;"></div>';
  gb.innerHTML=h;
  var cards=document.querySelectorAll('#_sleft>div,#_sright>div');
  for(var i=0;i<cards.length;i++){cards[i].onclick=function(e){var el=e.target;while(el&&!el.getAttribute('data-s'))el=el.parentElement;if(!el)return;_sClick(el.getAttribute('data-s'),parseInt(el.getAttribute('data-p')));};}
}

function action(pid){
  clrT();if(G&&G.setBg)G.setBg(imgs[pid]);
  var dur=30+mistakes*10,r=dur,mi=0;
  var pool=actPool[pid],pi=0;
  var imgTimer=setInterval(function(){if(r>0&&G&&G.setBg){pi++;G.setBg(pool[pi%pool.length]);}},4000);
  timers.push(imgTimer);
  function tick(){
    if(r<=0){gb.innerHTML='<div style="color:#ff6b9d;font-size:20px;">停。手拿开。</div>';timers.push(setTimeout(function(){lock=false;matched>=8?_final():render();},1500));return;}
    if(r%3===0)mi++;if(r%2===0)heel();
    var off=Math.round(276*(1-r/dur));
    var circ='<svg width="90" height="90" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="3"/><circle cx="50" cy="50" r="44" fill="none" stroke="#ff6b9d" stroke-width="3" stroke-dasharray="276" stroke-dashoffset="'+off+'" transform="rotate(-90 50 50)" stroke-linecap="round"/><text x="50" y="56" text-anchor="middle" fill="#fff" font-size="24" font-weight="bold">'+r+'</text></svg>';
    gb.innerHTML='<div style="background:rgba(0,0,0,.6);border-radius:10px;padding:16px;text-align:center;"><div style="color:#ff6b9d;font-size:16px;">'+PAIR[pid].t+'</div><div style="color:#ffcc80;font-size:12px;margin:4px 0;">'+PAIR[pid].act+'</div>'+(mistakes>0?'<div style="color:#cc6666;font-size:11px;margin:2px 0;">配错'+mistakes+'次 +'+mistakes*10+'s</div>':'')+circ+'<div style="color:rgba(255,255,255,.4);font-size:12px;margin-top:4px;">'+MSG[mi%MSG.length]+'</div></div>';
    r--;timers.push(setTimeout(tick,1000));
  }
  tick();
}

function _sClick(side,pid){
  if(lock)return;
  if(selPid===-1){selPid=pid;selSide=side;render();if(side==='i')pairStart=Date.now();return;}
  if(selSide===side&&selPid===pid){selPid=-1;selSide='';render();return;}
  if(selSide===side){selPid=pid;render();if(side==='i')pairStart=Date.now();return;}
  var prev=selPid;selPid=-1;selSide='';
  if(prev!==pid){mistakes++;lock=true;render();tip(FAIL[Math.floor(Math.random()*FAIL.length)]);timers.push(setTimeout(function(){lock=false;render();},900));return;}
  // 配对成功
  var sec=Math.round((Date.now()-pairStart)/100)/10;
  pairTimes[pid]=sec;
  done[pid]=true;matched++;lock=true;
  render(pid);
  timers.push(setTimeout(function(){lock=false;action(pid);},350));
}

function _final(){
  clrT();if(G&&G.setBg)G.setBg(IMG_POOL[Math.floor(Math.random()*IMG_POOL.length)]);
  var msgs=EDGE_MSGS,i=0;
  function r(){gb.innerHTML='<div style="background:rgba(0,0,0,.65);border-radius:12px;padding:22px;text-align:center;"><div style="color:#ff6b9d;font-size:18px;">最终寸止</div><div style="color:#ccc;font-size:13px;margin:6px 0;">撸到快射了——然后停。不准射。</div><div id="_fmsg" style="color:#ffcc80;font-size:14px;min-height:22px;margin:8px 0;">'+msgs[0]+'</div><button class="cb" id="_farr" style="background:#ff6b9d88;color:#fff;font-size:20px;padding:12px 36px;">快射了</button></div>';
    document.getElementById('_farr').onclick=function(){clrT();gb.innerHTML='<div style="color:#ff6b9d;font-size:20px;">停。不准射。</div><div style="color:#ccc;font-size:13px;margin:6px 0;">手拿开。今天到此为止。</div>';timers.push(setTimeout(_end,2000));};
    timers.push(setInterval(function(){i++;var e=document.getElementById('_fmsg');if(e)e.textContent=msgs[i%msgs.length];},4000));
  }
  r();
}

function _end(){
  clrT();var m,ob,sh;
  if(mistakes<=2){m='几乎全对。—— 看来你对我身上的味道很熟嘛。平时没少闻？';ob=14;sh=-5;}
  else if(mistakes<=5){m='还行。有几下拿不准。—— 不过你边撸边闻，脑子转不过来也正常。下次我穿厚一点，让你更用力闻。';ob=10;sh=-7;}
  else{m='错太多了。—— 鸡巴一硬鼻子就废了是吧。今晚多闻一会儿。袜子别脱。';ob=6;sh=-10;}
  var slow=0,slowPID=0,fast=999,fastPID=0;
  for(var i=0;i<pairTimes.length;i++){if(pairTimes[i]>slow){slow=pairTimes[i];slowPID=i;}if(pairTimes[i]<fast){fast=pairTimes[i];fastPID=i;}}
  var h='<div style="color:#ff6b9d;font-size:18px;">完成</div>';
  h+='<div style="color:#ccc;font-size:12px;margin:4px 0;">配对8/8 · 翻错'+mistakes+'次</div>';
  h+='<div style="font-size:11px;line-height:1.6;margin:6px 0;">';
  for(var i=0;i<PAIR.length;i++){h+='<span style="color:'+(i===slowPID?'#cc6666':i===fastPID?'#66cc99':'rgba(255,255,255,.3)')+';">'+PAIR[i].t+' '+pairTimes[i].toFixed(1)+'s</span><br>';}
  h+='</div>';
  h+='<div style="color:#ffcc80;font-size:13px;margin:6px 0;">「'+m+'」</div>';
  if(slowPID!==fastPID)h+='<div style="color:#cc6666;font-size:11px;">最拿不准：「'+PAIR[slowPID].t+'」—— '+slow.toFixed(1)+'秒</div>';
  h+='<button class="cb" id="_done" style="background:#ff6b9d88;color:#fff;margin-top:8px;">继续</button>';
  gb.innerHTML=h;
  document.getElementById('_done').onclick=function(){gb.classList.remove('on');clrT();G.mo('obedience',ob);G.mo('shame',sh);resolve();};
}

gb.innerHTML='<div style="color:#ff6b9d;font-size:18px;">气味记忆</div>'+
  '<div style="color:#ffcc80;font-size:12px;margin-bottom:4px;">—— 苏婉</div>'+
  '<div style="color:#ccc;font-size:13px;line-height:1.8;margin:8px 0;">八种味道。八张图。把它们配成对。<br><br>配成一对——袜子套上去。手握住。上下动。三十秒。<br>配错一次——多罚十秒。全配完——寸止。<br><br>去拿袜子。闻清楚。别想着蒙混过关。<br>我看着你呢。</div>'+
  '<button class="cb" id="_ready" style="background:#ff6b9d88;color:#fff;margin-top:8px;">准备好了</button>';
await new Promise(function(rs){document.getElementById('_ready').onclick=function(){rs();};});
render();
await new Promise(function(rs){resolve=rs;});
}
