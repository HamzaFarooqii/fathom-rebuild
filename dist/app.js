(() => {
  const { meetings } = window.REVERB_DATA;
  const state = {
    filter: "All", tab: "summary", template: "General", search: "", transcriptSearch: "",
    currentTime: 0, playing: false, follow: true, timer: null, askAnswer: null, mobileNav: false
  };
  const $ = (s, root = document) => root.querySelector(s);
  const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const time = sec => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2,"0")}`;
  const initials = name => name.split(" ").map(x=>x[0]).join("").slice(0,2);
  const avatar = (p, cls="sm") => `<span class="avatar ${cls}" style="--avatar:${p?.[2] || '#5966b5'}">${esc(p?.[1] || initials(p?.[0] || "Guest"))}</span>`;
  const meeting = id => meetings.find(m => m.id === id) || meetings[0];
  const route = () => (location.hash.slice(1) || "/").split("?")[0];
  const goto = path => { location.hash = path; };
  const completed = () => JSON.parse(localStorage.getItem("reverb-actions") || "{}");
  const saveCompleted = x => localStorage.setItem("reverb-actions", JSON.stringify(x));
  const customHighlights = () => JSON.parse(localStorage.getItem("reverb-highlights") || "{}");
  const saveCustomHighlights = x => localStorage.setItem("reverb-highlights", JSON.stringify(x));
  const allHighlights = m => [...m.highlights, ...(customHighlights()[m.id] || [])];
  const toast = msg => { const t=$("#toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2200); };
  const CAPTURE_MODES = {
    video: { label: "Audio & video", icon: "🎥", desc: "Full recording, speaker video tiles included." },
    audio: { label: "Audio only", icon: "🎙", desc: "Voice captured, no video stored." },
    transcript: { label: "Transcript only", icon: "📝", desc: "Bot-free — a clean transcript, summary, and action items. No audio or video is recorded at all." }
  };
  const captureMode = () => CAPTURE_MODES[localStorage.getItem("reverb-capture-mode")] ? localStorage.getItem("reverb-capture-mode") : "video";
  const saveCaptureMode = m => localStorage.setItem("reverb-capture-mode", m);

  function icon(name) {
    return ({meetings:"▦",highlights:"✦",search:"⌕",settings:"⚙",help:"?"})[name] || "•";
  }

  function render() {
    stopPlayback();
    const r = route();
    if (r === "/" || r === "/onboarding") return renderOnboarding();
    if (r.startsWith("/share/")) return renderShare(r.split("/")[2]);
    const meetingId = r.startsWith("/meeting/") ? r.split("/")[2] : null;
    const found = meetingId ? meetings.find(m => m.id === meetingId) : null;
    document.body.className = "app-body";
    $("#app").innerHTML = shell(r, found);
    if (r === "/meetings") renderMeetings();
    else if (r === "/highlights") renderHighlights();
    else if (meetingId && found) renderMeeting(found);
    else renderNotFound();
    wireShell();
  }

  function shell(r, current) {
    return `<div class="shell">
      <aside class="sidebar ${state.mobileNav?'open':''}" aria-label="Primary navigation">
        <a class="brand" href="#/meetings"><span class="brand-mark"><span></span></span>Reverb <small class="demo-pill">demo</small></a>
        <div class="nav-section">Workspace</div>
        ${nav("/meetings","meetings","Meetings",r)}
        ${nav("/highlights","highlights","Highlights",r)}
        <button class="nav-link js-search"><span class="nav-icon">${icon("search")}</span>Search & Ask</button>
        <div class="nav-section">Demo</div>
        <button class="nav-link" data-go="/meeting/q4-council"><span class="nav-icon">60</span>Long-call stress test</button>
        <div class="sidebar-bottom">
          <div class="capture-card"><strong>Capture is simulated</strong><p>The post-meeting workflow is fully interactive. Recording, OAuth, and transcription are intentionally stubbed.</p></div>
          <button class="nav-link" data-go="/onboarding"><span class="nav-icon">↺</span>Replay onboarding</button>
        </div>
      </aside>
      <div class="main-wrap">
        <header class="topbar">
          <button class="button icon mobile-menu js-menu" aria-label="Open navigation">☰</button>
          <button class="search-trigger js-search" aria-label="Open global search"><b>⌕</b><span>Search meetings, people, decisions…</span><kbd>⌘ K</kbd></button>
          ${current ? `<span class="badge ${current.duration>3000?'long':''}">${time(current.duration)} meeting</span>` : ''}
          <div class="top-actions"><button class="button icon" aria-label="Notifications">◌</button>${avatar(["Hamza Farooq","HF","#5b5df0"],"md")}</div>
        </header>
        <main id="main" class="content"></main>
      </div>
    </div>`;
  }

  function nav(path, ico, label, r) {
    return `<button class="nav-link ${r===path?'active':''}" data-go="${path}"><span class="nav-icon">${icon(ico)}</span>${label}</button>`;
  }

  function renderOnboarding() {
    document.body.className = "onboarding-body";
    $("#app").innerHTML = `<main class="onboarding">
      <section class="onboard-copy">
        <div class="brand"><span class="brand-mark"><span></span></span>Reverb <small class="demo-pill">product demo</small></div>
        <div class="onboard-kicker">Meeting intelligence, grounded</div>
        <h1>Every meeting becomes a decision you can verify.</h1>
        <p>Scan the outcome, jump to the exact moment, and turn conversation into accountable work. This rebuild focuses on the useful life of a meeting after the call ends.</p>
      </section>
      <section class="onboard-panel" aria-labelledby="onboard-title">
        <div class="eyebrow">Your demo workspace</div><h2 id="onboard-title">Three meetings. Zero setup.</h2>
        <p class="subhead">We preloaded a two-minute check-in, a customer review, and a dense eight-person product council.</p>
        <div class="steps">
          <div class="step"><span class="step-num">01</span><div><strong>Calendar connected</strong><br><small>Simulated — no account access requested</small></div><span>✓</span></div>
          <div class="step"><span class="step-num">02</span><div><strong>Meetings processed</strong><br><small>Seeded transcripts with realistic timing</small></div><span>✓</span></div>
          <div class="step"><span class="step-num">03</span><div><strong>Workspace ready</strong><br><small>Actions persist in this browser</small></div><span>✓</span></div>
          <div class="step"><span class="step-num">04</span><div><strong>Voice check</strong><br><small id="mic-status">Optional — like Fathom's own test call, confirms your mic actually works</small></div><button class="button small" id="mic-test-btn" type="button">Test call</button></div>
        </div>
        <div class="mic-meter" id="mic-meter" hidden aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
        <div class="capture-mode-picker">
          <div class="eyebrow" style="margin:0 0 8px">How should meetings be captured?</div>
          <div class="mode-row" id="mode-row" role="radiogroup" aria-label="Capture mode">${Object.entries(CAPTURE_MODES).map(([k,v])=>`<button type="button" class="mode-pill ${captureMode()===k?'active':''}" role="radio" aria-checked="${captureMode()===k}" data-mode="${k}">${v.icon} ${v.label}</button>`).join("")}</div>
          <p class="mode-desc" id="mode-desc">${CAPTURE_MODES[captureMode()].desc}</p>
        </div>
        <button class="button accent" id="enter-demo">Open the 60-minute meeting <span>→</span></button>
        <button class="button ghost" style="margin-top:9px" data-go="/meetings">Browse all meetings</button>
      </section>
    </main>`;
    $("#enter-demo").onclick = () => goto("/meeting/q4-council");
    wireMicTest();
    wireCaptureModePicker();
    $("[data-go]").onclick = e => goto(e.currentTarget.dataset.go);
  }

  function wireCaptureModePicker() {
    const row = $("#mode-row"), desc = $("#mode-desc");
    if (!row) return;
    row.querySelectorAll("[data-mode]").forEach(b => b.onclick = () => {
      saveCaptureMode(b.dataset.mode);
      row.querySelectorAll("[data-mode]").forEach(x => { x.classList.toggle("active", x === b); x.setAttribute("aria-checked", x === b); });
      desc.textContent = CAPTURE_MODES[b.dataset.mode].desc;
    });
  }

  function wireMicTest() {
    const btn = $("#mic-test-btn"), status = $("#mic-status"), meter = $("#mic-meter");
    if (!btn) return;
    btn.onclick = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        status.textContent = "Microphone access isn't available in this browser — this step is optional, continue whenever.";
        return;
      }
      btn.disabled = true; btn.textContent = "Listening…";
      status.textContent = "Say something — checking your mic…";
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        status.textContent = "Mic access wasn't granted — this step is optional, continue whenever.";
        btn.disabled = false; btn.textContent = "Try again";
        return;
      }
      meter.hidden = false;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const bars = meter.querySelectorAll("span");
      let heard = false, elapsed = 0;
      const stop = () => {
        stream.getTracks().forEach(t => t.stop());
        ctx.close();
        meter.hidden = true;
        btn.disabled = false;
        if (heard) { status.textContent = "✓ Voice detected — your mic works."; btn.textContent = "Test again"; }
        else { status.textContent = "Didn't catch any sound, but that's fine — continue anyway."; btn.textContent = "Try again"; }
      };
      const tick = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        const level = Math.min(1, avg / 60);
        bars.forEach((b, i) => { b.style.transform = `scaleY(${Math.max(0.15, level * (1 - i * 0.12))})`; });
        if (avg > 12) heard = true;
        elapsed += 100;
        if (elapsed < 4000) setTimeout(tick, 100); else stop();
      };
      tick();
    };
  }

  function renderMeetings() {
    const root = $("#main");
    const visible = meetings.filter(m => state.filter === "All" || m.type === state.filter);
    root.innerHTML = `<div class="page-head"><div><div class="eyebrow">Good morning, Hamza</div><h1>Your meetings, distilled.</h1><p class="subhead">Open an outcome, verify the evidence, and move the work forward.</p></div><button class="button primary" id="new-recording">● Record a meeting</button></div>
      <section class="stats" aria-label="Workspace metrics">
        ${stat("Meetings this week","12","+18%")}${stat("Time reviewed","3h 42m","−41%")}${stat("Open actions","13","5 due soon")}${stat("Shared moments","8","+3")}
      </section>
      <div class="filters" role="group" aria-label="Meeting filters">${["All","Product","Customer","Internal"].map(x=>`<button class="filter ${state.filter===x?'active':''}" data-filter="${x}">${x}</button>`).join("")}<span style="margin-left:auto" class="meta">3 of 12 meetings shown · seeded demo</span></div>
      <section class="meeting-list" aria-label="Meetings">${visible.length ? visible.map(meetingRow).join("") : `<div class="empty"><h2>No meetings here</h2><p>Choose another filter to return to the conversation.</p></div>`}</section>`;
    root.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{state.filter=b.dataset.filter;renderMeetings();});
    root.querySelectorAll("[data-meeting]").forEach(b=>b.onclick=()=>goto(`/meeting/${b.dataset.meeting}`));
    $("#new-recording").onclick=()=>toast("Recording is simulated in this product demo");
  }
  const stat = (label,value,trend) => `<div class="stat"><div class="stat-label">${label}</div><span class="stat-value">${value}</span><span class="stat-trend">${trend}</span></div>`;
  function meetingRow(m) {
    const d = new Date(m.date); const p=m.participants.slice(0,3).map(x=>avatar(x)).join("");
    return `<button class="meeting-row" data-meeting="${m.id}"><span class="date-block"><strong>${d.getDate()}</strong><span>${d.toLocaleString('en',{month:'short'})}</span></span><span><span class="meeting-title">${esc(m.title)}</span><span class="meta">${m.platform} · ${d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})} · ${m.actions.length} actions</span></span><span class="people">${p}<span class="people-count">${m.participants.length} people</span></span><span><span class="badge ${m.duration>3000?'long':''}">${m.duration>3000?'stress test':m.type}</span></span><span><span class="meta">${time(m.duration)}</span><span class="progress-mini"><span style="width:${m.duration>3000?72:48}%"></span></span></span><span>›</span></button>`;
  }

  function renderMeeting(m) {
    state.currentTime = 0; state.playing = false; state.askAnswer = null;
    const root=$("#main");
    root.innerHTML=`<button class="back-link" data-go="/meetings">← All meetings</button>
      <header class="meeting-head"><div><div class="eyebrow">${m.type} · ${new Date(m.date).toLocaleDateString('en',{month:'long',day:'numeric',year:'numeric'})}</div><h1>${esc(m.title)}</h1><div class="meta">${m.platform} · ${time(m.duration)} · ${m.participants.length} participants · processed in 46 sec</div></div><div style="display:flex;gap:8px"><button class="button" id="copy-link">↗ Share</button><button class="button primary js-search">⌕ Ask across calls</button></div></header>
      <div class="detail-grid"><div>${player(m)}<div class="topic-strip" aria-label="Meeting topics">${m.topics.map(t=>`<button class="topic-chip" data-seek="${t[0]}"><span>${time(t[0])}</span>${t[1]}</button>`).join("")}</div></div>
      <section class="panel intelligence"><div class="tabs" role="tablist">${[["summary","Summary"],["transcript","Transcript"],["actions",`Actions ${m.actions.length}`],["highlights",`Highlights ${allHighlights(m).length}`],["ask","Ask"]].map(([id,l])=>`<button role="tab" class="tab ${state.tab===id?'active':''}" data-tab="${id}">${l}</button>`).join("")}</div><div id="tab-content" class="panel-body"></div></section></div>`;
    renderTab(m);
    wireMeeting(m);
  }

  function player(m) {
    const mode = captureMode();
    const modeInfo = CAPTURE_MODES[mode];
    const label = mode === "transcript" ? `● Simulated · ${modeInfo.label} (bot-free)` : `● Simulated · ${modeInfo.label}`;
    const stageBody = mode === "transcript"
      ? `<div class="stage-transcript-only"><span class="stage-transcript-icon">📝</span><p>Transcript-only capture — no audio or video is recorded, just text, speaker labels, and timing.</p></div>`
      : `<div class="stage-grid">${m.participants.map((p,i)=>`<div class="participant-tile" data-speaker="${esc(p[0])}">${avatar(p,"md")}<span>${esc(p[0])}</span></div>`).join("")}</div>`;
    return `<section class="panel player" aria-label="Simulated meeting player"><div class="stage"><span class="simulated">${label}</span>${stageBody}</div><div class="player-controls"><div class="timeline" id="timeline" role="slider" aria-label="Meeting timeline" aria-valuemin="0" aria-valuemax="${m.duration}" tabindex="0"><div class="timeline-track"><div class="timeline-fill" id="timeline-fill"></div></div>${m.topics.slice(1).map(t=>`<span class="topic-mark" style="left:${t[0]/m.duration*100}%" title="${t[1]}"></span>`).join("")}${allHighlights(m).map(h=>`<button class="marker" style="left:${h[3]/m.duration*100}%" data-seek="${h[3]}" title="${esc(h[1])}"></button>`).join("")}</div><div class="control-row"><button id="play" class="play" aria-label="Play meeting">▶</button><span class="timecode"><b id="current-time">0:00</b> / ${time(m.duration)}</span><button class="button small" data-skip="-15">−15</button><button class="button small" data-skip="15">+15</button><span class="now-speaking" id="now-speaking">Ready to review</span></div></div></section>`;
  }

  function renderTab(m) {
    const root=$("#tab-content"); if(!root)return;
    if(state.tab==="summary") root.innerHTML=summaryHTML(m);
    if(state.tab==="transcript") root.innerHTML=transcriptHTML(m);
    if(state.tab==="actions") root.innerHTML=actionsHTML(m);
    if(state.tab==="highlights") root.innerHTML=highlightsHTML(m);
    if(state.tab==="ask") root.innerHTML=askHTML(m);
    wireTab(m);
  }

  function summaryHTML(m) {
    const variant = state.template;
    const intro = variant==="Executive" ? `A focused ${m.type.toLowerCase()} review produced ${m.decisions.length} decisions and ${m.actions.length} owned follow-ups. The main risk is execution sequencing, not alignment.` : variant==="Sales" ? `The conversation confirmed value, clarified blockers, and produced a concrete mutual action plan. ${m.summary}` : m.summary;
    return `<div class="summary-select"><span class="eyebrow" style="margin:0">AI summary</span><select id="template" aria-label="Summary template">${["General","Executive","Sales"].map(x=>`<option ${variant===x?'selected':''}>${x}</option>`).join("")}</select><button class="button small" id="copy-summary">Copy</button></div>
      <section class="summary-block"><h3>Overview <button class="citation" data-seek="0">0:00</button></h3><p>${esc(intro)}</p></section>
      <section class="summary-block"><h3>Decisions</h3><ul>${m.decisions.map(d=>`<li>${esc(d[0])} <button class="citation" data-seek="${d[1]}">${time(d[1])}</button></li>`).join("")}</ul></section>
      <section class="summary-block"><h3>What happens next</h3><ul>${m.actions.slice(0,4).map(a=>`<li><strong>${esc(a[2])}</strong> — ${esc(a[1])} <button class="citation" data-seek="${a[4]}">${time(a[4])}</button></li>`).join("")}</ul></section>`;
  }

  function transcriptHTML(m) {
    const q=state.transcriptSearch.toLowerCase();
    const segs=m.transcript.filter(s=>!q || `${s[2]} ${s[3]}`.toLowerCase().includes(q));
    return `<div class="transcript-tools"><input id="transcript-search" class="input" placeholder="Find in transcript…" value="${esc(state.transcriptSearch)}"><button class="button small" id="follow">${state.follow?'Following':'Resume'}</button></div><div class="transcript" id="transcript">${segs.length?segs.map((s,i)=>`<article class="segment" data-start="${s[0]}" id="seg-${s[0]}"><div><span class="speaker">${esc(s[2])}</span><span class="segment-time">${time(s[0])}</span></div><div class="segment-text">${highlight(s[3],q)}</div><button class="mark-highlight" type="button" data-highlight-seg="${s[0]}" data-highlight-end="${s[1]}" title="Highlight this moment">✦</button></article>`).join(""):`<div class="empty"><p>No transcript matches.</p></div>`}</div>`;
  }
  const highlight=(s,q)=>{ if(!q)return esc(s); const i=s.toLowerCase().indexOf(q); if(i<0)return esc(s); return `${esc(s.slice(0,i))}<mark>${esc(s.slice(i,i+q.length))}</mark>${esc(s.slice(i+q.length))}`; };

  function actionsHTML(m) {
    const done=completed();
    return `<div class="eyebrow">Accountable outcomes</div><p class="subhead">Completion state is saved in this browser.</p>${m.actions.map(a=>{const p=m.participants.find(x=>x[0]===a[2]);return `<label class="check-row ${done[a[0]]?'done':''}"><input type="checkbox" data-action="${a[0]}" ${done[a[0]]?'checked':''}><span><span class="check-title">${esc(a[1])}</span><span class="check-meta">Due ${a[3]} · source <button class="citation" type="button" data-seek="${a[4]}">${time(a[4])}</button></span></span><span class="owner">${avatar(p)}${esc(a[2].split(' ')[0])}</span></label>`;}).join("")}`;
  }
  function highlightsHTML(m) {
    const hs=allHighlights(m);
    return `<div class="eyebrow">Share the moment, not the hour</div><p class="subhead">Each clip preserves the transcript range and source timing. Add your own from the Transcript tab.</p>${hs.map(h=>{const mine=String(h[0]).startsWith("custom-");return `<article class="highlight-card"><div class="highlight-top"><span class="badge">${time(h[3])}–${time(h[4])}</span><span class="highlight-title">${esc(h[1])}</span>${mine?'<span class="badge">Yours</span>':''}</div><div class="highlight-quote">“${esc(h[2])}”</div><div class="highlight-actions"><button class="button small" data-seek="${h[3]}">▶ Play</button><button class="button small" data-share="${m.id}--${h[0]}">↗ Public clip</button>${mine?`<button class="button small ghost" data-remove-highlight="${h[0]}">Remove</button>`:''}</div></article>`;}).join("")}`;
  }
  function askHTML(m) {
    return `<div class="ask-hero"><h3>Ask this meeting</h3><p>Answers are deterministic for the demo and always point back to supporting moments.</p><form class="ask-form" id="ask-form"><input id="ask-input" class="input" aria-label="Question" placeholder="What did we decide about SSO?"><button class="button accent">Ask</button></form><div class="suggestions"><button class="suggestion">What were the key decisions?</button><button class="suggestion">Who owns the next steps?</button><button class="suggestion">What are the risks?</button></div></div>${state.askAnswer?`<div class="answer"><strong>${esc(state.askAnswer.title)}</strong><p>${state.askAnswer.text}</p></div>`:`<div class="empty" style="padding:36px 10px"><p>Ask a question to generate a grounded answer.</p></div>`}`;
  }

  function wireMeeting(m) {
    $("[data-go]").onclick=e=>goto(e.currentTarget.dataset.go);
    $("#play").onclick=()=>togglePlayback(m);
    $("#timeline").onclick=e=>{if(e.target.classList.contains("marker"))return;const r=e.currentTarget.getBoundingClientRect();seek(m,Math.max(0,Math.min(m.duration,(e.clientX-r.left)/r.width*m.duration)));};
    $("#timeline").onkeydown=e=>{if(["ArrowLeft","ArrowRight"].includes(e.key)){e.preventDefault();seek(m,state.currentTime+(e.key==="ArrowRight"?15:-15));}};
    document.querySelectorAll("[data-skip]").forEach(b=>b.onclick=()=>seek(m,state.currentTime+Number(b.dataset.skip)));
    document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab; document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));renderTab(m);});
    document.querySelectorAll("[data-seek]").forEach(b=>b.onclick=e=>{e.stopPropagation();seek(m,Number(b.dataset.seek));});
    $("#copy-link").onclick=()=>{navigator.clipboard?.writeText(location.href);toast("Meeting link copied");};
    document.querySelectorAll(".js-search").forEach(b=>b.onclick=openSearch);
  }
  function wireTab(m) {
    document.querySelectorAll("[data-seek]").forEach(b=>b.onclick=e=>{e.preventDefault();seek(m,Number(b.dataset.seek));});
    const t=$("#template"); if(t)t.onchange=()=>{state.template=t.value;renderTab(m);toast(`${state.template} summary applied`);};
    const c=$("#copy-summary"); if(c)c.onclick=()=>{navigator.clipboard?.writeText(m.summary);toast("Summary copied");};
    const ts=$("#transcript-search"); if(ts)ts.oninput=()=>{state.transcriptSearch=ts.value;renderTab(m);const next=$("#transcript-search");next.focus();next.setSelectionRange(next.value.length,next.value.length);};
    const follow=$("#follow"); if(follow)follow.onclick=()=>{state.follow=true;follow.textContent="Following";syncUI(m);};
    const tr=$("#transcript"); if(tr)tr.addEventListener("wheel",()=>{state.follow=false;const f=$("#follow");if(f)f.textContent="Resume";},{passive:true});
    document.querySelectorAll(".segment").forEach(s=>s.onclick=()=>seek(m,Number(s.dataset.start)));
    document.querySelectorAll("[data-highlight-seg]").forEach(b=>b.onclick=e=>{
      e.stopPropagation();
      const start=Number(b.dataset.highlightSeg), end=Number(b.dataset.highlightEnd);
      const seg=m.transcript.find(s=>s[0]===start);
      if(!seg||b.disabled)return;
      const store=customHighlights();
      const list=store[m.id]||[];
      const words=seg[3].split(" ").slice(0,7).join(" ");
      const title=words.length<seg[3].length?words+"…":words;
      list.push([`custom-${Date.now()}`,title,seg[3],start,end]);
      store[m.id]=list;
      saveCustomHighlights(store);
      toast("Highlight created — find it under Highlights");
      const hTab=document.querySelector('[data-tab="highlights"]'); if(hTab)hTab.textContent=`Highlights ${allHighlights(m).length}`;
      b.textContent="✓ Highlighted";
      b.disabled=true;
    });
    document.querySelectorAll("[data-remove-highlight]").forEach(b=>b.onclick=()=>{
      const store=customHighlights();
      store[m.id]=(store[m.id]||[]).filter(h=>String(h[0])!==b.dataset.removeHighlight);
      saveCustomHighlights(store);
      renderTab(m);
      toast("Highlight removed");
      const hTab=document.querySelector('[data-tab="highlights"]'); if(hTab)hTab.textContent=`Highlights ${allHighlights(m).length}`;
    });
    document.querySelectorAll("[data-action]").forEach(x=>x.onchange=()=>{const d=completed();d[x.dataset.action]=x.checked;saveCompleted(d);renderTab(m);toast(x.checked?"Action completed":"Action reopened");});
    document.querySelectorAll("[data-share]").forEach(x=>x.onclick=()=>goto(`/share/${x.dataset.share}`));
    const f=$("#ask-form"); if(f)f.onsubmit=e=>{e.preventDefault();answerAsk(m,$("#ask-input").value);};
    document.querySelectorAll(".suggestion").forEach(x=>x.onclick=()=>answerAsk(m,x.textContent));
  }

  function togglePlayback(m){state.playing=!state.playing;$("#play").textContent=state.playing?"Ⅱ":"▶";$("#play").setAttribute("aria-label",state.playing?"Pause meeting":"Play meeting");if(state.playing){state.timer=setInterval(()=>{seek(m,state.currentTime+1,false);if(state.currentTime>=m.duration)togglePlayback(m);},1000);}else stopPlayback();}
  function stopPlayback(){if(state.timer){clearInterval(state.timer);state.timer=null;}state.playing=false;}
  function seek(m,s,force=true){state.currentTime=Math.max(0,Math.min(m.duration,s));if(force)state.follow=true;syncUI(m);}
  function syncUI(m){const pct=state.currentTime/m.duration*100;const fill=$("#timeline-fill");if(fill)fill.style.width=`${pct}%`;const ct=$("#current-time");if(ct)ct.textContent=time(state.currentTime);const seg=[...m.transcript].reverse().find(s=>s[0]<=state.currentTime)||m.transcript[0];const ns=$("#now-speaking");if(ns)ns.textContent=`${seg[2]} speaking`;document.querySelectorAll(".participant-tile").forEach(x=>x.classList.toggle("speaking",x.dataset.speaker===seg[2]));document.querySelectorAll(".segment").forEach(x=>x.classList.toggle("active",Number(x.dataset.start)===seg[0]));if(state.tab==="transcript"&&state.follow){const active=$(`#seg-${seg[0]}`);active?.scrollIntoView({block:"center",behavior:"smooth"});}}
  function answerAsk(m,q){const l=q.toLowerCase();let title="Answer grounded in this meeting";let text;if(l.includes("owner")||l.includes("next"))text=`${m.actions.slice(0,3).map(a=>`<strong>${esc(a[2])}</strong> owns ${esc(a[1].toLowerCase())} <button class="citation" data-seek="${a[4]}">${time(a[4])}</button>`).join("; ")}.`;else if(l.includes("risk"))text=`The main risk is sequencing commitments before their controls are ready. The team limited scope to preserve a defensible launch <button class="citation" data-seek="${m.decisions[0][1]}">${time(m.decisions[0][1])}</button>.`;else text=`The team made ${m.decisions.length} decisions: ${m.decisions.slice(0,3).map(d=>`${esc(d[0])} <button class="citation" data-seek="${d[1]}">${time(d[1])}</button>`).join(" ")}`;state.askAnswer={title,text};renderTab(m);}

  function renderHighlights(){const all=meetings.flatMap(m=>allHighlights(m).map(h=>({m,h})));$("#main").innerHTML=`<div class="page-head"><div><div class="eyebrow">Clip library</div><h1>Moments worth replaying.</h1><p class="subhead">Evidence, customer language, and decisions—without asking someone to watch the whole call.</p></div><button class="button primary js-search">⌕ Find a moment</button></div><section class="library-grid">${all.map(({m,h})=>`<article class="panel clip-card"><div class="clip-visual"><span class="clip-wave">▂▆▃▇▅▂▆▃</span><span class="simulated">${time(h[3])}–${time(h[4])}</span></div><div class="panel-body"><div class="eyebrow">${esc(m.title)}</div><h3>${esc(h[1])}</h3><p>“${esc(h[2])}”</p><button class="button small" data-share="${m.id}--${h[0]}">Open public clip →</button></div></article>`).join("")}</section>`;document.querySelectorAll("[data-share]").forEach(x=>x.onclick=()=>goto(`/share/${x.dataset.share}`));document.querySelectorAll(".js-search").forEach(x=>x.onclick=openSearch);}

  function renderShare(token){const [mid,hid]=token.split("--");const m=meeting(mid);const h=allHighlights(m).find(x=>String(x[0])===hid)||m.highlights[0];document.body.className="share-body";$("#app").innerHTML=`<main class="share-page"><div class="share-shell"><a href="#/meetings" class="share-brand"><span class="brand-mark"><span></span></span>Reverb</a><article class="share-card"><div class="share-video"><div><div class="eyebrow" style="color:#70d7df">Shared moment · ${time(h[3])}–${time(h[4])}</div><blockquote>“${esc(h[2])}”</blockquote><button class="button" style="margin-top:25px" id="clip-play">▶ Play ${time(h[4]-h[3])} clip</button></div></div><div class="share-info"><div class="eyebrow">${m.type} meeting</div><h1>${esc(h[1])}</h1><p class="subhead">From <strong>${esc(m.title)}</strong> · ${new Date(m.date).toLocaleDateString('en',{month:'long',day:'numeric',year:'numeric'})}</p><div class="meta">Shared by Hamza Farooq · No Reverb account required</div></div></article><p class="share-note">This is a seeded product demo. No private meeting content is used.</p></div></main>`;$("#clip-play").onclick=e=>{e.currentTarget.textContent=e.currentTarget.textContent.startsWith("▶")?"Ⅱ Pause clip":`▶ Play ${time(h[4]-h[3])} clip`;};}

  function globalAskAnswer(q){
    const l=q.toLowerCase();
    const allActions=meetings.flatMap(m=>m.actions.map(a=>({m,title:a[1],owner:a[2],at:a[4]})));
    const allDecisions=meetings.flatMap(m=>m.decisions.map(d=>({m,text:d[0],at:d[1]})));
    const cite=(m,at)=>`<button class="citation" data-goto="${m.id}" data-seek="${at}">${esc(m.title)} · ${time(at)}</button>`;
    let text;
    if(/owner|who owns|assign/.test(l)) text=allActions.slice(0,4).map(a=>`<strong>${esc(a.owner)}</strong> owns ${esc(a.title.toLowerCase())} ${cite(a.m,a.at)}`).join("; ")+".";
    else if(/action|next|follow.?up|to.?do/.test(l)) text=allActions.slice(0,4).map(a=>`${esc(a.title)} — <strong>${esc(a.owner)}</strong> ${cite(a.m,a.at)}`).join("; ")+".";
    else {
      const stop=["what","were","which","meetings","meeting","about","there","decide","decided","decision","decisions"];
      const keyword=l.replace(/[^a-z0-9 ]/g," ").split(" ").filter(w=>w.length>3&&!stop.includes(w))[0];
      const matched=keyword?allDecisions.filter(d=>d.text.toLowerCase().includes(keyword)):[];
      text=(matched.length?matched:allDecisions).slice(0,3).map(d=>`${esc(d.text)} ${cite(d.m,d.at)}`).join(" ");
    }
    return {title:`Across ${meetings.length} meetings`,text};
  }
  function openSearch(){if($(".modal-backdrop"))return;const wrap=document.createElement("div");wrap.className="modal-backdrop";wrap.innerHTML=`<section class="modal" role="dialog" aria-modal="true" aria-labelledby="search-title"><div class="modal-head"><b>⌕</b><input id="global-query" class="input" placeholder="Search, or ask a question across meetings…" aria-label="Global search or ask"><button class="button icon" id="close-search" aria-label="Close">×</button></div><div class="modal-body" id="results"><div class="empty"><div class="eyebrow">Try a search or a question</div><p>SSO, Acme, residency, Priya, audit — or "What did we decide about SSO?"</p></div></div></section>`;document.body.appendChild(wrap);const input=$("#global-query");input.focus();input.oninput=()=>renderSearchResults(input.value);$("#close-search").onclick=()=>wrap.remove();wrap.onclick=e=>{if(e.target===wrap)wrap.remove();};}
  function renderSearchResults(q){const out=$("#results");if(!q.trim()){out.innerHTML=`<div class="empty"><p>Search across all meeting evidence, or ask a question.</p></div>`;return;}const l=q.toLowerCase();const isQuestion=/\?|^\s*(what|who|which|when|how|why|does|is|are|can|did)\b/.test(l);const results=[];meetings.forEach(m=>{if(`${m.title} ${m.summary} ${m.participants.map(p=>p[0]).join(' ')}`.toLowerCase().includes(l))results.push({m,t:"Meeting",title:m.title,text:m.summary,at:0});m.transcript.filter(s=>`${s[2]} ${s[3]}`.toLowerCase().includes(l)).slice(0,3).forEach(s=>results.push({m,t:"Transcript",title:`${s[2]} at ${time(s[0])}`,text:s[3],at:s[0]}));m.actions.filter(a=>`${a[1]} ${a[2]}`.toLowerCase().includes(l)).forEach(a=>results.push({m,t:"Action",title:a[1],text:`Owner: ${a[2]} · Due ${a[3]}`,at:a[4]}));});const ask=isQuestion?globalAskAnswer(q):null;const askHTML=ask?`<div class="answer ask-global"><strong>✦ ${esc(ask.title)}</strong><p>${ask.text}</p></div>`:"";const listHTML=results.length?`<div class="result-group"><div class="result-label">${results.length} grounded results</div>${results.slice(0,12).map((r,i)=>`<button class="result" data-result="${r.m.id}" data-at="${r.at}"><span><strong>${esc(r.title)}</strong><p>${esc(r.text)}</p></span><span class="badge">${r.t}</span></button>`).join("")}</div>`:(ask?"":`<div class="empty"><h2>No matches</h2><p>Try a person, topic, or decision.</p></div>`);out.innerHTML=askHTML+listHTML;out.querySelectorAll("[data-result]").forEach(x=>x.onclick=()=>{state.currentTime=Number(x.dataset.at);document.querySelector(".modal-backdrop")?.remove();goto(`/meeting/${x.dataset.result}`);setTimeout(()=>{state.tab="transcript";renderMeeting(meeting(x.dataset.result));seek(meeting(x.dataset.result),Number(x.dataset.at));},30);});out.querySelectorAll("[data-goto]").forEach(x=>x.onclick=()=>{const id=x.dataset.goto,at=Number(x.dataset.seek);document.querySelector(".modal-backdrop")?.remove();goto(`/meeting/${id}`);setTimeout(()=>{state.tab="transcript";renderMeeting(meeting(id));seek(meeting(id),at);},30);});}

  function renderNotFound(){$("#main").innerHTML=`<div class="empty"><div class="eyebrow">404</div><h1>That moment is missing.</h1><p>The link may be incomplete.</p><button class="button primary" data-go="/meetings">Return to meetings</button></div>`;$("[data-go]").onclick=e=>goto(e.currentTarget.dataset.go);}
  function wireShell(){document.querySelectorAll("[data-go]").forEach(x=>x.onclick=()=>goto(x.dataset.go));document.querySelectorAll(".js-search").forEach(x=>x.onclick=openSearch);const mm=$(".js-menu");if(mm)mm.onclick=()=>{$(".sidebar").classList.toggle("open");};}

  window.addEventListener("hashchange",render);
  window.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openSearch();}if(e.key==="Escape")document.querySelector(".modal-backdrop")?.remove();if(e.code==="Space"&&route().startsWith("/meeting/")&&!/INPUT|TEXTAREA|BUTTON/.test(document.activeElement.tagName)){e.preventDefault();togglePlayback(meeting(route().split('/')[2]));}});
  render();
})();
