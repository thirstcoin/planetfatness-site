/* =========================================================
   Planet Fatness UI Kit JS (shared behaviors)
   - toast
   - share (Web Share -> clipboard fallback)
   - back-to-gym + leaderboard routing
   - Telegram detect helpers
   ========================================================= */

(function(){
  function qs(sel){ return document.querySelector(sel); }

  function toast(msg){
    const el = qs('#toast') || qs('.pf-toast');
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
    clearTimeout(window.__pfToastT);
    window.__pfToastT = setTimeout(()=> el.style.display = 'none', 2400);
  }

  function isTelegram(){
    return !!(window.Telegram && window.Telegram.WebApp);
  }

  async function shareText(text, url){
    const shareUrl = url || window.location.href;
    try{
      if (navigator.share){
        await navigator.share({ text, url: shareUrl });
        return true;
      }
    }catch{}
    try{
      await navigator.clipboard.writeText((text ? text + "\n" : "") + shareUrl);
      toast("Copied share link ✅");
      return true;
    }catch{
      // final fallback
      const ta = document.createElement('textarea');
      ta.value = (text ? text + "\n" : "") + shareUrl;
      document.body.appendChild(ta);
      ta.select();
      try{ document.execCommand('copy'); toast("Copied share link ✅"); }
      catch{ toast("Couldn’t copy share link"); }
      document.body.removeChild(ta);
      return false;
    }
  }

  // data attributes:
  // - data-pf-back: go back to hub gym section
  // - data-pf-lb: go to leaderboard section
  // - data-pf-share: share with optional data-share-text attr
  function wire(){
    const back = document.querySelector('[data-pf-back]');
    if (back){
      back.addEventListener('click', ()=> {
        window.location.href = '../index.html#gym';
      });
    }

    const lb = document.querySelector('[data-pf-lb]');
    if (lb){
      lb.addEventListener('click', ()=> {
        window.location.href = '../index.html#leaderboard';
      });
    }

    const shareBtn = document.querySelector('[data-pf-share]');
    if (shareBtn){
      shareBtn.addEventListener('click', async ()=> {
        const txt = shareBtn.getAttribute('data-share-text') || "Planet Fatness Gym 🪐🏋️‍♂️ Tap counts as cardio.";
        await shareText(txt);
      });
    }
  }

  window.PF_UI = { toast, shareText, isTelegram };
  document.addEventListener('DOMContentLoaded', wire);
})();