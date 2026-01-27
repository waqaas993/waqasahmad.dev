(function(){
  function showHint(msg){
    var el=document.getElementById('work-hint');
    if(!el) return;
    el.textContent=msg;
    el.classList.remove('hidden');
  }

  function isFile(){
    return !!(window.location && window.location.protocol==='file:');
  }

  function hrefForItem(it){
    it = it || {};

    // When opened directly from disk, avoid leading slashes which point to filesystem root.
    if(isFile()){
      if(it.slug) return it.slug + '/index.html';
      return '';
    }

    // When served, allow absolute site paths.
    return (it.links && it.links.page) || ('/work/' + (it.slug || '') + '/');
  }

  function render(items){
    var list=document.getElementById('work-list');
    if(!list) return;
    list.innerHTML='';
    for(var i=0;i<items.length;i++){
      var it=items[i]||{};
      var a=document.createElement('a');
      a.href=hrefForItem(it);
      a.className='block rounded-lg border border-slate-200 p-4 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900';
      a.innerHTML='<div class="font-semibold">'+(it.title||it.slug||'')+'</div>'+
        '<div class="mt-1 text-sm text-slate-600 dark:text-slate-300">'+(it.summary||'')+'</div>';
      list.appendChild(a);
    }
  }

  function load(){
    // Prefer embedded JSON for file:// (and it also works when served).
    var embedded=document.getElementById('work-data');
    if(embedded && embedded.textContent){
      try{
        var items=JSON.parse(embedded.textContent);
        if(!Array.isArray(items)) items=[];
        render(items);
        return;
      }catch(e){
        // fall through
      }
    }

    var dataUrl = isFile()
      ? new URL('../assets/data/work.json', window.location.href).toString()
      : '/assets/data/work.json';

    fetch(dataUrl).then(function(r){
      if(!r.ok) throw new Error('bad');
      return r.json();
    }).then(function(items){
      if(!Array.isArray(items)) items=[];
      render(items);
    }).catch(function(){
      showHint('Unable to load work list.');
    });
  }

  load();
})();
