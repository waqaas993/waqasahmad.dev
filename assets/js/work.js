(function(){
  function showHint(msg){
    var el=document.getElementById('work-hint');
    if(!el) return;
    el.textContent=msg;
    el.classList.remove('hidden');
  }
  function render(items){
    var list=document.getElementById('work-list');
    if(!list) return;
    list.innerHTML='';
    for(var i=0;i<items.length;i++){
      var it=items[i]||{};
      var a=document.createElement('a');
      a.href=(it.links&&it.links.page)||('/work/'+it.slug+'/');
      a.className='block rounded-lg border border-slate-200 p-4 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900';
      a.innerHTML='<div class="font-semibold">'+(it.title||it.slug||'')+'</div>'+
        '<div class="mt-1 text-sm text-slate-600 dark:text-slate-300">'+(it.summary||'')+'</div>';
      list.appendChild(a);
    }
  }
  function load(){
    fetch('/assets/data/work.json').then(function(r){
      if(!r.ok) throw new Error('bad');
      return r.json();
    }).then(function(items){
      if(!Array.isArray(items)) items=[];
      render(items);
    }).catch(function(){
      if(window.location && window.location.protocol==='file:'){
        showHint('Project list loads when served over HTTP. Run python3 -m http.server to preview locally.');
      }
    });
  }
  load();
})();
