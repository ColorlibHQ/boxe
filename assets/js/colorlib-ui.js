/*! ColorlibUI 3.0.0 — core, owl, magnific, ajaxchimp, datepicker. Built for this theme from core + the modules it uses. */
/**
 * The interactive pieces these themes actually use, without jQuery.
 *
 * The core: the small helpers every module uses, plus the pieces nearly every
 * theme needs (styled selects, counters, reveal on scroll). Modules for the
 * other plugins the themes used (Owl Carousel, Slick, Magnific Popup, Isotope,
 * SlickNav, ScrollUp, AjaxChimp, ...) are appended after it by the build, only
 * when a theme uses them, and register themselves on window.ColorlibUI.
 * Those libraries are general-purpose; the themes use a narrow slice of them:
 * a looping carousel, a slider with a thumbnail strip, a lightbox for images
 * and video embeds, a styled select, numbers that count up and elements that
 * animate in as they scroll into view.
 *
 * Markup is read from the same class names and data attributes the old
 * plugins used, so templates do not change.
 *
 * Each piece is optional: if the markup is not on the page, nothing runs.
 */
(function () {
  'use strict';

  var PREFERS_REDUCED = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /** Elements from a selector, an Element, a NodeList/array, or a jQuery-like object. */
  function toElements(target, root) {
    if (!target) return [];
    if (typeof target === 'string') {
      return Array.prototype.slice.call((root || document).querySelectorAll(target));
    }
    if (target.nodeType === 1) return [target];
    if (typeof target.length === 'number') return Array.prototype.slice.call(target);
    return [];
  }

  /** Dispatch a bubbling CustomEvent carrying detail. */
  function emit(el, type, detail) {
    var event;
    try {
      event = new CustomEvent(type, { bubbles: true, cancelable: true, detail: detail || {} });
    } catch (e) {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(type, true, true, detail || {});
    }
    return el.dispatchEvent(event);
  }

  /** Shallow-merge plain objects left to right (Object.assign where available). */
  function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
      var src = arguments[i];
      if (!src) continue;
      for (var k in src) {
        if (Object.prototype.hasOwnProperty.call(src, k)) target[k] = src[k];
      }
    }
    return target;
  }

  /** Parse an HTML string into its first element (for navText, prevArrow, ...). */
  function fromHTML(html) {
    var t = document.createElement('template');
    t.innerHTML = String(html).trim();
    return t.content.firstElementChild || document.createTextNode(String(html));
  }

  /** Animate window scroll to y over ms (instant with reduced motion). */
  function scrollToY(y, ms) {
    if (PREFERS_REDUCED || !ms) { window.scrollTo(0, y); return; }
    var from = window.pageYOffset, start = null;
    function step(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / ms, 1);
      var eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      window.scrollTo(0, from + (y - from) * eased);
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------ *
   * The jQuery effects the themes use, on the Web Animations API.
   * jQuery's semantics: slideDown/fadeIn show a hidden element (display
   * from the stylesheet, or block), slideUp/fadeOut end with display:none.
   * With reduced motion the end state is applied at once.
   * ------------------------------------------------------------------ */

  function isHidden(el) {
    return window.getComputedStyle(el).display === 'none';
  }

  function show(el) {
    el.style.display = '';
    if (isHidden(el)) el.style.display = 'block';
  }

  function animateTo(el, frames, ms, done) {
    if (PREFERS_REDUCED || !ms || !el.animate) { if (done) done(); return; }
    var anim = el.animate(frames, { duration: ms, easing: 'ease' });
    anim.onfinish = function () { if (done) done(); };
  }

  /** slide(el, 'up' | 'down' | 'toggle', ms = 400, done) */
  function slide(target, dir, ms, done) {
    if (ms === undefined) ms = 400;
    toElements(target).forEach(function (el) {
      var hidden = isHidden(el);
      var down = dir === 'down' || (dir === 'toggle' && hidden);
      if (down && !hidden) return;
      if (!down && hidden) return;
      if (down) show(el);
      var h = el.scrollHeight + 'px';
      el.style.overflow = 'hidden';
      animateTo(el, down ? [{ height: '0px' }, { height: h }] : [{ height: h }, { height: '0px' }], ms, function () {
        el.style.overflow = '';
        if (!down) el.style.display = 'none';
        if (done) done.call(el);
      });
    });
  }

  /** fade(el, 'in' | 'out' | 'toggle', ms = 400, done) */
  function fade(target, dir, ms, done) {
    if (ms === undefined) ms = 400;
    toElements(target).forEach(function (el) {
      var hidden = isHidden(el);
      var fadeIn = dir === 'in' || (dir === 'toggle' && hidden);
      if (fadeIn && !hidden) return;
      if (!fadeIn && hidden) return;
      if (fadeIn) show(el);
      animateTo(el, fadeIn ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0 }], ms, function () {
        if (!fadeIn) el.style.display = 'none';
        if (done) done.call(el);
      });
    });
  }

  /** Document offset of an element, like jQuery's .offset(). */
  function offset(el) {
    var r = el.getBoundingClientRect();
    return { top: r.top + window.pageYOffset, left: r.left + window.pageXOffset };
  }

  /**
   * POST/GET to WordPress (admin-ajax.php and friends) the way $.ajax did:
   * data is form-encoded, the response parsed as JSON when it is JSON.
   * Returns a Promise.
   */
  function request(url, opts) {
    opts = opts || {};
    var method = (opts.method || opts.type || 'POST').toUpperCase();
    var body = null;
    if (opts.data) {
      var params = new URLSearchParams();
      Object.keys(opts.data).forEach(function (k) { params.append(k, opts.data[k]); });
      if (method === 'GET') url += (url.indexOf('?') < 0 ? '?' : '&') + params.toString();
      else body = params;
    }
    return fetch(url, { method: method, body: body, credentials: 'same-origin' }).then(function (res) {
      return res.text().then(function (text) {
        try { return JSON.parse(text); } catch (e) { return text; }
      });
    });
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  }

  function videoSource(href) {
    var yt = href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
    if (yt) return 'https://www.youtube.com/embed/' + yt[1] + '?autoplay=1&rel=0';
    var vm = href.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vm) return 'https://player.vimeo.com/video/' + vm[1] + '?autoplay=1';
    return href;
  }


  /* ------------------------------------------------------------------ *
   * Select
   *
   * Builds the same markup jQuery Nice Select produced, because the themes
   * style that structure: .nice-select > .current, and a .list of .option.
   * The original select stays in the DOM and keeps carrying the value, so
   * forms submit exactly as before and assistive technology still sees it.
   * ------------------------------------------------------------------ */

  function enhanceSelect(select) {
    if (select.dataset.clEnhanced) return;
    select.dataset.clEnhanced = '1';

    var wrap = document.createElement('div');
    wrap.className = 'nice-select ' + (select.className || '');
    wrap.tabIndex = 0;
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('aria-haspopup', 'listbox');
    wrap.setAttribute('aria-expanded', 'false');

    var current = document.createElement('span');
    current.className = 'current';

    var list = document.createElement('ul');
    list.className = 'list';
    list.setAttribute('role', 'listbox');

    Array.prototype.forEach.call(select.options, function (option) {
      var li = document.createElement('li');
      li.className = 'option' + (option.selected ? ' selected' : '') +
        (option.disabled ? ' disabled' : '');
      li.textContent = option.textContent;
      li.dataset.value = option.value;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', option.selected ? 'true' : 'false');

      li.addEventListener('click', function (e) {
        // The wrapper toggles on click; without this the choice would bubble
        // up and reopen the list it just closed.
        e.stopPropagation();
        if (option.disabled) return;
        select.value = option.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        sync();
        wrap.classList.remove('open');
        wrap.setAttribute('aria-expanded', 'false');
      });
      list.appendChild(li);
    });

    function sync() {
      var chosen = select.options[select.selectedIndex];
      current.textContent = chosen ? chosen.textContent : '';
      Array.prototype.forEach.call(list.children, function (li) {
        var on = li.dataset.value === select.value;
        li.classList.toggle('selected', on);
        li.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    }

    wrap.addEventListener('click', function () {
      var open = wrap.classList.toggle('open');
      wrap.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); wrap.click(); }
      if (e.key === 'Escape') { wrap.classList.remove('open'); }
    });
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove('open');
        wrap.setAttribute('aria-expanded', 'false');
      }
    });
    select.addEventListener('change', sync);

    wrap.appendChild(current);
    wrap.appendChild(list);
    select.parentNode.insertBefore(wrap, select);

    // Kept for the form and for assistive technology, but out of the way.
    select.style.position = 'absolute';
    select.style.width = '1px';
    select.style.height = '1px';
    select.style.opacity = '0';
    select.style.pointerEvents = 'none';

    sync();
  }

  /* ------------------------------------------------------------------ *
   * Running when the page is ready
   *
   * Callers are theme scripts in the footer and inline scripts printed by
   * widgets in the middle of the page; both are safe.
   * ------------------------------------------------------------------ */

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function each(target, fn) {
    ready(function () {
      toElements(target).forEach(fn);
    });
  }

  /** $('select').niceSelect(), without jQuery. */
  function enhanceSelects(selector) {
    each(selector || 'select', function (select) {
      // Nice Select never handled multiple selects, and neither does this.
      if (select.multiple) return;
      enhanceSelect(select);
    });
  }


  /* ------------------------------------------------------------------ *
   * Counter
   *
   * Replaces jQuery CounterUp and the Waypoints library it depended on.
   * Like CounterUp, the number is read from the element's own text and left
   * untouched until the element scrolls into view; it then counts up from
   * zero and always finishes on the original text. Text that is not a plain
   * number ("24/7") is left alone.
   * ------------------------------------------------------------------ */

  function counter(selector, options) {
    var time = (options && options.time) || 1000;

    each(selector, function (el) {
      if (el.dataset.clCounter) return;
      el.dataset.clCounter = '1';

      var text = el.textContent.trim();
      var plain = text.replace(/,/g, '');
      if (!/^\d+(\.\d+)?$/.test(plain)) return;
      if (PREFERS_REDUCED || !('IntersectionObserver' in window)) return;

      var target = parseFloat(plain);
      var decimals = (plain.split('.')[1] || '').length;
      var commas = /\d,\d/.test(text);

      function format(n) {
        var s = n.toFixed(decimals);
        return commas ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : s;
      }

      var observer = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        var start = null;
        function step(now) {
          if (start === null) start = now;
          var progress = Math.min((now - start) / time, 1);
          el.textContent = progress < 1 ? format(target * progress) : text;
          if (progress < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
      });
      observer.observe(el);
    });
  }


  /* ------------------------------------------------------------------ *
   * Reveal on scroll
   *
   * Replaces WOW.js, against the same markup: an element with class "wow"
   * and an animate.css animation class, plus optional data-wow-duration,
   * data-wow-delay and data-wow-iteration. It is hidden until it scrolls
   * into view, then gets the "animated" class.
   *
   * The animation name is held at "none" until then, as WOW did: otherwise
   * the animation has already run (at zero duration) by the time "animated"
   * gives it a real one, and nothing moves. With reduced motion requested,
   * or no IntersectionObserver, elements are simply left visible.
   * ------------------------------------------------------------------ */

  function reveal(selector, options) {
    var offset = (options && options.offset) || 0;
    if (PREFERS_REDUCED || !('IntersectionObserver' in window)) return;

    each(selector || '.wow', function (el) {
      if (el.dataset.clReveal) return;
      el.dataset.clReveal = '1';

      el.style.visibility = 'hidden';
      el.style.animationName = 'none';

      var observer = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        var data = el.dataset;
        if (data.wowDuration) el.style.animationDuration = data.wowDuration;
        if (data.wowDelay) el.style.animationDelay = data.wowDelay;
        if (data.wowIteration) el.style.animationIterationCount = data.wowIteration;
        el.style.animationName = '';
        el.style.visibility = 'visible';
        el.classList.add('animated');
      }, { rootMargin: '0px 0px ' + (-offset) + 'px 0px' });
      observer.observe(el);
    });
  }

  var UI = window.ColorlibUI || {};
  extend(UI, {
    version: '3.0.0',
    reducedMotion: PREFERS_REDUCED,
    toElements: toElements,
    each: each,
    emit: emit,
    extend: extend,
    fromHTML: fromHTML,
    scrollToY: scrollToY,
    slide: slide,
    fade: fade,
    offset: offset,
    request: request,
    enhanceSelect: enhanceSelect,
    enhanceSelects: enhanceSelects,
    counter: counter,
    reveal: reveal,
    ready: ready,
    videoSource: videoSource,
    debounce: debounce
  });
  window.ColorlibUI = UI;
}());

/* ColorlibUI module: owl — replaces Owl Carousel 2 (2.3.4, and the 2.2.1 and 2.0-beta builds
 * some themes ship). Themes style the DOM Owl generates (.owl-stage-outer > .owl-stage >
 * .owl-item.active, .owl-nav > .owl-prev/.owl-next, .owl-dots > .owl-dot > span), so this
 * rebuilds that DOM with Owl's own arithmetic: the same item widths and margin-right, stage
 * width, translate3d offsets, loop clones before and after the real items, active/center
 * classes, dot pages and the same responsive merge (largest breakpoint <= window.innerWidth).
 * Option names and defaults are Owl's, so `$(x).owlCarousel(opts)` becomes
 * `ColorlibUI.owl(x, opts)` with the same object.
 *
 * Owl's markup changed between the builds the themes load. `markup` picks it, per call or
 * once per theme with `ColorlibUI.owl.defaults.markup = '2.2'`:
 *   '2.3' (default)  <button> arrows and dots; hidden .owl-nav/.owl-dots get .disabled
 *   '2.2'            the same with <div> arrows and dots (Owl 2.1-2.2)
 *   '2.0'            Owl 2.0 beta: <div> controls inside .owl-controls, shown and hidden with
 *                    display, plus the beta's clone count, unrounded offsets and owl-theme class
 */
(function () {
  'use strict';
  var UI = window.ColorlibUI;
  if (!UI) return;

  var MARKUP = {
    '2.3': { tag: 'button', navText: ['<span aria-label="Previous">&#x2039;</span>', '<span aria-label="Next">&#x203a;</span>'] },
    '2.2': { tag: 'div', navText: ['prev', 'next'] },
    '2.0': { tag: 'div', navText: ['prev', 'next'] }
  };

  var defaults = {
    markup: '2.3',
    items: 3, loop: false, center: false, rewind: false, checkVisibility: true,
    mouseDrag: true, touchDrag: true, pullDrag: true, freeDrag: false,
    margin: 0, stagePadding: 0, startPosition: 0,
    smartSpeed: 250, dragEndSpeed: false, slideTransition: '',
    responsive: {}, responsiveRefreshRate: 200, responsiveClass: false,
    itemElement: 'div', stageElement: 'div', nestedItemSelector: false,
    nav: false, navText: null, navSpeed: false, navElement: null, navContainer: false,
    navContainerClass: 'owl-nav', navClass: ['owl-prev', 'owl-next'], slideBy: 1,
    dots: true, dotClass: 'owl-dot', dotsClass: 'owl-dots', dotsEach: false,
    dotsSpeed: false, dotsContainer: false,
    autoplay: false, autoplayTimeout: 5000, autoplayHoverPause: false, autoplaySpeed: false
  };

  /** $.extend as Owl used it: undefined values (a missing data-* option) keep the default. */
  function merge(target) {
    for (var i = 1; i < arguments.length; i++) {
      var src = arguments[i];
      for (var k in src) {
        if (Object.prototype.hasOwnProperty.call(src, k) && src[k] !== undefined) target[k] = src[k];
      }
    }
    return target;
  }

  function isNumeric(v) { return !isNaN(parseFloat(v)); }
  function kids(el) { return Array.prototype.slice.call(el.children); }
  function indexOf(el) { return el.parentNode ? kids(el.parentNode).indexOf(el) : -1; }
  function visible(el) { return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function div(cls) { var d = document.createElement('div'); d.className = cls; return d; }
  function show(el, on) { el.style.display = on ? '' : 'none'; }

  /** jQuery's .width(): the content width, fractional, whatever the box-sizing. */
  function contentWidth(el) {
    var cs = window.getComputedStyle(el), w = parseFloat(cs.width);
    if (isNaN(w)) return 0;
    if (cs.boxSizing === 'border-box') {
      w -= (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0) +
        (parseFloat(cs.borderLeftWidth) || 0) + (parseFloat(cs.borderRightWidth) || 0);
    }
    return w;
  }

  function pointer(e) {
    var p = e.touches && e.touches.length ? e.touches[0]
      : e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : e;
    return p.pageX ? { x: p.pageX, y: p.pageY } : { x: p.clientX, y: p.clientY };
  }

  /** jQuery's .html(value) as Owl used it for navText: strings are HTML, anything else text. */
  function setContent(el, v) {
    if (typeof v === 'string') el.innerHTML = v;
    else if (v || v === 0) el.textContent = String(v);
  }

  /** An arrow or dot; <div> ones (2.2/2.0 markup) are made keyboard-operable too. */
  function control(tag, cls, content, label) {
    var el = document.createElement(tag);
    el.className = cls;
    setContent(el, content);
    if (tag === 'button') {
      el.type = 'button';
    } else {
      el.setAttribute('role', 'button');
      el.tabIndex = 0;
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
      });
    }
    if (!/\w/.test(el.textContent)) el.setAttribute('aria-label', label);
    return el;
  }

  /* ------------------------------------------------------------------ *
   * The carousel. Methods mirror Owl's own (setup, refresh, update, to,
   * normalize, relative, coordinates, ...) so the numbers come out the same.
   * Positions are "absolute" (index among the stage's children, clones
   * included) unless called relative (index among the real items).
   * ------------------------------------------------------------------ */

  function Owl(el, options) {
    var o = merge({}, owl.defaults, options);
    var m = MARKUP[o.markup] || MARKUP['2.3'];
    o.navElement = String(o.navElement || m.tag).split(/\s/)[0];
    if (o.navText == null) o.navText = m.navText;

    this.el = el;
    this.options = o;
    this.legacy = o.markup === '2.0';
    this.dotTag = m.tag;
    this.settings = null;
    this._breakpoint = null;
    this._width = 0;
    this._items = [];
    this._clones = [];
    this._coordinates = [];
    this._itemWidth = 0;
    this._current = null;
    this._speed = null;
    this._invalidated = {};
    this._valid = false;
    this._suppress = {};
    this._animating = false;
    this._dragging = false;
    this._drag = {};
    this._pages = [];
    this._controls = null;
    this._auto = { call: null, time: 0, timeout: 0, paused: true, on: false };
    this._off = [];

    this.setup();
    this.initialize();
  }

  var P = Owl.prototype;

  /** Owl's trigger(): a `<name>.owl.carousel` event plus the matching onName option callback. */
  P.trigger = function (name, data, namespace) {
    if (this._suppress[name]) return true;
    var s = this.settings;
    var detail = UI.extend({
      item: { count: this._items.length, index: this._current },
      page: {
        index: this._pages.indexOf(this.page()),
        count: this._pages.length,
        size: s ? (s.center ? 1 : s.dotsEach || s.items) : undefined
      },
      relatedTarget: this
    }, data);
    var ns = 'owl.' + (namespace || 'carousel');
    var ok = UI.emit(this.el, name + '.' + ns, detail);
    var fn = s && s['on' + cap(name) + (namespace ? cap(namespace) : '')];
    if (typeof fn === 'function') {
      fn.call(this, UI.extend({ type: name, namespace: ns, target: this.el }, detail));
    }
    return ok;
  };

  P.listen = function (target, type, fn, opts) {
    target.addEventListener(type, fn, opts || false);
    this._off.push(function () { target.removeEventListener(type, fn, opts || false); });
  };

  /** Settings = options merged with the largest responsive breakpoint <= the viewport width. */
  P.setup = function () {
    var o = this.options, bps = o.responsive, vw = window.innerWidth || document.documentElement.clientWidth;
    var match = -1, s, k;
    if (bps) {
      for (k in bps) {
        if (Object.prototype.hasOwnProperty.call(bps, k) && k <= vw && k > match) match = Number(k);
      }
    }
    // The beta kept its settings object until the breakpoint itself changed.
    if (this.legacy && this.settings && this._breakpoint === match) return;
    s = merge({}, o, bps ? bps[match] : null);
    delete s.responsive;
    if (this.legacy && s.responsiveClass) {
      this.el.className = this.el.className.replace(/\b owl-responsive-\S+/g, '');
      this.el.classList.add('owl-responsive-' + match);
    }
    this.trigger('change', { property: { name: 'settings', value: s } });
    this._breakpoint = match;
    this.settings = s;
    this.invalidate('settings');
    this.trigger('changed', { property: { name: 'settings', value: s } });
    if (!this.legacy) { if (s.autoplay) this.play(); else this.stop(); }
  };

  P.initialize = function () {
    var el = this.el, s = this.settings;
    this.trigger('initialize');
    if (this.legacy) el.classList.add('owl-carousel', 'owl-theme');
    el.classList.add('owl-loading');

    this.outer = div('owl-stage-outer');
    this.stage = document.createElement(s.stageElement || 'div');
    this.stage.className = 'owl-stage';
    this.outer.appendChild(this.stage);
    var content = kids(el);
    el.appendChild(this.outer);
    this.replace(content);

    if (this.legacy) {
      this._width = contentWidth(el);
      this.refresh();
    } else if (this.isVisible()) {
      this.refresh();
    } else {
      this.invalidate('width');
    }
    el.classList.remove('owl-loading');
    el.classList.add('owl-loaded');
    this.bind();
    if (!this.legacy) {
      this.initNav();
      this.navUpdate();
      this.draw();
    }
    this.trigger('initialized');
    if (!this.legacy && this.settings.autoplay) this.play();
    this.watch();
  };

  P.isVisible = function () {
    return (this.options.markup === '2.3' && !this.settings.checkVisibility) || visible(this.el);
  };

  /** Wrap each child element in an .owl-item on the stage (Owl's replace + prepare). */
  P.replace = function (content) {
    var s = this.settings, self = this, found = [];
    this._items = [];
    if (s.nestedItemSelector) {
      content.forEach(function (c) {
        found = found.concat(Array.prototype.slice.call(c.querySelectorAll('.' + s.nestedItemSelector)));
      });
      content = found;
    }
    content.forEach(function (node) {
      if (node.nodeType !== 1) return;
      var item = document.createElement(s.itemElement || 'div');
      item.className = 'owl-item';
      item.appendChild(node);
      self.stage.appendChild(item);
      self._items.push(item);
    });
    this.reset(isNumeric(s.startPosition) ? s.startPosition : 0);
    this.invalidate('items');
  };

  P.refresh = function () {
    if (this.legacy && !this._items.length) return;
    this.trigger('refresh');
    this.setup();
    var s = this.settings;
    if (this.legacy) {
      this.el.classList.toggle('owl-center', !!s.center);
      if (s.loop && this._items.length < s.items) s.loop = false;
    }
    this.update();
    if (this.legacy) {
      if (!visible(this.el)) { this.el.classList.add('owl-hidden'); this._visible = false; }
      if (!this._controls) this.initNav();
      if (s.autoplay) { this.stop(); this.play(); } else this.stop();
    }
    if (this._controls) {
      this.navUpdate();
      this.draw();
    }
    this.trigger('refreshed');
  };

  P.invalidate = function (part) {
    this._invalidated[part] = true;
    this._valid = false;
  };

  /** Owl's worker pipeline, in Owl's order, run for whatever was invalidated. */
  P.update = function () {
    var inv = this._invalidated, layout = inv.width || inv.items || inv.settings, cur, i;
    if (!this.legacy && (inv.width || inv.settings)) this._width = contentWidth(this.el);
    if (layout) cur = this._items[this.relative(this._current)];
    if (inv.items || inv.settings) this.clone();
    if (layout) {
      this.measure();
      this.layout();
    }
    if (inv.items && this._coordinates.length < 1) this.stage.removeAttribute('style');
    if (layout) {
      i = cur ? indexOf(cur) : 0;
      if (this.legacy) { if (cur) this.reset(i); }
      else this.reset(Math.max(this.minimum(), Math.min(this.maximum(), i)));
    }
    if (inv.position) this.animate(this.coordinates(this._current));
    if (layout || inv.position) this.markActive();
    this._invalidated = {};
    this._valid = true;
  };

  /**
   * Loop clones: copies of the first items appended and of the last items prepended,
   * so the view can slide past either end. 2.x makes max(2 x items, 4, item count rounded
   * up to even) of them; the beta only max(2 x items, 4).
   */
  P.clone = function () {
    var s = this.settings, n = this._items.length, stage = this.stage, clones = [], append = [], prepend = [];
    kids(stage).forEach(function (c) { if (c.classList.contains('cloned')) stage.removeChild(c); });
    var view = Math.max(s.items * 2, 4);
    var repeat = this.legacy ? (s.loop ? view : 0)
      : (s.loop && n ? (s.rewind ? view : Math.max(view, Math.ceil(n / 2) * 2)) : 0);
    repeat /= 2;
    while (repeat > 0) {
      clones.push(this.normalize(clones.length / 2, true));
      append.push(this._items[clones[clones.length - 1]]);
      clones.push(this.normalize(n - 1 - (clones.length - 1) / 2, true));
      prepend.unshift(this._items[clones[clones.length - 1]]);
      repeat -= 1;
    }
    this._clones = clones;
    function copy(item) { var c = item.cloneNode(true); c.classList.add('cloned'); return c; }
    append.forEach(function (item) { stage.appendChild(copy(item)); });
    var first = stage.firstChild;
    prepend.forEach(function (item) { stage.insertBefore(copy(item), first); });
  };

  /** Item width and the left edge of every stage child (negative px), as Owl computes them. */
  P.measure = function () {
    var s = this.settings, total = this._clones.length + this._items.length, coords = [], i, w, f = 0;
    if (this.legacy) {
      w = (this.width() / s.items).toFixed(3);
      for (i = 0; i < total; i++) { f += (w * 1) * -1; coords.push(f); }
      this._itemWidth = w - s.margin;
    } else {
      w = (this.width() / s.items).toFixed(3) - s.margin;
      for (i = 0; i < total; i++) coords.push((coords[i - 1] || 0) + (w + s.margin) * -1);
      this._itemWidth = w;
    }
    this._coordinates = coords;
  };

  P.layout = function () {
    var s = this.settings, c = this._coordinates, pad = s.stagePadding, st = this.stage.style, w = this._itemWidth, legacy = this.legacy;
    var width = legacy ? Math.abs(c[c.length - 1]) + 2 * pad : Math.ceil(Math.abs(c[c.length - 1])) + pad * 2;
    if (!isNaN(width)) st.width = width + 'px';
    st.paddingLeft = pad ? pad + 'px' : '';
    st.paddingRight = pad ? pad + 'px' : '';
    kids(this.stage).forEach(function (item) {
      item.style.width = w + 'px';
      if (legacy) {
        item.style.marginRight = s.margin + 'px';
      } else {
        item.style.marginLeft = '';
        item.style.marginRight = s.margin ? s.margin + 'px' : '';
      }
    });
  };

  /** .active on every child whose left edge is inside the view; .center on the current one. */
  P.markActive = function () {
    var s = this.settings, c = this._coordinates, pad = s.stagePadding * 2, current = this._current;
    var begin = this.coordinates(current) + pad, end = begin - this.width(), on = {}, i, inner, outer;
    for (i = 0; i < c.length; i++) {
      inner = c[i - 1] || 0;
      outer = Math.abs(c[i]) - pad;
      if ((inner <= begin && inner > end) || (outer < begin && outer > end)) on[i] = true;
    }
    kids(this.stage).forEach(function (item, j) {
      item.classList.toggle('active', !!on[j]);
      item.classList.toggle('center', !!s.center && j === current);
    });
  };

  P.width = function () {
    return this._width - this.settings.stagePadding * 2 + this.settings.margin;
  };

  P.coordinates = function (position) {
    var c = this._coordinates, x, self = this;
    if (position === undefined) return c.map(function (v, i) { return self.coordinates(i); });
    if (this.settings.center) {
      x = c[position];
      x += (this.width() - x + (c[position - 1] || 0)) / 2;
    } else {
      x = c[position - 1] || 0;
    }
    return this.legacy ? x : Math.ceil(x);
  };

  P.normalize = function (position, relative) {
    var n = this._items.length, m = relative ? 0 : this._clones.length, e;
    if (!isNumeric(position) || n < 1) return undefined;
    position = Number(position);
    if (this.legacy) {
      e = n + m;
      return this._clones.length ? ((position % e) + e) % e
        : Math.max(this.minimum(relative), Math.min(this.maximum(relative), position));
    }
    if (position < 0 || position >= n + m) position = ((position - m / 2) % n + n) % n + m / 2;
    return position;
  };

  /** Absolute position -> index among the real items. */
  P.relative = function (position) {
    if (this.legacy) position = this.normalize(position);
    return this.normalize(position - this._clones.length / 2, true);
  };

  P.minimum = function (relative) {
    return relative ? 0 : this._clones.length / 2;
  };

  P.maximum = function (relative) {
    var s = this.settings, n = this._items.length, max;
    if (this.legacy) {
      if (relative) return n - 1;
      return !s.loop && s.center ? n - 1 : s.loop || s.center ? n + s.items : n - s.items;
    }
    if (s.loop) max = this._clones.length / 2 + n - 1;
    else if (s.center) max = n - 1;
    else max = n - s.items;
    if (relative) max -= this._clones.length / 2;
    return Math.max(max, 0);
  };

  P.speed = function (speed) {
    if (speed !== undefined) this._speed = speed;
    return this._speed;
  };

  P.duration = function (from, to, factor) {
    if (factor === 0 && !this.legacy) return 0;
    return Math.min(Math.max(Math.abs(to - from), 1), 6) * Math.abs(factor || this.settings.smartSpeed);
  };

  /** Jump to a position without animating or emitting translate events. */
  P.reset = function (position) {
    position = this.normalize(position);
    if (position === undefined) return;
    this._speed = 0;
    this._current = position;
    this._suppress.translate = this._suppress.translated = true;
    this.animate(this.coordinates(position));
    delete this._suppress.translate;
    delete this._suppress.translated;
  };

  P.animate = function (x) {
    var self = this, moving = this.speed() > 0, s = this.settings;
    var ms = UI.reducedMotion ? 0 : this.speed();
    if (this._animating && !this.legacy) this.onTransitionEnd();
    if (moving || this.legacy) {
      this._animating = moving;
      this.trigger('translate');
    }
    if (!isNaN(x)) this.stage.style.transform = 'translate3d(' + x + 'px,0px,0px)';
    this.stage.style.transition = (ms / 1000) + 's' + (s.slideTransition ? ' ' + s.slideTransition : '');
    clearTimeout(this._endTimer);
    if (moving) {
      if (!ms) {
        this.onTransitionEnd();
      } else {
        // transitionend never fires when the offset did not change, or the carousel is hidden.
        this._endTimer = setTimeout(function () { if (self._animating) self.onTransitionEnd(); }, ms + 100);
      }
    }
  };

  P.onTransitionEnd = function (e) {
    if (e && (e.target !== this.stage || !this._animating)) return;
    clearTimeout(this._endTimer);
    this._animating = false;
    this.trigger('translated');
    if (this.legacy && this.settings.autoplay && this._auto.on) { this.stop(); this.play(); }
  };

  /** Get, or set and announce, the absolute current position. */
  P.current = function (position) {
    if (position === undefined) return this._current;
    if (!this._items.length) return undefined;
    position = this.normalize(position);
    if (this._current !== position) {
      this.trigger('change', { property: { name: 'position', value: position } });
      this._current = position;
      this.invalidate('position');
      if (this._controls) this.draw();
      if (this._auto.paused) this._auto.time = 0;
      this.trigger('changed', { property: { name: 'position', value: position } });
    }
    return this._current;
  };

  /**
   * Owl's core to(): slide to a relative position. In a loop it first jumps (unseen) to the
   * equivalent real item or clone, so the slide always has room to move the short way.
   */
  P.go = function (position, speed) {
    var s = this.settings, n = this._items.length, current = this._current, self = this;
    var distance, direction, min, max, revert, f, h, fwd;
    position = Number(position);
    if (isNaN(position) || !n) return;

    if (this.legacy) {
      if (!s.loop) {
        this.speed(this.duration(current, position, speed));
        this.current(position);
        this.update();
        return;
      }
      distance = position - this.relative(current);
      f = current;
      h = current + distance;
      fwd = current - h < 0;
      if (h < s.items && !fwd) { f = current + n; this.reset(f); }
      else if (h >= this._clones.length + n - s.items && fwd) { f = current - n; this.reset(f); }
      clearTimeout(this._loopTimer);
      this._loopTimer = setTimeout(function () {
        void self.stage.offsetWidth;
        self.speed(self.duration(self._current, f + distance, speed));
        self.current(f + distance);
        self.update();
      }, 30);
      return;
    }

    distance = position - this.relative(current);
    direction = (distance > 0) - (distance < 0);
    min = this.minimum();
    max = this.maximum();
    if (s.loop) {
      if (!s.rewind && Math.abs(distance) > n / 2) distance += direction * -1 * n;
      position = current + distance;
      revert = ((position - min) % n + n) % n + min;
      if (revert !== position && revert - distance <= max && revert - distance > 0) {
        current = revert - distance;
        position = revert;
        this.reset(current);
        // Commit the jump before the animated move starts from it (Owl got this from
        // the layout read in isVisible()).
        void this.stage.offsetWidth;
      }
    } else if (s.rewind) {
      max += 1;
      position = (position % max + max) % max;
    } else {
      position = Math.max(min, Math.min(max, position));
    }
    this.speed(this.duration(current, position, speed));
    this.current(position);
    if (this.isVisible()) this.update();
  };

  /* Navigation: public next/prev/to, as Owl's navigation plugin overrides them. */

  P.page = function () {
    var r = this.relative(this._current), hit, i;
    for (i = 0; i < this._pages.length; i++) {
      if (this._pages[i].start <= r && this._pages[i].end >= r) hit = this._pages[i];
    }
    return hit;
  };

  P.step = function (forward) {
    var s = this.settings, i, len;
    if (s.slideBy == 'page') {
      i = this._pages.indexOf(this.page());
      len = this._pages.length;
      i += forward ? 1 : -1;
      return this._pages[((i % len) + len) % len].start;
    }
    return this.relative(this._current) + (forward ? s.slideBy : -s.slideBy);
  };

  P.next = function (speed) { this.go(this.step(true), speed); };
  P.prev = function (speed) { this.go(this.step(false), speed); };

  /** Slide to a dot page (Owl's navigation to()); standard=true slides to an item index. */
  P.to = function (position, speed, standard) {
    var len = this._pages.length;
    if (!standard && len) this.go(this._pages[((position % len) + len) % len].start, speed);
    else this.go(position, speed);
  };

  P.initNav = function () {
    var s = this.settings, el = this.el, self = this, c = this._controls = {}, legacy = this.legacy;
    var find = function (t) { return UI.toElements(t)[0]; };
    if (legacy && !(s.navContainer && s.dotsContainer)) el.appendChild(c.box = div('owl-controls'));

    // A container option that matches nothing leaves the controls detached, as $() did.
    c.ownAbs = !s.dotsContainer;
    c.abs = (!c.ownAbs && find(s.dotsContainer)) || div(s.dotsClass);
    c.ownRel = !s.navContainer;
    c.rel = (!c.ownRel && find(s.navContainer)) || div(s.navContainerClass);
    if (legacy) {
      if (c.ownAbs) { show(c.abs, false); c.box.appendChild(c.abs); }
      if (c.ownRel) c.box.insertBefore(c.rel, c.box.firstChild);
    } else {
      if (c.ownRel) el.appendChild(c.rel);
      if (c.ownAbs) el.appendChild(c.abs);
      c.rel.classList.add('disabled');
      c.abs.classList.add('disabled');
    }

    c.prev = control(s.navElement, s.navClass[0], s.navText && s.navText[0], 'Previous');
    c.next = control(s.navElement, s.navClass[1], s.navText && s.navText[1], 'Next');
    if (legacy) { show(c.prev, false); show(c.next, false); }
    c.rel.insertBefore(c.prev, c.rel.firstChild);
    c.rel.appendChild(c.next);
    c.prev.addEventListener('click', function () { self.prev(self.settings.navSpeed); });
    c.next.addEventListener('click', function () { self.next(self.settings.navSpeed); });

    this.listen(c.abs, 'click', function (e) {
      var t = e.target;
      while (t && t.parentNode !== c.abs) t = t.parentNode;
      if (!t || t.tagName.toLowerCase() !== self.dotTag) return;
      e.preventDefault();
      self.to(indexOf(t), self.settings.dotsSpeed);
    });
  };

  /** Dot pages: one per `items` real items (one per item in center mode). */
  P.navUpdate = function () {
    var s = this.settings, lower = this._clones.length / 2, upper = lower + this._items.length;
    var max = this.maximum(true), size = s.center ? 1 : s.dotsEach || s.items, i, j, start;
    if (s.slideBy !== 'page') s.slideBy = Math.min(s.slideBy, s.items);
    if (!(s.dots || s.slideBy == 'page')) return;
    this._pages = [];
    for (i = lower, j = 0; i < upper; i++) {
      if (j >= size || j === 0) {
        start = this.legacy ? i - lower : Math.min(max, i - lower);
        this._pages.push({ start: start, end: i - lower + size - 1 });
        if (!this.legacy && start === max) break;
        j = 0;
      }
      j += 1;
    }
  };

  P.draw = function () {
    var s = this.settings, c = this._controls, n = this._items.length, dots, dot, i, k, active, diff;
    var index = this.relative(this._current), loop = s.loop || s.rewind, few = n <= s.items;
    if (this.legacy) {
      show(c.prev, s.nav);
      show(c.next, s.nav);
    } else {
      c.rel.classList.toggle('disabled', !s.nav || few);
      if (s.nav) {
        c.prev.classList.toggle('disabled', !loop && index <= this.minimum(true));
        c.next.classList.toggle('disabled', !loop && index >= this.maximum(true));
      }
      c.abs.classList.toggle('disabled', !s.dots || few);
    }
    if (s.dots) {
      diff = this._pages.length - c.abs.children.length;
      for (; diff > 0; diff--) {
        dot = control(this.dotTag, s.dotClass, '', '');
        dot.appendChild(document.createElement('span'));
        c.abs.appendChild(dot);
      }
      for (; diff < 0; diff++) c.abs.removeChild(c.abs.lastElementChild);
      Array.prototype.forEach.call(c.abs.querySelectorAll('.active'), function (a) { a.classList.remove('active'); });
      dots = c.abs.children;
      i = this._pages.indexOf(this.page());
      active = dots[i < 0 ? dots.length + i : i];   // jQuery .eq(-1) is the last dot
      for (k = 0; k < dots.length; k++) {
        dots[k].setAttribute('aria-label', 'Go to slide ' + (k + 1));
        if (dots[k] === active) dots[k].setAttribute('aria-current', 'true');
        else dots[k].removeAttribute('aria-current');
      }
      if (active) active.classList.add('active');
    }
    if (this.legacy) show(c.abs, s.dots);
  };

  /* Autoplay: Owl 2.3's clock, which keeps its cadence through hover pauses. */

  P.play = function (timeout, speed) {
    var a = this._auto, self = this, elapsed;
    if (UI.reducedMotion) return;
    a.on = true;
    timeout = timeout || this.settings.autoplayTimeout;
    elapsed = Math.min(a.time % (a.timeout || timeout), timeout);
    if (a.paused) { a.time = this.readClock(); a.paused = false; }
    else clearTimeout(a.call);
    a.time += this.readClock() % timeout - elapsed;
    a.timeout = timeout;
    a.call = setTimeout(function () { self.autoNext(speed); }, timeout - elapsed);
  };

  P.readClock = function () { return new Date().getTime() - this._auto.time; };

  P.autoNext = function (speed) {
    var a = this._auto, self = this;
    a.call = setTimeout(function () { self.autoNext(speed); },
      a.timeout * (Math.round(this.readClock() / a.timeout) + 1) - this.readClock());
    if (this._dragging || document.hidden || (this.legacy && this._animating)) return;
    this.next(speed || this.settings.autoplaySpeed);
  };

  P.stop = function () {
    var a = this._auto;
    if (!a.on) return;
    a.time = 0;
    a.paused = true;
    clearTimeout(a.call);
    a.on = false;
  };

  P.pause = function () {
    var a = this._auto;
    if (!a.on || a.paused) return;
    a.time = this.readClock();
    a.paused = true;
    clearTimeout(a.call);
  };

  /* Events: stage transitions, window resize, drag and swipe, hover pause, commands. */

  P.bind = function () {
    var self = this, el = this.el, stage = this.stage, s = this.settings;
    var cancel = function (e) { e.preventDefault(); };
    var hover = function (pause) {
      return function () {
        if (self.settings.autoplayHoverPause && self._auto.on) { if (pause) self.pause(); else self.play(); }
      };
    };

    this.listen(stage, 'transitionend', function (e) { self.onTransitionEnd(e); });
    if (s.responsive !== false) {
      this.listen(window, 'resize', function () {
        clearTimeout(self._resizeTimer);
        self._resizeTimer = setTimeout(function () { self.onResize(); }, self.settings.responsiveRefreshRate);
      });
    }

    this._move = function (e) { self.onDragMove(e); };
    this._up = function (e) { self.onDragEnd(e); };
    var down = function (e) { self.onDragStart(e); };
    if (s.mouseDrag) {
      if (!this.legacy) el.classList.add('owl-drag');
      this.listen(stage, 'mousedown', down);
      this.listen(stage, 'dragstart', cancel);
      this.listen(stage, 'selectstart', cancel);
    } else if (this.legacy) {
      el.classList.add('owl-text-select-on');
    }
    if (s.touchDrag) {
      this.listen(stage, 'touchstart', down, { passive: true });
      this.listen(stage, 'touchcancel', this._up);
    }

    this.listen(el, 'mouseover', hover(true));
    this.listen(el, 'mouseleave', hover(false));
    this.listen(el, 'touchstart', hover(true), { passive: true });
    this.listen(el, 'touchend', hover(false));

    // $el.trigger('next.owl.carousel') and friends, as CustomEvents. Arguments come in
    // detail as an array (jQuery's extra parameters) or as named fields.
    var commands = {
      'next.owl.carousel': ['next', 'speed'],
      'prev.owl.carousel': ['prev', 'speed'],
      'to.owl.carousel': ['to', 'position', 'speed', 'standard'],
      'refresh.owl.carousel': ['refresh'],
      'destroy.owl.carousel': ['destroy'],
      'play.owl.autoplay': ['play', 'timeout', 'speed'],
      'stop.owl.autoplay': ['stop']
    };
    Object.keys(commands).forEach(function (type) {
      var spec = commands[type];
      self.listen(el, type, function (e) {
        var d = e.detail || {};
        // Skip our own lifecycle events (refresh.owl.carousel) and nested carousels' commands.
        if (e.target !== el || d.relatedTarget === self) return;
        self[spec[0]].apply(self, Array.isArray(d) ? d : spec.slice(1).map(function (k) { return d[k]; }));
      });
    });
  };

  P.onResize = function () {
    var w;
    if (!this._items.length) return;
    w = contentWidth(this.el);
    if (this._width === w) return;
    if (!this.legacy && !this.isVisible()) return;
    if (!this.trigger('resize')) return;
    if (this.legacy) this._width = w;
    this.invalidate('width');
    this.refresh();
    this.trigger('resized');
  };

  /** Owl's AutoRefresh: lay out again when a carousel that started hidden becomes visible. */
  P.watch = function () {
    var self = this;
    if (this._visible === undefined) this._visible = this.isVisible();
    var check = function () {
      var v = self.isVisible();
      if (v === self._visible) return;
      self._visible = v;
      self.el.classList.toggle('owl-hidden', !v);
      if (!v) return;
      // The beta kept the width it measured while hidden; measure it now.
      if (self.legacy) self._width = contentWidth(self.el);
      self.invalidate('width');
      self.refresh();
    };
    if (window.ResizeObserver) {
      this._observer = new ResizeObserver(check);
      this._observer.observe(this.el);
    } else {
      this._watchTimer = setInterval(check, 500);
    }
  };

  P.onDragStart = function (e) {
    var d = this._drag, m, x, y;
    if (e.which === 3) return;
    m = window.getComputedStyle(this.stage).transform.replace(/.*\(|\)| /g, '').split(',');
    x = parseFloat(m[m.length === 16 ? 12 : 4]);
    y = parseFloat(m[m.length === 16 ? 13 : 5]);
    if (this._animating) {
      this.animate(x);
      this.invalidate('position');
    }
    (this.legacy ? this.stage : this.el).classList.toggle('owl-grab', e.type === 'mousedown');
    this.speed(0);
    d.time = new Date().getTime();
    d.target = e.target;
    d.start = { x: x, y: y };
    d.current = { x: x, y: y };
    d.pointer = pointer(e);
    d.first = true;
    this.dragListeners(true);
  };

  /** Document listeners that live only while a drag is in progress. */
  P.dragListeners = function (on) {
    var m = on ? 'addEventListener' : 'removeEventListener';
    document[m]('mouseup', this._up);
    document[m]('touchend', this._up);
    document[m]('mousemove', this._move);
    // Not passive: a horizontal swipe must be able to stop the page from scrolling.
    document[m]('touchmove', this._move, { passive: false });
  };

  P.onDragMove = function (e) {
    var d = this._drag, s = this.settings, p, dx, dy, x, min, max, pull;
    if (!d.pointer) return;
    p = pointer(e);
    dx = d.pointer.x - p.x;
    dy = d.pointer.y - p.y;
    if (d.first) {
      // The first move decides: mostly vertical is a page scroll, not a drag.
      d.first = false;
      if (Math.abs(dx) < Math.abs(dy) && this._valid) return;
      e.preventDefault();
      this._dragging = true;
      this.trigger('drag');
      return;
    }
    if (!this._dragging) return;
    e.preventDefault();
    x = d.start.x - dx;
    if (s.loop && this.legacy) {
      // The beta shifted by one set of items once the drag passed the clones.
      pull = (s.center ? this.coordinates(0) : 0) - this.coordinates(this._items.length);
      if (x > this.coordinates(this.minimum()) && dx < 0) x -= pull;
      else if (x < this.coordinates(this.maximum()) && dx > 0) x += pull;
    } else if (s.loop) {
      min = this.coordinates(this.minimum());
      max = this.coordinates(this.maximum() + 1) - min;
      x = (((x - min) % max + max) % max) + min;
    } else {
      min = this.coordinates(this.minimum());
      max = this.coordinates(this.maximum());
      pull = s.pullDrag ? -1 * dx / 5 : 0;
      x = Math.max(Math.min(x, min + pull), max + pull);
    }
    d.current = { x: x, y: d.start.y };
    this.animate(x);
  };

  P.onDragEnd = function (e) {
    var d = this._drag, s = this.settings, p, dx, direction, target = d.target;
    if (!d.pointer) return;
    p = pointer(e);
    dx = d.pointer.x - p.x;
    direction = dx > 0 ? 'left' : 'right';
    d.pointer = null;
    this.dragListeners(false);
    (this.legacy ? this.stage : this.el).classList.remove('owl-grab');

    if ((dx !== 0 && this._dragging) || !this._valid) {
      this.speed(s.dragEndSpeed || s.smartSpeed);
      this.current(this.closest(d.current.x, dx !== 0 ? direction : d.direction));
      this.invalidate('position');
      this.update();
      d.direction = direction;
      if (Math.abs(dx) > 3 || new Date().getTime() - d.time > 300) {
        // A drag must not also click the link or image it started on.
        var swallow = function (ev) { ev.preventDefault(); ev.stopPropagation(); target.removeEventListener('click', swallow, true); };
        target.addEventListener('click', swallow, true);
        setTimeout(function () { target.removeEventListener('click', swallow, true); }, 400);
      }
    }
    if (!this._dragging) return;
    this._dragging = false;
    this.trigger('dragged');
  };

  /** The absolute position a drag released at `x` settles on (Owl's closest()). */
  P.closest = function (x, direction) {
    var position = -1, pull = 30, width = this.width(), c = this.coordinates(), s = this.settings, i, v, nextV;
    if (!s.freeDrag) {
      for (i = 0; i < c.length && position === -1; i++) {
        v = c[i];
        nextV = c[i + 1] !== undefined ? c[i + 1] : v - width;
        // The beta snapped to any edge within 30px; 2.x checks the far edge on a right pull.
        if ((direction === 'left' || this.legacy) && x > v - pull && x < v + pull) position = i;
        else if (direction === 'right' && !this.legacy && x > v - width - pull && x < v - width + pull) position = i + 1;
        else if (x < v && x > (this.legacy ? c[i + 1] || v - width : nextV)) position = direction === 'left' ? i + 1 : i;
      }
    }
    if (!s.loop) {
      if (x > c[this.minimum()]) position = this.minimum();
      else if (x < c[this.maximum()]) position = this.maximum();
    }
    return position;
  };

  /** Undo everything: controls, clones and wrappers go; the original children come back. */
  P.destroy = function () {
    var el = this.el, c = this._controls, outer = this.outer;
    this.stop();
    clearTimeout(this._resizeTimer);
    clearTimeout(this._endTimer);
    clearTimeout(this._loopTimer);
    clearInterval(this._watchTimer);
    if (this._observer) this._observer.disconnect();
    this._off.forEach(function (off) { off(); });
    this._off = [];
    if (this._move) this.dragListeners(false);
    if (c) {
      [c.prev, c.next].forEach(function (b) { if (b.parentNode) b.parentNode.removeChild(b); });
      if (c.ownRel && c.rel.parentNode) c.rel.parentNode.removeChild(c.rel);
      if (c.ownAbs && c.abs.parentNode) c.abs.parentNode.removeChild(c.abs);
      else if (!c.ownAbs) c.abs.innerHTML = '';
      if (c.box && c.box.parentNode) c.box.parentNode.removeChild(c.box);
    }
    this._items.forEach(function (item) {
      while (item.firstChild) el.insertBefore(item.firstChild, outer);
    });
    el.removeChild(outer);
    el.classList.remove('owl-refresh', 'owl-loading', 'owl-loaded', 'owl-rtl', 'owl-drag', 'owl-grab', 'owl-hidden', 'owl-text-select-on');
    el.removeAttribute('data-cl-owl');
    delete el._clOwl;
  };

  /** The real item elements (.owl-item wrappers), or one of them by relative position. */
  P.items = function (position) {
    return position === undefined ? this._items.slice() : this._items[this.normalize(position, true)];
  };

  /* ------------------------------------------------------------------ *
   * Entry point
   * ------------------------------------------------------------------ */

  function owl(target, options) {
    function run() {
      return UI.toElements(target).map(function (el) {
        if (!el._clOwl) {
          el.setAttribute('data-cl-owl', '');
          el._clOwl = new Owl(el, options);
        }
        return el._clOwl;
      });
    }
    // Like jQuery, start the carousels that exist now (an inline script right after its
    // markup gets its instance back). A selector used while the page is still parsing
    // also picks up matching elements parsed later, once the DOM is ready.
    if (document.readyState === 'loading' && typeof target === 'string') UI.ready(run);
    return run();
  }

  owl.defaults = defaults;
  /** The instance on an element, like $(el).data('owl.carousel'). */
  owl.instance = function (target) {
    var el = UI.toElements(target)[0];
    return (el && el._clOwl) || null;
  };
  owl.Constructor = Owl;

  UI.owl = owl;
}());

/* ColorlibUI module: magnific — replaces Magnific Popup 1.1.0 (and Simple Lightbox 1.x).
 *
 * The themes style the DOM Magnific builds (.mfp-bg, .mfp-wrap, .mfp-container,
 * .mfp-content, .mfp-figure, .mfp-close, .mfp-arrow, ...) through magnific-popup.css
 * and their own overrides (#test-form button.mfp-close, .mfp-bg colours), so this
 * rebuilds that DOM step for step: one shared overlay (bg + wrap + container) that is
 * reused between opens, content built from the same markup strings, the same
 * classes toggled at the same moments (mfp-ready 16 ms after insertion, mfp-removing
 * for removalDelay ms), the same inline styles (wrap top/height when
 * fixedContentPos is off, html overflow + scrollbar margin when it is on). Types
 * covered: image, iframe (YouTube / Vimeo / Google Maps URL rewriting identical to
 * Magnific's), inline, plus the gallery module. Ajax and zoom are not used by any
 * theme; a trigger with type 'ajax' simply follows its link.
 *
 * UI.simpleLightbox rebuilds Simple Lightbox's own .slb* DOM instead, because the one
 * theme using it (eiser) loads simpleLightbox.css, not magnific-popup.css.
 */
(function () {
  'use strict';
  var UI = window.ColorlibUI;
  if (!UI) return;

  var READY = 'mfp-ready';
  var REMOVING = 'mfp-removing';
  var PREVENT_CLOSE = 'mfp-prevent-close';
  var docEl = document.documentElement;

  // Magnific's UA checks decide fixedContentPos:'auto' and the iOS height fix; the
  // themes were tuned against that behaviour, so it is kept as it was.
  var appVersion = navigator.appVersion;
  var isIOS = /iphone|ipad|ipod/i.test(appVersion);
  var probablyMobile = /android/i.test(appVersion) || isIOS ||
    /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent);

  var defaults = {
    disableOn: 0, key: null, midClick: false, mainClass: '', preloader: true, focus: '',
    closeOnContentClick: false, closeOnBgClick: true, closeBtnInside: true, showCloseBtn: true,
    enableEscapeKey: true, modal: false, alignTop: false, removalDelay: 0, prependTo: null,
    fixedContentPos: 'auto', fixedBgPos: 'auto', overflowY: 'auto',
    closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',
    tClose: 'Close (Esc)', tLoading: 'Loading...', autoFocusLast: true,
    inline: { hiddenClass: 'hide', markup: '', tNotFound: 'Content not found' },
    image: {
      markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div>' +
        '<figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div>' +
        '</div></figcaption></figure></div>',
      cursor: 'mfp-zoom-out-cur', titleSrc: 'title', verticalFit: true,
      tError: '<a href="%url%">The image</a> could not be loaded.'
    },
    iframe: {
      // allow="autoplay" is the only addition: without it Chrome ignores the
      // ?autoplay=1 Magnific appends, in a cross-origin iframe.
      markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" ' +
        'src="//about:blank" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>',
      srcAction: 'iframe_src',
      patterns: {
        youtube: { index: 'youtube.com', id: 'v=', src: '//www.youtube.com/embed/%id%?autoplay=1' },
        vimeo: { index: 'vimeo.com/', id: '/', src: '//player.vimeo.com/video/%id%?autoplay=1' },
        gmaps: { index: '//maps.google.', src: '%id%&output=embed' }
      }
    },
    gallery: {
      enabled: false,
      arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
      preload: [0, 2], navigateByImgClick: true, arrows: true,
      tPrev: 'Previous (Left arrow key)', tNext: 'Next (Right arrow key)', tCounter: '%curr% of %total%'
    }
  };

  /* Deep merge of plain objects, like $.extend(true, ...): nested option groups
   * (gallery, image, iframe.patterns, callbacks) merge, elements stay references. */
  function isPlain(o) { return Object.prototype.toString.call(o) === '[object Object]' && !o.nodeType; }
  function merge(target, src) {
    for (var k in src) {
      if (!Object.prototype.hasOwnProperty.call(src, k) || src[k] === undefined) continue;
      var v = src[k];
      if (isPlain(v)) target[k] = merge(isPlain(target[k]) ? target[k] : {}, v);
      else if (Array.isArray(v)) target[k] = v.slice();
      else target[k] = v;
    }
    return target;
  }

  function div(name, parent, html) {
    var el = document.createElement('div');
    el.className = 'mfp-' + name;
    if (html) el.innerHTML = html;
    if (parent) parent.appendChild(el);
    return el;
  }
  function classes(el, str, on) {
    String(str).split(/\s+/).forEach(function (c) { if (c) el.classList[on ? 'add' : 'remove'](c); });
  }
  function detach(el) { if (el && el.parentNode) el.parentNode.removeChild(el); }
  function query(root, sel) { try { return root.querySelector(sel); } catch (e) { return null; } }
  function lcfirst(s) { return s.charAt(0).toLowerCase() + s.slice(1); }

  /* ------------------------------------------------------------------ *
   * The popup. Magnific keeps one instance for the page; so does this, and it is
   * what `this` is inside callbacks (this.st.focus, this.st.mainClass, this.close()).
   * ------------------------------------------------------------------ */

  var mfp = { isOpen: false, items: [], index: 0 };
  var bg, wrap, container;       // created on first open, reused afterwards
  var preloaderEl;               // like Magnific, never reset once created
  var lastType, lastStatus, lastCloseType, wrapClasses;
  var sizeTimer, preloadTimer, closeTimer;
  var inlinePlaceholder, inlineHidden, inlineEl;
  var scrollbarSize;

  function fire(name, args) {
    args = args === undefined ? [] : (Array.isArray(args) ? args : [args]);
    var cbs = mfp.st && mfp.st.callbacks;
    if (cbs && typeof cbs[lcfirst(name)] === 'function') cbs[lcfirst(name)].apply(mfp, args);
    UI.emit(mfp.ev || document, 'mfp' + name, { instance: mfp, args: args });
  }

  function toMFP(cls, on) { classes(bg, cls, on); classes(wrap, cls, on); }

  function docHeight() {
    var b = document.body;
    return Math.max(b.scrollHeight, docEl.scrollHeight, b.offsetHeight, docEl.offsetHeight, docEl.clientHeight);
  }

  function getScrollbarSize() {
    if (scrollbarSize === undefined) {
      var d = document.createElement('div');
      d.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
      document.body.appendChild(d);
      scrollbarSize = d.offsetWidth - d.clientWidth;
      document.body.removeChild(d);
    }
    return scrollbarSize;
  }

  function closeBtn(type) {
    var tpl = mfp.currTemplate;
    if (type !== lastCloseType || !tpl.closeBtn) {
      tpl.closeBtn = UI.fromHTML(mfp.st.closeMarkup.replace('%title%', mfp.st.tClose));
      if (tpl.closeBtn.setAttribute) tpl.closeBtn.setAttribute('aria-label', mfp.st.tClose);
      lastCloseType = type;
    }
    return tpl.closeBtn;
  }

  function open(c) {
    // A new popup during the previous one's removalDelay: finish that close first,
    // or its timer would tear down the popup being opened.
    if (closeTimer) { clearTimeout(closeTimer); finishClose(); }

    if (c.isObj === false) {
      mfp.items = c.items.slice();
      mfp.index = Math.max(0, mfp.items.indexOf(c.el));
    } else {
      mfp.items = Array.isArray(c.items) ? c.items.slice() : [c.items];
      mfp.index = c.index || 0;
    }
    if (mfp.isOpen) { updateItemHTML(); return; }

    wrapClasses = '';
    mfp.ev = c.mainEl || document;
    mfp.popupsCache = mfp.popupsCache || {};
    mfp.currTemplate = c.key ? (mfp.popupsCache[c.key] = mfp.popupsCache[c.key] || {}) : {};
    var st = mfp.st = merge(merge({}, defaults), c);
    mfp.fixedContentPos = st.fixedContentPos === 'auto' ? !probablyMobile : st.fixedContentPos;
    if (st.modal) {
      st.closeOnContentClick = st.closeOnBgClick = st.showCloseBtn = st.enableEscapeKey = false;
    }

    if (!bg) {
      bg = div('bg');
      bg.addEventListener('click', close);
      wrap = div('wrap');
      wrap.setAttribute('tabindex', '-1');
      wrap.addEventListener('click', onWrapClick);
      container = div('container', wrap);
    }
    mfp.bgOverlay = bg; mfp.wrap = wrap; mfp.container = container;
    mfp.contentContainer = div('content');
    if (st.preloader) {
      preloaderEl = div('preloader', container, st.tLoading);
      // Links in an error message ("The image could not be loaded") stay clickable.
      preloaderEl.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('a')) e.stopPropagation();
      });
    }
    mfp.preloader = preloaderEl;
    if (st.gallery.enabled) wrapClasses += ' mfp-gallery';
    mfp.direction = true;

    fire('BeforeOpen');
    st = mfp.st;

    if (st.showCloseBtn) {
      if (st.closeBtnInside) wrapClasses += ' mfp-close-btn-in';
      else wrap.appendChild(closeBtn());
    }
    if (st.alignTop) wrapClasses += ' mfp-align-top';
    if (mfp.fixedContentPos) {
      wrap.style.overflow = st.overflowY;
      wrap.style.overflowX = 'hidden';
      wrap.style.overflowY = st.overflowY;
    } else {
      // Not fixed: the wrap is absolutely placed at the current scroll offset.
      wrap.style.top = window.pageYOffset + 'px';
      wrap.style.position = 'absolute';
    }
    if (st.fixedBgPos === false || (st.fixedBgPos === 'auto' && !mfp.fixedContentPos)) {
      bg.style.height = docHeight() + 'px';
      bg.style.position = 'absolute';
    }
    if (st.enableEscapeKey) document.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onResize);
    if (!st.closeOnContentClick) wrapClasses += ' mfp-auto-cursor';
    classes(wrap, wrapClasses, true);

    var wH = mfp.wH = docEl.clientHeight;
    var htmlCss = {};
    if (mfp.fixedContentPos && document.body.scrollHeight > wH) {
      // Hiding the page scrollbar would shift the page sideways; pad it back.
      var sb = getScrollbarSize();
      if (sb) htmlCss.marginRight = sb + 'px';
    }
    if (mfp.fixedContentPos) htmlCss.overflow = 'hidden';
    if (st.mainClass) toMFP(st.mainClass, true);

    updateItemHTML();
    buildControls();
    fire('BuildControls');
    for (var k in htmlCss) docEl.style[k] = htmlCss[k];

    var parent = (st.prependTo && UI.toElements(st.prependTo)[0]) || document.body;
    parent.insertBefore(wrap, parent.firstChild);
    parent.insertBefore(bg, wrap);

    var active = document.activeElement;
    // Safari does not focus links on click; the trigger is where focus belongs.
    mfp._lastFocusedEl = (active && active !== document.body) ? active : (st.el && st.el.focus ? st.el : active);

    // Added a frame later so CSS transitions from the initial state (mfp-fade) run.
    setTimeout(function () {
      if (!mfp.isOpen) return;
      if (mfp.content) { toMFP(READY, true); setFocus(); } else bg.classList.add(READY);
      document.addEventListener('focusin', onFocusIn);
    }, 16);

    mfp.isOpen = true;
    updateSize(wH);
    if (mfp.currItem.type === 'image' && st.image.cursor) document.body.classList.add(st.image.cursor);
    if (st.gallery.enabled) document.addEventListener('keydown', onGalleryKey);
    fire('Open');
  }

  function close() {
    if (!mfp.isOpen) return;
    fire('BeforeClose');
    mfp.isOpen = false;
    if (mfp.st.removalDelay && !UI.reducedMotion) {
      // Kept on screen with mfp-removing so the themes' fade-out CSS can play.
      toMFP(REMOVING, true);
      closeTimer = setTimeout(finishClose, mfp.st.removalDelay);
    } else {
      finishClose();
    }
  }

  function finishClose() {
    closeTimer = null;
    var st = mfp.st;
    // Module close handlers first (as Magnific's event handlers ran before callbacks).
    restoreInline();
    if (st.image.cursor) document.body.classList.remove(st.image.cursor);
    window.removeEventListener('resize', onResize);
    var frame = mfp.currTemplate && mfp.currTemplate.iframe;
    if (frame && frame.querySelector) {
      var ifr = frame.querySelector('iframe');
      if (ifr) ifr.src = '//about:blank';   // stops the video
    }
    document.removeEventListener('keydown', onGalleryKey);
    mfp.arrowLeft = mfp.arrowRight = null;
    fire('Close');

    detach(bg);
    detach(wrap);
    while (container.firstChild) container.removeChild(container.firstChild);
    toMFP(REMOVING + ' ' + READY + ' ' + (st.mainClass || ''), false);
    if (mfp.fixedContentPos) { docEl.style.marginRight = ''; docEl.style.overflow = ''; }
    document.removeEventListener('keyup', onKeyUp);
    document.removeEventListener('focusin', onFocusIn);
    wrap.className = 'mfp-wrap';
    wrap.removeAttribute('style');
    bg.className = 'mfp-bg';
    container.className = 'mfp-container';
    if (st.showCloseBtn && (!st.closeBtnInside || mfp.currTemplate[mfp.currItem.type] === true)) {
      detach(mfp.currTemplate.closeBtn);
    }
    if (st.autoFocusLast && mfp._lastFocusedEl && mfp._lastFocusedEl.focus) mfp._lastFocusedEl.focus();
    mfp.currItem = mfp.content = mfp.currTemplate = null;
    mfp.prevHeight = 0;
    fire('AfterClose');
  }

  function updateSize(winHeight) {
    if (isIOS) {
      // iOS reports the layout viewport; scale to what is actually visible.
      var h = window.innerHeight * (docEl.clientWidth / window.innerWidth);
      wrap.style.height = h + 'px';
      mfp.wH = h;
    } else {
      mfp.wH = winHeight || docEl.clientHeight;
    }
    if (!mfp.fixedContentPos) wrap.style.height = mfp.wH + 'px';
    resizeImage();
    fire('Resize');
  }

  function onResize() { updateSize(); }
  function onKeyUp(e) { if (e.keyCode === 27) close(); }
  function onGalleryKey(e) {
    if (e.keyCode === 37) prev();
    else if (e.keyCode === 39) next();
  }
  function onFocusIn(e) {
    // Keep focus inside the popup while it is open.
    if (e.target !== wrap && !wrap.contains(e.target)) setFocus();
  }
  function setFocus() {
    var el = mfp.st.focus ? (mfp.content && mfp.content.querySelector ? query(mfp.content, mfp.st.focus) : null) : wrap;
    if (el && el.focus) el.focus();
  }

  function onWrapClick(e) {
    var t = e.target;
    var g = mfp.st && mfp.st.gallery;
    if (g && g.enabled && g.navigateByImgClick && t.classList && t.classList.contains('mfp-img') &&
        mfp.items.length > 1) {
      next();
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (checkIfClose(t)) close();
  }

  function checkIfClose(t) {
    if (t.classList && t.classList.contains(PREVENT_CLOSE)) return false;
    var cc = mfp.st.closeOnContentClick, cb = mfp.st.closeOnBgClick;
    if (cc && cb) return true;
    if (!mfp.content || (t.classList && t.classList.contains('mfp-close')) ||
        (mfp.preloader && t === mfp.preloader)) return true;
    if (t === mfp.content || mfp.content.contains(t)) return !!cc;
    return !!(cb && document.contains(t));
  }

  function updateItemHTML() {
    var item = mfp.items[mfp.index];
    detach(mfp.contentContainer);
    if (mfp.content) detach(mfp.content);
    if (!item.parsed) item = parseEl(mfp.index);
    var type = item.type;
    var prevType = mfp.currItem ? mfp.currItem.type : '';
    if (prevType === 'iframe' && type !== 'iframe') blankIframe();
    fire('BeforeChange', [prevType, type]);
    mfp.currItem = item;
    if (!mfp.currTemplate[type]) {
      var markup = mfp.st[type] ? mfp.st[type].markup : false;
      fire('FirstMarkupParse', markup);
      mfp.currTemplate[type] = markup ? UI.fromHTML(markup) : true;
    }
    if (lastType && lastType !== type) container.classList.remove('mfp-' + lastType + '-holder');
    appendContent(getters[type](item, mfp.currTemplate[type]), type);
    item.preloaded = true;
    fire('Change', item);
    if (mfp.st.gallery.enabled) {
      clearTimeout(preloadTimer);
      preloadTimer = setTimeout(preloadNearbyImages, 16);
    }
    lastType = type;
    container.insertBefore(mfp.contentContainer, container.firstChild);
    fire('AfterChange');
  }

  function blankIframe() {
    var t = mfp.currTemplate && mfp.currTemplate.iframe;
    var f = t && t.querySelector && t.querySelector('iframe');
    if (f) f.src = '//about:blank';
  }

  function appendContent(content, type) {
    mfp.content = content;
    if (content) {
      // Inline content has no template of its own: the close button goes inside it.
      if (mfp.st.showCloseBtn && mfp.st.closeBtnInside && mfp.currTemplate[type] === true &&
          !content.querySelector('.mfp-close')) {
        content.appendChild(closeBtn());
      }
    } else {
      mfp.content = '';
    }
    fire('BeforeAppend');
    container.classList.add('mfp-' + type + '-holder');
    if (mfp.content) mfp.contentContainer.appendChild(mfp.content);
  }

  function parseEl(index) {
    var raw = mfp.items[index], item, type;
    if (raw.tagName) {
      item = { el: raw };
      var types = ['inline', 'image', 'iframe'];
      for (var i = 0; i < types.length; i++) {
        if (raw.classList.contains('mfp-' + types[i])) { type = types[i]; break; }
      }
      item.src = raw.getAttribute('data-mfp-src') || raw.getAttribute('href') || undefined;
    } else {
      type = raw.type;
      item = { data: raw, src: raw.src };
    }
    item.type = type || mfp.st.type || 'inline';
    item.index = index;
    item.parsed = true;
    mfp.items[index] = item;
    fire('ElementParse', item);
    return mfp.items[index];
  }

  function updateStatus(status, text) {
    if (!mfp.preloader) return;
    if (lastStatus !== status) container.classList.remove('mfp-s-' + lastStatus);
    if (!text && status === 'loading') text = mfp.st.tLoading;
    var data = { status: status, text: text };
    if (mfp.st.gallery.enabled && data.text) data.text = counterText(data.text, mfp.currItem.index);
    fire('UpdateStatus', data);
    if (data.text !== undefined) mfp.preloader.innerHTML = data.text;
    container.classList.add('mfp-s-' + data.status);
    lastStatus = data.status;
  }

  /* Fills a template: "key" sets the .mfp-key element's HTML; "key_attr" sets an
   * attribute; "key_replaceWith" swaps the element for a node (Magnific's scheme). */
  function parseMarkup(template, values, item) {
    if (item.data) values = UI.extend(item.data, values);
    if (mfp.st.gallery.enabled) {
      values.counter = mfp.items.length > 1 ? counterText(mfp.st.gallery.tCounter, item.index) : '';
    }
    if (mfp.st.showCloseBtn && mfp.st.closeBtnInside) values.close_replaceWith = closeBtn(item.type);
    fire('MarkupParse', [template, values, item]);
    Object.keys(values).forEach(function (key) {
      var val = values[key];
      if (val === undefined || val === false) return;
      var parts = key.split('_');
      var el = query(template, '.mfp-' + parts[0]);
      if (!el) return;
      if (parts.length > 1) {
        if (parts[1] === 'replaceWith') {
          if (typeof val === 'string') val = UI.fromHTML(val);
          if (el !== val) el.parentNode.replaceChild(val, el);
        } else if (parts[1] === 'img') {
          if (el.tagName === 'IMG') el.src = val;
          else {
            var img = document.createElement('img');
            img.src = val;
            img.className = el.className;
            el.parentNode.replaceChild(img, el);
          }
        } else {
          el.setAttribute(parts[1], val);
        }
      } else if (val.nodeType) {
        el.innerHTML = '';
        el.appendChild(val);
      } else {
        el.innerHTML = val;
      }
    });
  }

  function counterText(text, index) {
    return String(text).replace(/%curr%/gi, index + 1).replace(/%total%/gi, mfp.items.length);
  }

  /* ---------------- content types ---------------- */

  function restoreInline() {
    if (inlineEl) {
      inlineEl.classList.add(inlineHidden);
      var parent = inlinePlaceholder.parentNode;
      if (parent) parent.insertBefore(inlineEl, inlinePlaceholder.nextSibling);
      detach(inlinePlaceholder);
      inlineEl = null;
    }
  }

  function findInline(src) {
    if (src.nodeType) return src;
    src = String(src).trim();
    if (src.charAt(0) === '<') return UI.fromHTML(src);
    var el = query(document, src);
    // "https://site/#test-form" is not a selector (jQuery threw on it); its hash is.
    if (!el && src.indexOf('#') > 0) el = query(document, src.slice(src.indexOf('#')));
    return el;
  }

  function resizeImage() {
    var item = mfp.currItem;
    if (item && item.img && mfp.st.image.verticalFit) item.img.style.maxHeight = mfp.wH + 'px';
  }

  function onImageHasSize(item) {
    if (!item.img) return;
    item.hasSize = true;
    clearInterval(sizeTimer);
    item.isCheckingImgSize = false;
    fire('ImageHasSize', item);
    if (item.imgHidden) {
      if (mfp.content) mfp.content.classList.remove('mfp-loading');
      item.imgHidden = false;
    }
  }

  /* Shows the figure as soon as the image's dimensions are known, before it has
   * finished downloading (Magnific's polling schedule). */
  function findImageSize(item) {
    var counter = 0, img = item.img;
    function poll(interval) {
      clearInterval(sizeTimer);
      sizeTimer = setInterval(function () {
        if (img.naturalWidth > 0) { onImageHasSize(item); return; }
        if (counter > 200) clearInterval(sizeTimer);
        counter++;
        if (counter === 3) poll(10);
        else if (counter === 40) poll(50);
        else if (counter === 100) poll(500);
      }, interval);
    }
    poll(1);
  }

  var getters = {
    inline: function (item, template) {
      restoreInline();
      if (item.src) {
        var ist = mfp.st.inline;
        var el = findInline(item.src);
        if (el) {
          if (el.parentNode && el.parentNode.tagName) {
            // A placeholder keeps the element's place in the page for when it goes back.
            if (!inlinePlaceholder) {
              inlinePlaceholder = div(ist.hiddenClass);
              inlineHidden = 'mfp-' + ist.hiddenClass;
            }
            el.parentNode.insertBefore(inlinePlaceholder, el.nextSibling);
            detach(el);
            el.classList.remove(inlineHidden);
            inlineEl = el;
          }
          updateStatus('ready');
        } else {
          updateStatus('error', ist.tNotFound);
          el = document.createElement('div');
        }
        item.inlineElement = el;
        return el;
      }
      updateStatus('ready');
      if (template !== true) parseMarkup(template, {}, item);
      return template;
    },

    image: function (item, template) {
      var ist = mfp.st.image;
      var tries = 0;
      function onLoad() {
        if (!item) return;
        if (img.complete) {
          unbind();
          if (item === mfp.currItem) { onImageHasSize(item); updateStatus('ready'); }
          item.hasSize = item.loaded = true;
          fire('ImageLoadComplete');
        } else if (++tries < 200) {
          setTimeout(onLoad, 100);
        } else {
          onError();
        }
      }
      function onError() {
        if (!item) return;
        unbind();
        if (item === mfp.currItem) {
          onImageHasSize(item);
          updateStatus('error', ist.tError.replace('%url%', item.src));
        }
        item.hasSize = item.loaded = item.loadError = true;
      }
      function unbind() {
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onError);
      }

      var img;
      if (template.querySelector('.mfp-img')) {
        img = document.createElement('img');
        img.className = 'mfp-img';
        var inner = item.el && item.el.querySelector('img');
        if (inner) img.alt = inner.getAttribute('alt') || '';
        item.img = img;
        img.addEventListener('load', onLoad);
        img.addEventListener('error', onError);
        img.src = item.src;
        if (img.naturalWidth > 0) item.hasSize = true;
        else if (!img.width) item.hasSize = false;
      }

      var title = '';
      if (item.data && item.data.title !== undefined) title = item.data.title;
      else if (typeof ist.titleSrc === 'function') title = ist.titleSrc.call(mfp, item);
      else if (ist.titleSrc && item.el) title = item.el.getAttribute(ist.titleSrc) || '';
      parseMarkup(template, { title: title, img_replaceWith: item.img }, item);
      resizeImage();

      if (item.hasSize) {
        clearInterval(sizeTimer);
        if (item.loadError) {
          template.classList.add('mfp-loading');
          updateStatus('error', ist.tError.replace('%url%', item.src));
        } else {
          template.classList.remove('mfp-loading');
          updateStatus('ready');
        }
        return template;
      }
      updateStatus('loading');
      item.loading = true;
      if (!item.hasSize) {
        item.imgHidden = true;
        template.classList.add('mfp-loading');
        findImageSize(item);
      }
      return template;
    },

    iframe: function (item, template) {
      var src = item.src || '';
      var ist = mfp.st.iframe;
      var patterns = ist.patterns || {};
      // First pattern whose index occurs in the URL wins, e.g.
      // youtube.com/watch?v=ID -> //www.youtube.com/embed/ID?autoplay=1
      for (var k in patterns) {
        var p = patterns[k];
        if (!p || src.indexOf(p.index) === -1) continue;
        if (p.id) {
          src = typeof p.id === 'string'
            ? src.substr(src.lastIndexOf(p.id) + p.id.length, src.length)
            : p.id.call(p, src);
        }
        src = p.src.replace('%id%', src);
        break;
      }
      var values = {};
      if (ist.srcAction) values[ist.srcAction] = src;
      parseMarkup(template, values, item);
      updateStatus('ready');
      return template;
    }
  };

  /* ---------------- gallery ---------------- */

  function wrapIndex(i) {
    var n = mfp.items.length;
    return i > n - 1 ? i - n : (i < 0 ? n + i : i);
  }
  function next() { mfp.direction = true; mfp.index = wrapIndex(mfp.index + 1); updateItemHTML(); }
  function prev() { mfp.direction = false; mfp.index = wrapIndex(mfp.index - 1); updateItemHTML(); }
  function goTo(i) { mfp.direction = i >= mfp.index; mfp.index = i; updateItemHTML(); }

  function buildControls() {
    var g = mfp.st.gallery;
    if (!g.enabled || mfp.items.length < 2 || !g.arrows || mfp.arrowLeft) return;
    function arrow(dir, title, fn) {
      var b = UI.fromHTML(g.arrowMarkup.replace(/%title%/gi, title).replace(/%dir%/gi, dir));
      b.classList.add(PREVENT_CLOSE);
      b.setAttribute('aria-label', title);
      b.addEventListener('click', fn);
      return b;
    }
    mfp.arrowLeft = arrow('left', g.tPrev, prev);
    mfp.arrowRight = arrow('right', g.tNext, next);
    container.appendChild(mfp.arrowLeft);
    container.appendChild(mfp.arrowRight);
  }

  function preloadNearbyImages() {
    if (!mfp.isOpen) return;
    var p = mfp.st.gallery.preload, n = mfp.items.length;
    var before = Math.min(p[0], n), after = Math.min(p[1], n), i;
    for (i = 1; i <= (mfp.direction ? after : before); i++) preloadItem(mfp.index + i);
    for (i = 1; i <= (mfp.direction ? before : after); i++) preloadItem(mfp.index - i);
  }
  function preloadItem(i) {
    i = wrapIndex(i);
    var item = mfp.items[i];
    if (item.preloaded) return;
    if (!item.parsed) item = parseEl(i);
    fire('LazyLoad', item);
    if (item.type === 'image') {
      var img = new Image();
      img.onload = function () { item.hasSize = true; };
      img.onerror = function () { item.hasSize = item.loadError = true; fire('LazyLoadError', item); };
      img.src = item.src;
    }
    item.preloaded = true;
  }

  UI.extend(mfp, {
    open: open, close: close, next: next, prev: prev, goTo: goTo,
    updateSize: updateSize, updateItemHTML: updateItemHTML, updateStatus: updateStatus
  });

  /* ------------------------------------------------------------------ *
   * Triggers: $(els).magnificPopup(options)
   * ------------------------------------------------------------------ */

  function openClick(e, el, opts) {
    var midClick = opts.midClick !== undefined ? opts.midClick : defaults.midClick;
    // Modified clicks keep their browser meaning (open in a new tab, ...).
    if (!midClick && (e.button === 1 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey)) return;
    var disableOn = opts.disableOn !== undefined ? opts.disableOn : defaults.disableOn;
    if (disableOn) {
      // Narrow screens follow the link instead (e.g. straight to YouTube).
      if (typeof disableOn === 'function') { if (!disableOn.call(mfp)) return; }
      else if (docEl.clientWidth < disableOn) return;
    }
    if (!opts.isObj && !getters[opts.type || 'inline']) return;   // unsupported type: plain link
    if (e.type) {
      e.preventDefault();
      if (mfp.isOpen) e.stopPropagation();
    }
    // An inline popup whose target doesn't exist (a link left at "#"): Magnific
    // cancelled the click and then threw looking it up, so nothing happened.
    // Do the same without the error, rather than opening an empty popup.
    if (!opts.isObj && !opts.delegate && (opts.type || 'inline') === 'inline' && el) {
      var src = el.getAttribute('data-mfp-src') || el.getAttribute('href') || '';
      if (!src || src === '#' || !findInline(src)) return;
    }
    opts.el = el;
    if (opts.delegate) {
      var found = [];
      opts.mainEls.forEach(function (m) {
        found = found.concat(UI.toElements(m.querySelectorAll(opts.delegate)));
      });
      opts.items = found;
    }
    open(opts);
  }

  function onTriggerClick(e) {
    var host = e.currentTarget, opts = host.__clMagnific;
    if (!opts) return;
    var el = host;
    if (opts.delegate) {
      el = e.target.closest ? e.target.closest(opts.delegate) : null;
      if (!el || el === host || !host.contains(el)) return;
    }
    openClick(e, el, opts);
  }

  function command(els, cmd, args) {
    if (cmd === 'open') {
      var el = els[0], opts = el && el.__clMagnific;
      if (!opts) return;
      var i = parseInt(args[0], 10) || 0;
      if (opts.isObj) opts.index = i;
      var list = opts.isObj ? [] : (opts.delegate ? UI.toElements(el.querySelectorAll(opts.delegate)) : opts.items);
      openClick({}, list[i], opts);
    } else if (mfp.isOpen && typeof mfp[cmd] === 'function') {
      mfp[cmd].apply(mfp, args);
    }
  }

  function bind(els, options, out) {
    // One options object shared by the call's elements, as Magnific stored it.
    var opts = merge({}, options || {});
    opts.mainEls = els;
    opts.mainEl = els[0];
    if (opts.items) opts.isObj = true;
    else {
      opts.isObj = false;
      if (!opts.delegate) opts.items = els;
    }
    els.forEach(function (el) {
      // A later call on the same element replaces its options (Magnific's
      // off().on()); the listener itself is only ever added once.
      el.__clMagnific = opts;
      if (!el.hasAttribute('data-cl-magnific')) {
        el.setAttribute('data-cl-magnific', '');
        el.addEventListener('click', onTriggerClick);
      }
      out.push({
        el: el,
        options: opts,
        popup: mfp,
        open: function (index) { command([el], 'open', [index]); },
        close: close
      });
    });
  }

  UI.magnific = function (target, options) {
    var out = [], args = Array.prototype.slice.call(arguments, 2);
    UI.ready(function () {
      var els = UI.toElements(target);
      if (!els.length) return;
      if (typeof options === 'string') command(els, options, args);
      else bind(els, options, out);
    });
    return out;
  };
  /** $.magnificPopup.open(options, index) */
  UI.magnific.open = function (options, index) {
    var c = merge({}, options || {});
    c.isObj = true;
    c.index = index || 0;
    open(c);
    return mfp;
  };
  /** $.magnificPopup.close() */
  UI.magnific.close = function () { close(); };
  UI.magnific.instance = mfp;
  UI.magnific.defaults = defaults;


  /* ------------------------------------------------------------------ *
   * Simple Lightbox 1.x: $(items).simpleLightbox(options)
   *
   * Same .slbElement DOM, classes and timing (loading text after 100 ms, image
   * shown once loaded, next image preloaded), so simpleLightbox.css renders it
   * unchanged. Additions: focus goes back to the clicked link on close, and
   * buttons get aria-labels.
   * ------------------------------------------------------------------ */

  var slbDefaults = {
    elementClass: '', elementLoadingClass: 'slbLoading', htmlClass: 'slbActive',
    closeBtnClass: '', nextBtnClass: '', prevBtnClass: '', loadingTextClass: '',
    closeBtnCaption: 'Close', nextBtnCaption: 'Next', prevBtnCaption: 'Previous',
    loadingCaption: 'Loading...', bindToItems: true, closeOnOverlayClick: true,
    closeOnEscapeKey: true, nextOnImageClick: true, showCaptions: true,
    captionAttribute: 'title', urlAttribute: 'href', startAt: 0, loadingTimeout: 100,
    appendTarget: 'body', beforeSetContent: null, beforeClose: null, beforeDestroy: null,
    videoRegex: /youtube.com|vimeo.com/
  };

  function SLB(options) {
    var self = this;
    this.options = UI.extend({}, slbDefaults, options);
    this.items = [];
    this.captions = [];
    var o = this.options;
    if (o.$items) {
      this.$items = o.$items;
      o.$items.forEach(function (el) {
        self.items.push(el.getAttribute(o.urlAttribute));
        self.captions.push(el.getAttribute(o.captionAttribute));
      });
    } else if (o.items) {
      this.items = o.items;
    }
    if (o.captions) this.captions = o.captions;
    this._onKey = function (e) { self.onKey(e); };
    this._onResize = function () { self.setImageDimensions(); };
    this._onClick = function (e) { self.onClick(e); };
  }

  SLB.prototype = {
    next: function () { return this.showPosition(this.currentPosition + 1); },
    prev: function () { return this.showPosition(this.currentPosition - 1); },
    normalizePosition: function (p) {
      if (p >= this.items.length) return 0;
      return p < 0 ? this.items.length - 1 : p;
    },
    showPosition: function (p) {
      this.currentPosition = this.normalizePosition(p);
      return this.setupLightboxHtml().prepareItem(this.currentPosition, this.setContent).show();
    },
    loading: function (on) {
      var self = this, o = this.options;
      if (on) {
        this.loadingTimer = setTimeout(function () {
          self.el.classList.add(o.elementLoadingClass);
          self.content.innerHTML = '<p class="slbLoadingText ' + o.loadingTextClass + '">' + o.loadingCaption + '</p>';
          self.show();
        }, o.loadingTimeout);
      } else {
        if (this.el) this.el.classList.remove(o.elementLoadingClass);
        clearTimeout(this.loadingTimer);
      }
    },
    prepareItem: function (pos, done) {
      var self = this, url = this.items[pos];
      this.loading(true);
      if (this.options.videoRegex.test(url)) {
        var v = UI.fromHTML('<div class="slbIframeCont"><iframe class="slbIframe" frameborder="0" allowfullscreen></iframe></div>');
        v.firstChild.src = url;
        done.call(this, v);
      } else {
        var wrapEl = UI.fromHTML('<div class="slbImageWrap"><img class="slbImage"></div>');
        this.currentImage = wrapEl.firstChild;
        this.currentImage.src = url;
        if (this.options.showCaptions && this.captions[pos]) {
          var cap = document.createElement('div');
          cap.className = 'slbCaption';
          cap.innerHTML = this.captions[pos];
          wrapEl.appendChild(cap);
        }
        this.loadImage(url, function () {
          self.setImageDimensions();
          done.call(self, wrapEl);
          self.loadImage(self.items[self.normalizePosition(self.currentPosition + 1)]);
        });
      }
      return this;
    },
    loadImage: function (url, cb) {
      if (this.options.videoRegex.test(url)) return;
      var img = new Image();
      if (cb) img.onload = cb;
      img.src = url;
    },
    setupLightboxHtml: function () {
      var o = this.options;
      if (!this.el) {
        this.el = UI.fromHTML('<div class="slbElement ' + o.elementClass + '"><div class="slbOverlay"></div>' +
          '<div class="slbWrapOuter"><div class="slbWrap"><div class="slbContentOuter"><div class="slbContent"></div>' +
          '<button type="button" title="' + o.closeBtnCaption + '" aria-label="' + o.closeBtnCaption +
          '" class="slbCloseBtn ' + o.closeBtnClass + '">×</button></div></div></div></div>');
        if (this.items.length > 1) {
          this.el.querySelector('.slbContentOuter').appendChild(UI.fromHTML('<div class="slbArrows">' +
            '<button type="button" title="' + o.prevBtnCaption + '" class="prev slbArrow' + o.prevBtnClass + '">' +
            o.prevBtnCaption + '</button><button type="button" title="' + o.nextBtnCaption +
            '" class="next slbArrow' + o.nextBtnClass + '">' + o.nextBtnCaption + '</button></div>'));
        }
        this.content = this.el.querySelector('.slbContent');
      }
      this.content.innerHTML = '';
      return this;
    },
    show: function () {
      if (!this.modalInDom) {
        (UI.toElements(this.options.appendTarget)[0] || document.body).appendChild(this.el);
        docEl.classList.add(this.options.htmlClass);
        this.setupLightboxEvents();
        this.modalInDom = true;
      }
      return this;
    },
    setContent: function (node) {
      if (typeof node === 'string') node = UI.fromHTML(node);
      this.loading(false);
      this.setupLightboxHtml();
      if (this.options.beforeSetContent) this.options.beforeSetContent(node, this);
      this.content.innerHTML = '';
      this.content.appendChild(node);
      return this;
    },
    setImageDimensions: function () {
      if (this.currentImage) this.currentImage.style.maxHeight = docEl.clientHeight + 'px';
    },
    onClick: function (e) {
      var t = e.target, cl = t.classList, o = this.options;
      if (!cl) return;
      if (cl.contains('slbCloseBtn') || (o.closeOnOverlayClick && cl.contains('slbWrap'))) this.close();
      else if (cl.contains('slbArrow')) { if (cl.contains('next')) this.next(); else this.prev(); }
      else if (o.nextOnImageClick && this.items.length > 1 && cl.contains('slbImage')) this.next();
    },
    onKey: function (e) {
      var k = e.keyCode;
      if (this.options.closeOnEscapeKey && k === 27) this.close();
      if (this.items.length > 1) {
        if (k === 39 || k === 68) this.next();
        if (k === 37 || k === 65) this.prev();
      }
    },
    setupLightboxEvents: function () {
      if (this.eventsOn) return;
      this.el.addEventListener('click', this._onClick);
      document.addEventListener('keyup', this._onKey);
      window.addEventListener('resize', this._onResize);
      this.eventsOn = true;
    },
    close: function () {
      if (!this.modalInDom) return;
      if (this.options.beforeClose) this.options.beforeClose(this);
      this.el.removeEventListener('click', this._onClick);
      document.removeEventListener('keyup', this._onKey);
      window.removeEventListener('resize', this._onResize);
      this.eventsOn = false;
      detach(this.el);
      docEl.classList.remove(this.options.htmlClass);
      this.modalInDom = false;
      if (this.trigger && this.trigger.focus) this.trigger.focus();
    },
    destroy: function () {
      this.close();
      if (this.options.beforeDestroy) this.options.beforeDestroy(this);
      var self = this;
      if (this.$items) this.$items.forEach(function (el) { el.removeEventListener('click', self._onItem); });
      detach(this.el);
    }
  };

  UI.simpleLightbox = function (target, options) {
    var out = [];
    UI.ready(function () {
      var els = UI.toElements(target);
      var fresh = els.filter(function (el) { return !el.hasAttribute('data-cl-slb'); });
      if (!fresh.length) return;
      var inst = new SLB(UI.extend({}, options, { $items: els }));
      inst._onItem = function (e) {
        e.preventDefault();
        inst.trigger = e.currentTarget;
        inst.showPosition(els.indexOf(e.currentTarget));
      };
      fresh.forEach(function (el) {
        el.setAttribute('data-cl-slb', '');
        if (inst.options.bindToItems) el.addEventListener('click', inst._onItem);
        out.push(inst);
      });
    });
    return out;
  };
  /** $.SimpleLightbox.open(options) */
  UI.simpleLightbox.open = function (options) {
    var inst = new SLB(options);
    return options && options.content ? inst.setContent(options.content).show() : inst.showPosition(inst.options.startAt);
  };
}());

/* ColorlibUI module: ajaxchimp — replaces jquery.ajaxchimp. A Mailchimp embed
 * form posts to .../subscribe/post?u=..&id=..; like the plugin, this turns it into
 * a JSONP request to .../subscribe/post-json?u=..&id=..&c=<callback> (Mailchimp
 * sends no CORS headers, so JSONP is still the only way to read the answer), stops
 * the normal submit and writes the result into the form's `.info` element with the
 * `valid` / `error` classes on it and on the email input. The JSONP call is a
 * script tag with a one-off global callback and a timeout. */
(function () {
  'use strict';
  var UI = window.ColorlibUI;
  if (!UI) return;

  var SUCCESS = 'We have sent you a confirmation email';
  var seq = 0;
  var cacheBust = Date.now();
  var SHOW_PROPS = ['height', 'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom',
    'width', 'marginLeft', 'marginRight', 'paddingLeft', 'paddingRight'];

  /** jQuery's form.serializeArray(), folded into an object (last value wins). */
  function serialize(form) {
    var data = {};
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.disabled || el.matches(':disabled')) return;
      if (!/^(?:input|select|textarea|keygen)/i.test(el.nodeName)) return;
      if (/^(?:submit|button|image|reset|file)$/i.test(el.type)) return;
      if (/^(?:checkbox|radio)$/i.test(el.type) && !el.checked) return;
      if (el.nodeName === 'SELECT' && el.multiple) {
        Array.prototype.forEach.call(el.options, function (o) { if (o.selected) data[el.name] = o.value; });
        return;
      }
      if (el.nodeName === 'SELECT' && el.selectedIndex < 0) return;
      data[el.name] = el.value.replace(/\r?\n/g, '\r\n');
    });
    return data;
  }

  function param(data) {
    return Object.keys(data).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k] == null ? '' : data[k]);
    }).join('&');
  }

  /** JSONP like jQuery's: url's `c=?` becomes the callback name; data and `_=` are appended. */
  function jsonp(url, data, success, error) {
    var name = 'ColorlibUIChimp_' + (++seq) + '_' + Date.now();
    var script = document.createElement('script');
    var called = false, timer;
    function cleanup(answered) {
      clearTimeout(timer);
      // After a timeout or error a late reply may still arrive: leave it a no-op to call.
      if (answered) { try { delete window[name]; } catch (e) { window[name] = undefined; } }
      else window[name] = function () {};
      if (script.parentNode) script.parentNode.removeChild(script);
    }
    window[name] = function (resp) { called = true; cleanup(true); success(resp); };
    url = url.replace(/(=)\?(?=&|$)|\?\?/, '$1' + name);
    var qs = param(data);
    if (qs) url += (/\?/.test(url) ? '&' : '?') + qs;
    url += (/\?/.test(url) ? '&' : '?') + '_=' + (cacheBust++);
    script.async = true;
    script.src = url;
    script.onload = function () { if (!called) { cleanup(); error('parsererror'); } };
    script.onerror = function () { cleanup(); error('error'); };
    timer = setTimeout(function () { cleanup(); error('timeout'); }, 15000);
    document.head.appendChild(script);
  }

  /** jQuery's show(2000): a hidden element grows and fades in; a visible one is left alone. */
  function show(el, ms) {
    if (getComputedStyle(el).display !== 'none') return;
    el.style.display = '';
    if (getComputedStyle(el).display === 'none') el.style.display = 'block';
    if (UI.reducedMotion) return;
    var cs = getComputedStyle(el), full = {}, start = null;
    SHOW_PROPS.forEach(function (p) { full[p] = parseFloat(cs[p]) || 0; });
    var opacity = parseFloat(cs.opacity);
    el.style.overflow = 'hidden';
    function apply(e) {
      SHOW_PROPS.forEach(function (p) { el.style[p] = full[p] * e + 'px'; });
      el.style.opacity = String(opacity * e);
    }
    apply(0);
    requestAnimationFrame(function frame(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / ms, 1);
      apply(0.5 - Math.cos(p * Math.PI) / 2);
      if (p < 1) { requestAnimationFrame(frame); return; }
      SHOW_PROPS.forEach(function (prop) { el.style[prop] = ''; });
      el.style.opacity = '';
      el.style.overflow = '';
    });
  }

  function each(list, fn) { Array.prototype.forEach.call(list, fn); }
  function swap(list, remove, add) {
    each(list, function (el) { el.classList.remove(remove); el.classList.add(add); });
  }

  function translate(language, key) {
    var t = UI.ajaxChimp.translations;
    return language !== 'en' && t && t[language] && t[language][key] ? t[language][key] : null;
  }

  function init(form, options) {
    var emails = form.querySelectorAll('input[type=email]');
    var labels = form.querySelectorAll('.info');
    var s = UI.extend({ url: form.getAttribute('action'), language: 'en' }, options);
    if (!s.url) return null;
    var url = s.url.replace('/post?', '/post-json?').concat('&c=?');

    form.setAttribute('novalidate', 'true');
    each(emails, function (e) { e.setAttribute('name', 'EMAIL'); });

    function setLabel(html) {
      each(labels, function (l) { l.innerHTML = html; show(l, 2000); });
    }

    function onResponse(resp) {
      var msg;
      if (resp.result === 'success') {
        msg = SUCCESS;
        swap(labels, 'error', 'valid');
        swap(emails, 'error', 'valid');
      } else {
        swap(emails, 'valid', 'error');
        swap(labels, 'valid', 'error');
        // Mailchimp prefixes field errors with the field index: "0 - Please enter a value".
        try {
          var parts = resp.msg.split(' - ', 2);
          msg = parts[1] !== undefined && parseInt(parts[0], 10).toString() === parts[0] ? parts[1] : resp.msg;
        } catch (e) {
          msg = resp.msg;
        }
      }
      var code = UI.ajaxChimp.responses[msg];
      if (code !== undefined) msg = translate(s.language, code) || msg;
      setLabel(msg);
      if (s.callback) s.callback(resp);
      UI.emit(form, 'ajaxchimp:response', resp);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();
      jsonp(url, serialize(form), onResponse, function (text) {
        if (window.console) console.log('mailchimp ajax submit error: ' + text);
      });
      setLabel(translate(s.language, 'submit') || 'Submitting...');
    });
    return { form: form, settings: s };
  }

  /** $(form).ajaxChimp(options) → ColorlibUI.ajaxChimp(form, options). */
  UI.ajaxChimp = function (target, options) {
    var out = [];
    UI.toElements(target).forEach(function (form) {
      if (form._clAjaxChimp) { out.push(form._clAjaxChimp); return; }
      var inst = init(form, options);
      if (!inst) return;
      form._clAjaxChimp = inst;
      form.setAttribute('data-cl-ajaxchimp', '1');
      out.push(inst);
    });
    return out;
  };
  UI.ajaxChimp.responses = {
    'We have sent you a confirmation email': 0,
    'Please enter a valid email': 1,
    'An email address must contain a single @': 2,
    'The domain portion of the email address is invalid (the portion after the @: )': 3,
    'The username portion of the email address is invalid (the portion before the @: )': 4,
    'This email address looks fake or invalid. Please enter a real email address': 5
  };
  UI.ajaxChimp.translations = { en: null };
  UI.ajaxChimp.init = function (selector, options) { return UI.ajaxChimp(selector, options); };
}());

/* ColorlibUI module: datepicker — replaces the Gijgo 1.9 datepicker/timepicker
 * (~180-250 KB of JS per theme) with the browser's own date and time pickers.
 * The field keeps Gijgo's markup, which the themes style
 * (div[role=wrapper].gj-datepicker.gj-datepicker-md > input.gj-textbox-md +
 * i.gj-icon[role=right-icon]), so it renders exactly as before while idle. It stays
 * a text field showing its placeholder until it is used: on focus it becomes
 * type="date" (or "time") and the native picker opens; left empty, it turns back
 * into a text field so the placeholder shows again. Differences: the calendar
 * is the browser's, and the submitted value is yyyy-mm-dd (HH:MM for times)
 * instead of Gijgo's mm/dd/yyyy. Gijgo options are accepted and ignored, except
 * icons.rightIcon (custom icon markup). { wrap: false } leaves the input
 * unwrapped, for the themes that used jQuery UI's datepicker instead of Gijgo. */
(function () {
  'use strict';
  var UI = window.ColorlibUI;
  if (!UI) return;

  var styled = false;
  /** Gijgo's icon is the picker button, so the browser's own indicator is hidden next to it. */
  function injectStyle() {
    if (styled) return;
    styled = true;
    var s = document.createElement('style');
    s.textContent = '.gj-datepicker [role=input]::-webkit-calendar-picker-indicator,' +
      '.gj-timepicker [role=input]::-webkit-calendar-picker-indicator{display:none}' +
      '.gj-datepicker [role=right-icon],.gj-timepicker [role=right-icon]{cursor:pointer}';
    (document.head || document.documentElement).appendChild(s);
  }

  function toISO(value, kind) {
    if (kind !== 'date') return value;
    var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value); // Gijgo's mm/dd/yyyy
    if (!m) return value;
    return m[3] + '-' + ('0' + m[1]).slice(-2) + '-' + ('0' + m[2]).slice(-2);
  }

  function Picker(input, options, kind) {
    var self = this;
    var o = options || {};
    self.input = input;
    self.kind = kind;
    var prefix = kind === 'date' ? 'gj-datepicker' : 'gj-timepicker';

    if (o.wrap !== false) {
      injectStyle();
      var wrapper = input.parentNode && input.parentNode.getAttribute && input.parentNode.getAttribute('role') === 'wrapper'
        ? input.parentNode : null;
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.setAttribute('role', 'wrapper');
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
      }
      wrapper.classList.add(prefix, prefix + '-md', 'gj-unselectable');
      if (o.width) wrapper.style.width = typeof o.width === 'number' ? o.width + 'px' : o.width;
      input.classList.add('gj-textbox-md');
      input.setAttribute('role', 'input');
      var icon;
      if (o.icons && o.icons.rightIcon) {
        icon = UI.fromHTML(o.icons.rightIcon);
        if (icon.nodeType !== 1) { var i = document.createElement('i'); i.appendChild(icon); icon = i; }
      } else {
        icon = document.createElement('i');
        icon.className = kind === 'date' ? 'gj-icon' : 'gj-icon clock';
        if (kind === 'date') icon.textContent = 'event'; // the icon font draws this ligature
      }
      icon.setAttribute('role', 'right-icon');
      icon.setAttribute('aria-hidden', 'true');
      wrapper.appendChild(icon);
      icon.addEventListener('click', function () { input.focus(); self.open(); });
      self.wrapper = wrapper;
      self.icon = icon;
    } else {
      input.classList.add('hasDatepicker');
    }

    // Idle it is a text field (placeholder visible); in use it is the native control.
    if (input.value) self._native();
    input.addEventListener('focus', function () { self._native(); });
    input.addEventListener('click', function () { self.open(); });
    input.addEventListener('blur', function () {
      if (!input.value) input.type = 'text';
    });
  }

  Picker.prototype._native = function () {
    var input = this.input;
    if (input.type === this.kind) return;
    var v = input.value;
    input.type = this.kind;
    if (v) input.value = toISO(v, this.kind);
  };

  Picker.prototype.open = function () {
    this._native();
    // Needs a user gesture; keyboard users can still type the value or press the picker key.
    try { if (this.input.showPicker) this.input.showPicker(); } catch (e) { /* not allowed here */ }
    return this;
  };
  Picker.prototype.close = function () { return this; };
  Picker.prototype.value = function (v) {
    if (v === undefined) return this.input.value;
    this._native();
    this.input.value = toISO(String(v), this.kind);
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
    return this;
  };
  Picker.prototype.destroy = function () {
    var input = this.input, w = this.wrapper;
    if (w) {
      if (this.icon && this.icon.parentNode) this.icon.parentNode.removeChild(this.icon);
      w.parentNode.insertBefore(input, w);
      w.parentNode.removeChild(w);
      input.classList.remove('gj-textbox-md');
      input.removeAttribute('role');
    }
    input.removeAttribute('data-cl-picker');
    input._clPicker = null;
  };

  function make(kind) {
    return function (target, options) {
      var out = [];
      UI.toElements(target).forEach(function (input) {
        if (!input._clPicker) {
          input._clPicker = new Picker(input, options, kind);
          input.setAttribute('data-cl-picker', kind);
        }
        out.push(input._clPicker);
      });
      return out;
    };
  }

  /** $(input).datepicker(options) → ColorlibUI.datepicker(input, options). */
  UI.datepicker = make('date');
  /** $(input).timepicker(options) → ColorlibUI.timepicker(input, options). */
  UI.timepicker = make('time');
}());
