// 足部识图问答
var QUIZ_DB=[
  {sock:'黑丝',part:'全脚'},
  {sock:'白丝',part:'全脚'},
  {sock:'无丝袜',part:'全脚'},
  {sock:'无丝袜',part:'脚底'},
  {sock:'白丝',part:'脚踝'},
  {sock:'棉袜',part:'脚底'},
  {sock:'黑丝',part:'脚踝'},
  {sock:'白丝',part:'脚跟'},
  {sock:'无丝袜',part:'全脚'},
  {sock:'白丝',part:'小腿'},
  {sock:'无丝袜',part:'脚跟'},
  {sock:'白丝',part:'全脚'}
];
var SOCKS=['黑丝','白丝','肉丝','无丝袜','棉袜'];
var PARTS=['脚趾','脚心','脚跟','脚踝','全脚','小腿'];

function q_get_pool(){return IMG_POOL;}

async function pq(){
  var pool=q_get_pool();
  var questions=[];
  var shuffled=QUIZ_DB.slice();for(var i=shuffled.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=shuffled[i];shuffled[i]=shuffled[j];shuffled[j]=t;}
  questions=shuffled.slice(0,10);

  var qi=0, correct=0, totalScore=0;
  var curSock='', curPart='', timeLeft=4, timerId=null;
  var gb=document.getElementById('gb');gb.classList.add('on');

  await new Promise(function(rs){
    function render_intro(){
      gb.innerHTML='<div style="color:#ff6b9d;font-size:18px;">足部识图训练</div><div style="color:#ffcc80;font-size:12px;margin-bottom:6px;">—— 苏婉</div><div style="color:#ddd;font-size:14px;line-height:1.6;">你看了那么多张我的脚，现在让我看看你认不认得出来。<br>每张图——选对丝袜类型和脚部位置。每题4秒。<br>重点不是对错，是你在看。认真看。每一寸。<br>准备好了？</div><button class="cb" style="background:#ff6b9d88;color:#fff;margin-top:8px;" id="qstart">开始训练</button>';
      document.getElementById('qstart').onclick=function(){next_question();};
    }

    function next_question(){
      if(qi>=10){show_result();return;}
      curSock='';curPart='';timeLeft=4;
      var q=questions[qi];
      var img=pool[Math.floor(Math.random()*pool.length)];
      render_question(q,img);
      clearInterval(timerId);
      timerId=setInterval(function(){
        timeLeft-=0.1;
        if(timeLeft<=0){timeLeft=0;clearInterval(timerId);submit_answer();return;}
        update_timer();
      },100);
    }

    function render_question(q,img){
      var r=Math.round(timeLeft*25);
      var h='<div style="color:#ff6b9d;margin-bottom:4px;">第'+(qi+1)+'/10题 · 得分 '+totalScore+' · '+timeLeft.toFixed(1)+'s</div>';
      h+='<div style="width:600px;height:6px;background:rgba(255,255,255,.1);"><div id="qtbar" style="width:'+r+'%;height:100%;background:#ff6b9d;transition:width .1s linear;"></div></div>';
      h+='<img src="'+img+'" style="max-width:600px;max-height:280px;object-fit:contain;margin:4px 0;" onerror="this.style.display=\'none\'">';
      h+='<div style="margin:4px 0;">丝袜: '+SOCKS.map(function(s){return'<button class="cb qsock" data-v="'+s+'" style="font-size:11px;padding:3px 8px;margin:2px;background:'+(curSock===s?'#ff6b9d88':'rgba(255,255,255,.1)')+'">'+s+'</button>';}).join('')+'</div>';
      h+='<div style="margin:4px 0;">部位: '+PARTS.map(function(p){return'<button class="cb qpart" data-v="'+p+'" style="font-size:11px;padding:3px 8px;margin:2px;background:'+(curPart===p?'#ff6b9d88':'rgba(255,255,255,.1)')+'">'+p+'</button>';}).join('')+'</div>';
      h+='<button class="cb" id="qsub" style="background:#ff6b9d88;color:#fff;">确认 ('+timeLeft.toFixed(1)+'s)</button>';
      gb.innerHTML=h;

      var socks=document.querySelectorAll('.qsock');
      for(var i=0;i<socks.length;i++){socks[i].onclick=function(){curSock=this.dataset.v;render_question(q,img);};}
      var parts=document.querySelectorAll('.qpart');
      for(var i=0;i<parts.length;i++){parts[i].onclick=function(){curPart=this.dataset.v;render_question(q,img);};}
      var sub=document.getElementById('qsub');
      if(sub)sub.onclick=function(){clearInterval(timerId);submit_answer();};
    }

    function update_timer(){
      var bar=document.getElementById('qtbar');if(bar)bar.style.width=Math.round(timeLeft*25)+'%';
      var sub=document.getElementById('qsub');if(sub)sub.textContent='确认 ('+timeLeft.toFixed(1)+'s)';
    }

    function submit_answer(){
      clearInterval(timerId);
      var q=questions[qi];
      var isCorrect=(curSock===q.sock&&curPart===q.part);
      if(isCorrect)correct++;
      var score=50+Math.floor(timeLeft*25);
      totalScore+=score;
      qi++;
      next_question();
    }

    function show_result(){
      var msg, ob, ft, gl;
      if(correct>=9){msg='全对呢……看来你对我的脚很了解嘛。';ob=15;ft=10;gl='quiz_perfect';}
      else if(correct>=6){msg='大部分都认对了。还要继续努力哦。';ob=10;ft=7;gl=null;}
      else if(correct>=3){msg='勉强及格……看来你需要更多时间「熟悉」我的脚。';ob=5;ft=4;gl=null;}
      else{msg='（轻轻叹了口气）连丝袜都分不清吗……今晚加练。';ob=2;ft=2;gl=null;}

      gb.innerHTML='<div style="color:#ff6b9d;font-size:20px;">训练结束</div>'+
        '<div style="color:#ccc;margin:8px 0;">正确 '+correct+'/10 · 总分 '+totalScore+'</div>'+
        '<div style="color:#ffcc80;margin-bottom:8px;">苏婉：'+msg+'</div>'+
        '<button class="cb" style="background:#ff6b9d88;color:#fff;" id="qdone">继续</button>';

      document.getElementById('qdone').onclick=function(){
        gb.classList.remove('on');
        G.mo('obedience',ob);G.mo('foot_need',ft);
        if(gl)G.toast('解锁CG：完美识图');
        rs();
      };
    }

    render_intro();
  });
}
