// yolidoli SO LP 試作 — ヘッダー切り替え / スクロール出現 / WhatsApp リンク
// 挙動は Kagu Rig LP（~/Developer/kagurig-lp/js/main.js）から ④⑤⑥ だけを移植

(() => {
  const WA_NUMBER = '819043072193'; // インドネシア向けの新番号（船曳さん 2026-10-15）
  const WA_TEXT = 'Halo, saya ingin mengetahui lebih lanjut tentang medical check-up di Jepang. [Ref: ID-MCU]';
  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_TEXT)}`;
  document.querySelectorAll('.js-wa').forEach((a) => {
    a.href = waHref;
    a.target = '_blank';
    a.rel = 'noopener';
  });

  const header = document.getElementById('header');
  const hero = document.querySelector('.hero');
  const sticky = document.querySelector('.sticky-wa');
  const viewH = () => document.documentElement.clientHeight || window.innerHeight;

  // 写真の上では透明ヘッダー＋白ロゴ、本文の白地に入ったら地色付き＋黒ロゴ
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-solid', y > viewH() * 0.85);
    hero.classList.toggle('is-passed', y > viewH() * 0.45);
    if (sticky) sticky.classList.toggle('is-on', y > viewH() * 0.9);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 画面に入ったセクションを下からふわっと出す
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-on');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-on'));
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ご利用の流れ: スクロールに合わせて縦の線が伸び、通過した段階の丸が緑になる
  const steps = document.getElementById('steps');
  if (steps) {
    const items = [...steps.querySelectorAll('li')];
    const update = () => {
      const r = steps.getBoundingClientRect();
      const mark = viewH() * 0.6;
      const p = reduce ? 1 : Math.min(1, Math.max(0, (mark - r.top) / r.height));
      steps.style.setProperty('--p', p.toFixed(3));
      items.forEach((li) => li.classList.toggle('is-done', reduce || li.getBoundingClientRect().top + 12 < mark));
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // よくある質問: 開閉で高さを滑らかに変える
  document.querySelectorAll('.faq details').forEach((d) => {
    const summary = d.querySelector('summary');
    const panel = d.querySelector('.faq__panel');
    summary.addEventListener('click', (e) => {
      if (reduce || !panel.animate) return;
      e.preventDefault();
      if (d.open) {
        const h = panel.offsetHeight;
        panel.animate([{ height: h + 'px' }, { height: '0px' }], { duration: 320, easing: 'cubic-bezier(.22,.61,.36,1)' })
          .onfinish = () => { d.open = false; };
      } else {
        d.open = true;
        const h = panel.offsetHeight;
        panel.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 360, easing: 'cubic-bezier(.22,.61,.36,1)' });
      }
    });
  });

  // ページ先頭へ戻る（Page top ボタンと左上のロゴ。ファーストビューは固定表示なので、アンカーではなくスクロールで戻す）
  document.querySelectorAll('.totop, .header__logo').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  });
})();
