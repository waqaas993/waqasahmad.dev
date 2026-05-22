(function(){
  var isFile=false;
  try{isFile=window.location && window.location.protocol==='file:';}catch(e){}

  function showHint(msg){
    // Under file://, placeholders are the canonical experience — no warnings.
    if(isFile) return;
    var el=document.getElementById('work-hint');
    if(!el) return;
    el.textContent=msg;
    el.classList.remove('hidden');
  }

  function escapeHtml(value){
    var s = String(value == null ? '' : value);
    return s.replace(/[&<>"']/g, function(ch){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch];
    });
  }

  function firstTruthy(obj, keys){
    for(var i=0;i<keys.length;i++){
      var k = keys[i];
      if(obj && obj[k]) return obj[k];
    }
    return '';
  }

  function normalizeTags(it){
    var tags = [];
    if(Array.isArray(it.tags)) tags = it.tags;
    else if(Array.isArray(it.tech)) tags = it.tech;
    else if(Array.isArray(it.labels)) tags = it.labels;

    // normalize to strings + limit
    var out = [];
    for(var i=0;i<tags.length && out.length<4;i++){
      if(tags[i] == null) continue;
      var t = String(tags[i]).trim();
      if(t) out.push(t);
    }
    return out;
  }

  // Seed data (static-first): used for file:// and as initial render on hosted.
  // Keep in sync with /assets/data/work.json.
  var seedItems = [
  {
    "slug": "pack-match-3d",
    "title": "Pack & Match 3D",
    "summary": "Shipped 3D puzzle title; owned live ops, monetization, experimentation, and scalable product systems supporting post-launch growth.",
    "thumbnail": "/images/work/pack-match-3d/thumb.webp",
    "thumbnail_alt": "Pack & Match 3D thumbnail",
    "tags": [
      "Unity",
      "Mobile",
      "Live Ops",
      "Monetization",
      "Product Systems"
    ],
    "links": {
      "page": "/work/pack-match-3d/",
      "app_store": "https://apps.apple.com/us/app/pack-match-3d/id6450538264"
    }
  },
  {
    "slug": "linea-innerlight",
    "title": "Linea: an innerlight game",
    "summary": "Puzzle adventure game; built Unity tooling, gameplay systems, and delivery workflows that improved iteration speed and long-term maintainability.",
    "thumbnail": "/images/work/linea-innerlight/thumb.webp",
    "thumbnail_alt": "Linea: an innerlight game thumbnail",
    "tags": [
      "Unity",
      "Mobile",
      "Tooling",
      "Delivery",
      "Puzzle"
    ],
    "links": {
      "page": "/work/linea-innerlight/",
      "app_store": "https://apps.apple.com/jo/app/linea-an-innerlight-game/id1640475275"
    }
  },
  {
    "slug": "color-gradient-jigsaw-puzzle",
    "title": "Color Gradient Jigsaw Puzzle",
    "summary": "Color-based jigsaw puzzle; implemented core systems and retention loops including daily rewards, streaks, and progression mechanics.",
    "thumbnail": "/images/work/color-gradient-jigsaw-puzzle/thumb.webp",
    "thumbnail_alt": "Color Gradient Jigsaw Puzzle thumbnail",
    "tags": [
      "Unity",
      "Mobile",
      "Puzzle",
      "Retention",
      "Progression"
    ],
    "links": {
      "page": "/work/color-gradient-jigsaw-puzzle/"
    }
  },
  {
    "slug": "color-puzzle-game-hue-match",
    "title": "Color Puzzle Game – Hue Match",
    "summary": "Hue-matching puzzle; added leaderboards, progression systems, and mobile performance improvements while keeping the user experience stable.",
    "thumbnail": "/images/work/color-puzzle-game-hue-match/thumb.webp",
    "thumbnail_alt": "Color Puzzle Game – Hue Match thumbnail",
    "tags": [
      "Unity",
      "Mobile",
      "Product Systems",
      "Progression",
      "Performance"
    ],
    "links": {
      "page": "/work/color-puzzle-game-hue-match/"
    }
  },
  {
    "slug": "energy-anti-stress-loops",
    "title": "Energy: Anti-Stress Loops",
    "summary": "Wear OS port; adapted interaction, UI, and performance systems for small-screen wearable constraints.",
    "thumbnail": "/images/work/energy-anti-stress-loops/thumb.webp",
    "thumbnail_alt": "Energy: Anti-Stress Loops thumbnail",
    "tags": [
      "Unity",
      "Wear OS",
      "Mobile",
      "Performance",
      "UI"
    ],
    "links": {
      "page": "/work/energy-anti-stress-loops/"
    }
  },
  {
    "slug": "luna-playable-ads",
    "title": "Luna Playable Ads",
    "summary": "Playable ad campaigns; built lightweight interactive prototypes optimized for fast loading, strict size limits, and user-acquisition testing.",
    "thumbnail": "/images/work/luna-playable-ads/thumb.svg",
    "thumbnail_alt": "Luna Playable Ads thumbnail",
    "tags": [
      "Playable Ads",
      "UA",
      "Optimization",
      "Unity",
      "HTML5"
    ],
    "links": {
      "page": "/work/luna-playable-ads/"
    }
  }
];

  function siteBasePath(){
    // Hosted base path (supports GitHub Pages subpaths)
    try{
      var p = window.location && window.location.pathname ? String(window.location.pathname) : '/';
      if(p.endsWith('/')) p = p.slice(0, -1);
      if(p.endsWith('/index.html')) p = p.slice(0, -'/index.html'.length);
      if(p.endsWith('/work')) p = p.slice(0, -'/work'.length);
      if(p.endsWith('/work/index.html')) p = p.slice(0, -'/work/index.html'.length);
      if(!p.endsWith('/')) p += '/';
      return p;
    }catch(e){
      return '/';
    }
  }

  function fileRepoRootUrl(){
    // Compute a stable "repo root" directory URL under file://.
    // - file:///.../index.html -> file:///.../
    // - file:///.../work/index.html -> file:///.../
    // - file:///.../work/<slug>/index.html -> file:///.../
    try{
      var p = window.location && window.location.pathname ? String(window.location.pathname) : '';
      if(p.endsWith('/index.html')) p = p.slice(0, -'/index.html'.length);

      var i = p.lastIndexOf('/work');
      if(i !== -1){
        var after = p.slice(i);
        if(after === '/work' || after.indexOf('/work/') === 0){
          p = p.slice(0, i);
        }
      }

      if(!p.endsWith('/')) p += '/';
      return new URL(p, window.location.href).toString();
    }catch(e){
      return window.location && window.location.href ? window.location.href : '';
    }
  }

  function resolveFileHref(href){
    href = String(href || '');
    if(!href) return '';
    if(href.charAt(0) === '#') return href;
    if(/^https?:\/\//.test(href)) return href;

    // Treat leading-slash URLs as repo-root relative under file://
    if(href.charAt(0) === '/'){
      var rel = href.replace(/^\/+/, '');
      try{ return new URL(rel, fileRepoRootUrl()).toString(); }catch(e){ return rel; }
    }

    try{ return new URL(href, window.location.href).toString(); }catch(e){ return href; }
  }

  function resolveHostedHref(pageHref){
    pageHref = String(pageHref || '');
    if(!pageHref) return '';
    if(pageHref.charAt(0)==='#') return pageHref;
    if(/^https?:\/\//.test(pageHref)) return pageHref;

    // Treat leading-slash URLs as site-root (not domain-root) to support subpath hosting.
    if(pageHref.charAt(0)==='/'){
      return siteBasePath() + pageHref.slice(1);
    }

    try{
      return new URL(pageHref, window.location.href).toString();
    }catch(e){
      return pageHref;
    }
  }

  function resolveAssetHref(href){
    // For assets like thumbnails: support leading "/" paths on both hosted and file://.
    href = String(href || '');
    if(!href) return '';
    return isFile ? resolveFileHref(href) : resolveHostedHref(href);
  }

  function externalLink(it){
    if(!it || !it.links) return '';
    // Prefer real outbound links in file:// mode.
    return firstTruthy(it.links, ['app_store','google_play','itch','steam','external','url']);
  }

  function cardHtml(it){
    it = it || {};

    var title = escapeHtml(it.title || it.name || it.slug || 'Untitled');
    var summary = escapeHtml(it.summary || it.description || it.blurb || '');
    var slug = it.slug ? String(it.slug) : '';

    // Dual-mode linking (file:// + hosted):
    // - file:// links to the local case study page
    // - hosted uses links.page (if provided), resolved for subpath hosting
    var href = '';

    if(isFile){
      // file:// links should work from both:
      // - /index.html (featured section)
      // - /work/index.html (grid)
      var onWorkPage = false;
      try{ onWorkPage = /\/work\//.test(String(window.location && window.location.pathname || '')); }catch(e){}
      var base = onWorkPage ? './' : './work/';
      href = slug ? (base + slug + '/index.html') : '#contact';
    } else {
      if(it.links && it.links.page){
        href = resolveHostedHref(it.links.page);
      } else if(slug){
        href = resolveHostedHref('work/' + slug + '/');
      } else {
        href = resolveHostedHref('work/');
      }
    }

    // Hash links are safe in both modes.
    if(it.links && it.links.page && String(it.links.page).charAt(0)==='#'){
      href = String(it.links.page);
    }

    var isExternal = /^https?:\/\//.test(href);
    var linkAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';

    var tags = normalizeTags(it);
    var tagHtml = '';
    if(tags.length){
      tagHtml = '<div class="mt-4 flex flex-wrap gap-2">' +
        tags.map(function(t){
          return '<span class="rounded-full border border-slate-200 bg-white/60 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">' + escapeHtml(t) + '</span>';
        }).join('') +
        '</div>';
    }

    var image = firstTruthy(it, ['thumbnail','image','cover','hero']);
    var media = '';

    if(image){
      var alt = escapeHtml(it.thumbnail_alt || it.imageAlt || it.title || it.slug || 'Project thumbnail');
      var src = resolveAssetHref(image);
      media = '' +
        '<div class="aspect-[16/9] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">' +
          '<img src="' + escapeHtml(src) + '" alt="' + alt + '" loading="lazy" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"/>' +
        '</div>';
    } else {
      // tasteful placeholder (no loud gradient)
      media = '' +
        '<div class="aspect-[16/9] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">' +
          '<div class="h-full w-full opacity-80" style="background-image:linear-gradient(to right, rgba(34,211,238,.15), transparent 40%), linear-gradient(to bottom, rgba(34,211,238,.12), transparent 55%);"></div>' +
        '</div>';
    }

    var highlight='';
    if(Array.isArray(it.metrics) && it.metrics.length){
      highlight = escapeHtml(it.metrics[0]);
    }

    var stamp = escapeHtml(it.year || it.date || '');
    var stampHtml = stamp ? (
      '<div class="shrink-0 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">' + stamp + '</div>'
    ) : '';

    return '' +
      '<a href="' + escapeHtml(href) + '"' + linkAttrs + ' class="work-card group rounded-xl border border-slate-200 bg-white/60 p-4 shadow-sm transition-transform transition-shadow transition-colors duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md hover:ring-1 hover:ring-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:bg-slate-950 dark:hover:ring-accent/40 dark:focus-visible:ring-offset-slate-950 opacity-0">' +
        media +
        '<div class="mt-4">' +
          '<div class="flex items-start justify-between gap-3">' +
            '<div class="min-w-0">' +
              '<div class="truncate text-base font-semibold tracking-tight">' + title + '</div>' +
              (summary ? '<div class="mt-1 text-sm text-slate-600 dark:text-slate-300">' + summary + '</div>' : '') +
              (highlight ? '<div class="mt-2 text-xs text-slate-500 dark:text-slate-400">' + highlight + '</div>' : '') +
            '</div>' +
            stampHtml +
          '</div>' +
          tagHtml +
        '</div>' +
      '</a>';
  }

  function fadeInCards(list){
    // Staggered opacity reveal (fast, lightweight)
    var cards = list.querySelectorAll('.work-card');
    if(!cards.length) return;

    requestAnimationFrame(function(){
      for(var i=0;i<cards.length;i++){
        cards[i].style.transition = 'opacity 420ms ease-out, transform 200ms ease-out, box-shadow 200ms ease-out, border-color 200ms ease-out';
        cards[i].style.transitionDelay = (i * 35) + 'ms';
        cards[i].classList.remove('opacity-0');
      }
    });
  }

  function placeholderItems(){
    return seedItems.slice();
  }

  function renderInto(list, items, opts){
    if(!list) return;
    opts = opts || {};

    var isPlaceholder = false;
    if(!items || !items.length){
      isPlaceholder = true;
      items = placeholderItems();
    }

    if(opts.limit && items.length > opts.limit){
      items = items.slice(0, opts.limit);
    }

    // Hide hint for real data renders (work page only)
    if(opts.hideHintOnReal && !isPlaceholder){
      var hint=document.getElementById('work-hint');
      if(hint) hint.classList.add('hidden');
    }

    list.innerHTML = items.map(cardHtml).join('');
    fadeInCards(list);
  }

  function render(items){
    // /work/ listing (show all)
    renderInto(document.getElementById('work-list'), items, { hideHintOnReal: true });

    // Home featured section (show top 5)
    renderInto(document.getElementById('featured-list'), items, { limit: 5 });
  }

  function load(){
    // Static-first: always render seed content immediately.
    render(seedItems);

    // Avoid CORS/blocked fetch noise under file://.
    if(isFile){
      return;
    }

    // Fetch canonical work data (works from both / and /work/, including subpath deployments)
    var url = resolveHostedHref('/assets/data/work.json');

    fetch(url).then(function(r){
      if(!r.ok) throw new Error('bad');
      return r.json();
    }).then(function(items){
      if(!Array.isArray(items) || !items.length) return;
      render(items);
    }).catch(function(){
      // Progressive enhancement: keep seed cards.
    });
  }

  load();
})();
