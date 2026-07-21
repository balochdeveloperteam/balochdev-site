import { useEffect, useRef } from 'react';

/**
 * Hero mesh grid — same visual language as NerdHeadz:
 * fine / mid / major lines + crosshair ticks + soft accent blooms.
 * Uses our --ndx-accent; content/layout stay ours.
 */

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

function parseAccent(raw) {
  const m = HEX.exec((raw || '').trim());
  if (!m) return null;
  const h = m[1];
  if (h.length === 3) {
    return [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)];
  }
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function readAccent(el) {
  const fromEl = getComputedStyle(el).getPropertyValue('--ndx-accent');
  const fromRoot = getComputedStyle(document.documentElement).getPropertyValue('--ndx-accent');
  return parseAccent(fromEl || fromRoot);
}

function themeName() {
  return document.documentElement.dataset.theme || 'dark';
}

/** Soft bloom tints — mix accent + cool wash so glows stay visible. */
function atmospherePalette(theme, accent) {
  const [ar, ag, ab] = accent || [45, 212, 191];
  if (theme === 'light') {
    return [
      [ar, ag, ab],
      [255, 138, 110],
      [107, 127, 215],
    ];
  }
  if (theme === 'dusk') {
    return [
      [ar, ag, ab],
      [255, 138, 110],
      [155, 143, 217],
    ];
  }
  return [
    [ar, ag, ab],
    [245, 158, 11],
    [Math.min(255, ar + 40), Math.min(255, ag + 30), Math.min(255, ab + 20)],
  ];
}

const MARK_TYPES = ['bracket', 'circle', 'cross', 'corner', 'diag'];

function drawMark(ctx, mark, now, alpha, rgba) {
  const grow = Math.min(1, (now - mark.t0) / 0.55);
  ctx.strokeStyle = rgba(alpha);
  ctx.fillStyle = rgba(alpha);
  ctx.lineWidth = 1;
  const { x, y, type, orient } = mark;

  if (type === 'bracket') {
    const e = 14 * grow;
    const sx = orient < 2 ? 1 : -1;
    const sy = orient % 2 === 0 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + sx * e, y);
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + sy * e);
    ctx.stroke();
  } else if (type === 'circle') {
    ctx.beginPath();
    ctx.arc(x, y, 7 * grow, 0, Math.PI * 2);
    ctx.stroke();
    if (grow > 0.5) {
      ctx.strokeStyle = rgba((grow - 0.5) * 2 * alpha);
      ctx.beginPath();
      ctx.moveTo(x - 11, y);
      ctx.lineTo(x + 11, y);
      ctx.moveTo(x, y - 11);
      ctx.lineTo(x, y + 11);
      ctx.stroke();
    }
  } else if (type === 'cross') {
    const e = 10 * grow;
    ctx.beginPath();
    ctx.moveTo(x - e, y);
    ctx.lineTo(x + e, y);
    ctx.moveTo(x, y - e);
    ctx.lineTo(x, y + e);
    ctx.stroke();
  } else if (type === 'corner') {
    const e = 8 * grow;
    const sx = orient < 2 ? 1 : -1;
    const sy = orient % 2 === 0 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(x + sx * e, y);
    ctx.lineTo(x + sx * e, y + sy * e);
    ctx.lineTo(x, y + sy * e);
    ctx.stroke();
  } else if (type === 'diag') {
    const e = 64 * grow;
    const sx = orient < 2 ? 1 : -1;
    const sy = orient % 2 === 0 ? 1 : -1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + sx * e, y + sy * e);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

export default function HeroGraphBackground({ className = '', reducedMotion = false }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const preferReduce =
      reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const size = { w: 0, h: 0, dpr: 1 };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.w = rect.width;
      size.h = rect.height;
      size.dpr = dpr;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const blooms = Array.from({ length: 3 }, (_, i) => ({
      cx: 0.25 + 0.5 * Math.random(),
      cy: 0.25 + 0.5 * Math.random(),
      ox: 0.16 + 0.18 * Math.random(),
      oy: 0.14 + 0.16 * Math.random(),
      sx: 0.055 + 0.06 * Math.random(),
      sy: 0.045 + 0.055 * Math.random(),
      px: Math.random() * Math.PI * 2,
      py: Math.random() * Math.PI * 2,
      r: 0.42 + 0.22 * Math.random(),
      a: 0.2 + 0.12 * Math.random(),
      bs: 0.06 + 0.07 * Math.random(),
      bp: Math.random() * Math.PI * 2,
      tint: i,
    }));

    let accent = readAccent(wrap);
    let theme = themeName();
    let light = theme === 'light';
    let palette = atmospherePalette(theme, accent);
    const themePoll = setInterval(() => {
      accent = readAccent(wrap);
      theme = themeName();
      light = theme === 'light';
      palette = atmospherePalette(theme, accent);
    }, 600);

    let marks = [];
    let lastSpawn = 0;
    const t0 = performance.now();
    let raf = 0;
    let lastFrame = -Infinity;
    let visible = true;
    let pageVisible = !document.hidden;

    const spawnMark = (now) => {
      const { w, h } = size;
      const ox = Math.floor((w % 64) / 2);
      const oy = Math.floor((h % 64) / 2);
      const cols = Math.max(2, Math.floor((w - ox) / 256));
      const rows = Math.max(2, Math.floor((h - oy) / 256));
      const x = ox + (1 + Math.floor(Math.random() * (cols - 1))) * 256;
      const y = oy + (1 + Math.floor(Math.random() * Math.max(1, rows - 1))) * 256;
      const last = marks[marks.length - 1];
      if (last && Math.abs(last.x - x) < 256 && Math.abs(last.y - y) < 256) return;
      marks.push({
        type: MARK_TYPES[Math.floor(Math.random() * MARK_TYPES.length)],
        x,
        y,
        orient: Math.floor(Math.random() * 4),
        t0: now,
        life: 3 + 1.8 * Math.random(),
      });
      if (marks.length > 8) marks.shift();
    };

    const paint = (frozenT = 0) => {
      const { w, h } = size;
      ctx.clearRect(0, 0, w, h);
      if (!accent) return;

      const [r, g, b] = accent;
      const rgba = (a) => `rgba(${r},${g},${b},${a})`;
      const waveA = 0.78 * frozenT;
      const waveB = 0.42 * frozenT;

      const ox64 = Math.floor((w % 64) / 2);
      const oy64 = Math.floor((h % 64) / 2);
      const ox32 = Math.floor((w % 32) / 2);
      const oy32 = Math.floor((h % 32) / 2);

      ctx.lineWidth = 1;

      const lineAlpha = (xOrY, along, phase = 0) =>
        0.65 * (0.5 + 0.5 * Math.sin(0.0034 * (xOrY + 0.4 * along) - waveA + phase)) +
        0.35 * (0.5 + 0.5 * Math.sin(0.0022 * (xOrY - 0.3 * along) - waveB + phase + 2.1));

      // Fine 32px
      for (let x = ox32; x <= w; x += 32) {
        ctx.strokeStyle = rgba(0.012 + 0.055 * lineAlpha(x, h));
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, h);
        ctx.stroke();
      }
      for (let y = oy32; y <= h; y += 32) {
        ctx.strokeStyle = rgba(0.012 + 0.055 * lineAlpha(y, w, 1.4));
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(w, y + 0.5);
        ctx.stroke();
      }

      // Mid 64px
      for (let x = ox64; x <= w; x += 64) {
        ctx.strokeStyle = rgba(0.032 + 0.14 * lineAlpha(x, h));
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, h);
        ctx.stroke();
      }
      for (let y = oy64; y <= h; y += 64) {
        ctx.strokeStyle = rgba(0.032 + 0.14 * lineAlpha(y, w, 1.4));
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(w, y + 0.5);
        ctx.stroke();
      }

      // Major 256px
      for (let x = ox64; x <= w; x += 256) {
        ctx.strokeStyle = rgba(0.06 + 0.22 * lineAlpha(x, h));
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, h);
        ctx.stroke();
      }
      for (let y = oy64; y <= h; y += 256) {
        ctx.strokeStyle = rgba(0.06 + 0.22 * lineAlpha(y, w, 1.4));
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(w, y + 0.5);
        ctx.stroke();
      }

      // Crosshair ticks on major intersections
      ctx.fillStyle = rgba(0.24);
      for (let x = ox64; x <= w; x += 256) {
        for (let y = oy64; y <= h; y += 256) {
          ctx.fillRect(x - 2, y, 4, 1);
          ctx.fillRect(x, y - 2, 1, 4);
        }
      }

      if (!preferReduce) {
        if (frozenT - lastSpawn > 1.2 + 1.4 * Math.random()) {
          spawnMark(frozenT);
          lastSpawn = frozenT;
        }
        marks = marks.filter((m) => frozenT - m.t0 < m.life);
        const markScale = light ? 0.72 : 0.68;
        for (const mark of marks) {
          const age = frozenT - mark.t0;
          const a =
            markScale *
            Math.min(Math.min(1, age / 0.5), Math.min(1, (mark.life - age) / 1.1));
          if (a > 0.01) drawMark(ctx, mark, frozenT, a, rgba);
        }
      }

      ctx.globalCompositeOperation = light ? 'multiply' : 'screen';
      for (const bloom of blooms) {
        const [br, bg, bb] = palette[bloom.tint % palette.length];
        const bloomRgba = (a) => `rgba(${br},${bg},${bb},${a})`;
        const bx = (bloom.cx + bloom.ox * Math.cos(frozenT * bloom.sx + bloom.px)) * w;
        const by = (bloom.cy + bloom.oy * Math.sin(frozenT * bloom.sy + bloom.py)) * h;
        const pulse = 0.78 + 0.22 * Math.sin(frozenT * bloom.bs + bloom.bp);
        const rad = bloom.r * Math.min(w, h) * (0.88 + 0.18 * pulse);
        const a = bloom.a * pulse;
        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, rad);
        grad.addColorStop(0, bloomRgba(a));
        grad.addColorStop(0.45, bloomRgba(0.32 * a));
        grad.addColorStop(1, bloomRgba(0));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    const tick = () => {
      const now = performance.now();
      if (now - lastFrame < 33) {
        raf = requestAnimationFrame(tick);
        return;
      }
      lastFrame = now;
      paint((now - t0) / 1000);
      if (!preferReduce) raf = requestAnimationFrame(tick);
    };

    if (preferReduce) {
      paint(0);
    } else {
      raf = requestAnimationFrame(tick);
    }

    const syncLoop = () => {
      cancelAnimationFrame(raf);
      if (!preferReduce && visible && pageVisible) {
        raf = requestAnimationFrame(tick);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncLoop();
      },
      { threshold: 0 },
    );
    io.observe(wrap);

    const onVis = () => {
      pageVisible = !document.hidden;
      syncLoop();
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      cancelAnimationFrame(raf);
      clearInterval(themePoll);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={wrapRef}
      className={`ndx-home-graph ${reducedMotion ? 'ndx-home-graph--static' : ''} ${className}`.trim()}
      aria-hidden
    >
      <div className="ndx-home-graph__glow ndx-home-graph__glow--a" />
      <div className="ndx-home-graph__glow ndx-home-graph__glow--b" />
      <canvas ref={canvasRef} className="ndx-home-graph__mesh" />
    </div>
  );
}
