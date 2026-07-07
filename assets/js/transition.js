/**
 * 共享页面转场特效系统 v3
 * 高级转场：景深虚化 + 光圈收缩 + 毛玻璃推移
 */
(function () {
    var style = document.createElement('style');
    style.textContent = `
    .pt-overlay {
        position: fixed; inset: 0; z-index: 99999;
        pointer-events: none; will-change: transform, opacity, backdrop-filter, clip-path;
        display: flex; align-items: center; justify-content: center;
        overflow: hidden;
    }

    /* === curtain: 深度景深虚化 + 中心光晕扩散（加载页→主页）=== */
    .pt-curtain {
        opacity: 0;
        backdrop-filter: blur(0px) brightness(1);
        background: radial-gradient(circle at 50% 50%, rgba(255,107,157,0.08) 0%, rgba(196,77,255,0.05) 50%, transparent 100%);
        transition: opacity .5s ease, backdrop-filter .5s ease, background .5s ease;
    }
    .pt-curtain.pt-in {
        opacity: 1;
        backdrop-filter: blur(40px) brightness(1.15);
        background: radial-gradient(circle at 50% 50%, rgba(255,107,157,0.2) 0%, rgba(196,77,255,0.12) 50%, rgba(107,197,255,0.05) 100%);
    }
    .pt-curtain.pt-out {
        opacity: 0;
        backdrop-filter: blur(0px) brightness(1);
        background: radial-gradient(circle at 50% 50%, rgba(255,107,157,0) 0%, transparent 100%);
        transition: opacity .55s ease, backdrop-filter .55s ease, background .55s ease;
    }

    /* === iris: 光圈收缩/扩散（主页↔恋爱碎忆）=== */
    .pt-iris {
        clip-path: circle(0% at 50% 50%);
        backdrop-filter: blur(0px);
        background: radial-gradient(circle at 50% 50%, rgba(255,182,193,0.3) 0%, rgba(221,160,221,0.2) 60%, rgba(179,229,252,0.1) 100%);
        transition: clip-path .6s cubic-bezier(.65,0,.35,1), backdrop-filter .6s ease;
    }
    .pt-iris.pt-in {
        clip-path: circle(150% at 50% 50%);
        backdrop-filter: blur(30px);
    }
    .pt-iris.pt-out {
        clip-path: circle(0% at 50% 50%);
        backdrop-filter: blur(0px);
        background: radial-gradient(circle at 50% 50%, rgba(255,182,193,0) 0%, transparent 100%);
        transition: clip-path .6s cubic-bezier(.65,0,.35,1), backdrop-filter .6s ease;
    }

    /* === fade-blur: 深度虚化渐变（主页→登录页）=== */
    .pt-fade-blur {
        opacity: 0;
        backdrop-filter: blur(0px) brightness(1) saturate(1);
        background: rgba(20, 20, 30, 0);
        transition: opacity .5s ease, backdrop-filter .5s ease, background .5s ease;
    }
    .pt-fade-blur.pt-in {
        opacity: 1;
        backdrop-filter: blur(35px) brightness(0.7) saturate(0.8);
        background: rgba(20, 20, 30, 0.3);
    }
    .pt-fade-blur.pt-out {
        opacity: 0;
        backdrop-filter: blur(0px) brightness(1) saturate(1);
        background: rgba(20, 20, 30, 0);
        transition: opacity .55s ease, backdrop-filter .55s ease, background .55s ease;
    }

    /* === slide-right: 毛玻璃从左推移（主页→树洞）=== */
    .pt-slide-right {
        backdrop-filter: blur(0px);
        background: rgba(255, 240, 245, 0);
        transform: translateX(-100%);
        transition: transform .55s cubic-bezier(.7,0,.3,1), backdrop-filter .55s ease, background .55s ease;
    }
    .pt-slide-right.pt-in {
        transform: translateX(0);
        backdrop-filter: blur(25px);
        background: rgba(255, 240, 245, 0.2);
    }
    .pt-slide-right.pt-out {
        transform: translateX(-100%);
        backdrop-filter: blur(0px);
        background: rgba(255, 240, 245, 0);
    }

    /* === slide-left: 毛玻璃从右推移（树洞→主页）=== */
    .pt-slide-left {
        backdrop-filter: blur(0px);
        background: rgba(255, 240, 245, 0);
        transform: translateX(100%);
        transition: transform .55s cubic-bezier(.7,0,.3,1), backdrop-filter .55s ease, background .55s ease;
    }
    .pt-slide-left.pt-in {
        transform: translateX(0);
        backdrop-filter: blur(25px);
        background: rgba(255, 240, 245, 0.2);
    }
    .pt-slide-left.pt-out {
        transform: translateX(100%);
        backdrop-filter: blur(0px);
        background: rgba(255, 240, 245, 0);
    }

    /* === slide-up: 毛玻璃从底上推（主页→动漫推荐）=== */
    .pt-slide-up {
        backdrop-filter: blur(0px);
        background: rgba(227, 242, 253, 0);
        transform: translateY(100%);
        transition: transform .55s cubic-bezier(.7,0,.3,1), backdrop-filter .55s ease, background .55s ease;
    }
    .pt-slide-up.pt-in {
        transform: translateY(0);
        backdrop-filter: blur(25px);
        background: rgba(227, 242, 253, 0.2);
    }
    .pt-slide-up.pt-out {
        transform: translateY(-100%);
        backdrop-filter: blur(0px);
        background: rgba(227, 242, 253, 0);
    }

    /* === slide-down: 毛玻璃从顶下推（动漫推荐→主页）=== */
    .pt-slide-down {
        backdrop-filter: blur(0px);
        background: rgba(227, 242, 253, 0);
        transform: translateY(-100%);
        transition: transform .55s cubic-bezier(.7,0,.3,1), backdrop-filter .55s ease, background .55s ease;
    }
    .pt-slide-down.pt-in {
        transform: translateY(0);
        backdrop-filter: blur(25px);
        background: rgba(227, 242, 253, 0.2);
    }
    .pt-slide-down.pt-out {
        transform: translateY(100%);
        backdrop-filter: blur(0px);
        background: rgba(227, 242, 253, 0);
    }

    /* === zoom: 毛玻璃缩放（次元树→主页）=== */
    .pt-zoom {
        opacity: 0;
        backdrop-filter: blur(0px);
        background: rgba(99, 102, 241, 0);
        transform: scale(1.8);
        transition: opacity .5s ease, backdrop-filter .5s ease, background .5s ease, transform .5s ease;
    }
    .pt-zoom.pt-in {
        opacity: 1;
        backdrop-filter: blur(30px);
        background: rgba(99, 102, 241, 0.12);
        transform: scale(1);
    }
    .pt-zoom.pt-out {
        opacity: 0;
        backdrop-filter: blur(0px);
        background: rgba(99, 102, 241, 0);
        transform: scale(0.6);
        transition: opacity .55s ease, backdrop-filter .55s ease, background .55s ease, transform .55s ease;
    }

    /* === book: 书本翻页效果 === */
    .pt-book-overlay { display: flex !important; }
    .pt-book-page {
        position: absolute; top: 0; bottom: 0; width: 50%;
        background: linear-gradient(135deg, #faf3e0, #f0e6d2);
        box-shadow: 0 0 40px rgba(0,0,0,0.2);
        transition: transform 1.5s cubic-bezier(.65,0,.35,1);
    }
    .pt-book-page.left { left: 0; transform-origin: left center; border-right: 1px solid rgba(0,0,0,0.08); }
    .pt-book-page.right { right: 0; transform-origin: right center; border-left: 1px solid rgba(0,0,0,0.08); }
    /* 书页纹理 */
    .pt-book-page::after {
        content: ''; position: absolute; inset: 0;
        background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139,69,19,0.03) 3px, rgba(139,69,19,0.03) 4px);
    }
    /* 书脊阴影 */
    .pt-book-page.left::before {
        content: ''; position: absolute; top: 0; bottom: 0; right: 0; width: 20px;
        background: linear-gradient(to right, transparent, rgba(0,0,0,0.15));
    }
    .pt-book-page.right::before {
        content: ''; position: absolute; top: 0; bottom: 0; left: 0; width: 20px;
        background: linear-gradient(to left, transparent, rgba(0,0,0,0.15));
    }

    /* book-open: 书本从合上→翻开（离场，进入列表页）*/
    .pt-book-open .pt-book-page.left { transform: rotateY(0deg) translateX(0); }
    .pt-book-open .pt-book-page.right { transform: rotateY(0deg) translateX(0); }
    .pt-book-open.pt-in .pt-book-page.left { transform: perspective(1200px) rotateY(-180deg); }
    .pt-book-open.pt-in .pt-book-page.right { transform: perspective(1200px) rotateY(180deg); }
    /* 入场时书页保持翻开，整体快速淡出 */
    .pt-book-open.pt-out .pt-book-page.left { transform: perspective(1200px) rotateY(-180deg); }
    .pt-book-open.pt-out .pt-book-page.right { transform: perspective(1200px) rotateY(180deg); }
    .pt-book-open.pt-out { opacity: 0; transition: opacity .4s ease; }

    /* book-close: 书本从翻开→合上（离场，返回主页）*/
    .pt-book-close .pt-book-page.left { transform: perspective(1200px) rotateY(-180deg); }
    .pt-book-close .pt-book-page.right { transform: perspective(1200px) rotateY(180deg); }
    .pt-book-close.pt-in .pt-book-page.left { transform: rotateY(0deg) translateX(0); }
    .pt-book-close.pt-in .pt-book-page.right { transform: rotateY(0deg) translateX(0); }
    /* 入场时书页保持合上，整体快速淡出 */
    .pt-book-close.pt-out .pt-book-page.left { transform: rotateY(0deg) translateX(0); }
    .pt-book-close.pt-out .pt-book-page.right { transform: rotateY(0deg) translateX(0); }
    .pt-book-close.pt-out { opacity: 0; transition: opacity .4s ease; }
    `;
    document.head.appendChild(style);

    // 离场转场
    window.transitionTo = function (url, type) {
        var overlay = document.createElement('div');
        overlay.className = 'pt-overlay pt-' + type;
        document.body.appendChild(overlay);

        // 书本翻页效果：创建左右两个书页
        if (type === 'book-open' || type === 'book-close') {
            overlay.classList.add('pt-book-overlay');
            var leftPage = document.createElement('div');
            leftPage.className = 'pt-book-page left';
            var rightPage = document.createElement('div');
            rightPage.className = 'pt-book-page right';
            overlay.appendChild(leftPage);
            overlay.appendChild(rightPage);
        }

        requestAnimationFrame(function () {
            overlay.classList.add('pt-in');
        });

        var separator = url.indexOf('#') !== -1 ? '' : '#pt=' + type;
        setTimeout(function () {
            window.location.href = url + separator;
        }, type === 'book-open' || type === 'book-close' ? 1520 : 580);
    };

    // 入场转场
    function playEntry() {
        var match = window.location.hash.match(/pt=(\w[\w-]*)/);
        if (!match) return;
        var type = match[1];
        var overlay = document.createElement('div');
        overlay.className = 'pt-overlay pt-' + type + ' pt-in';
        document.body.appendChild(overlay);

        // 书本翻页：创建左右书页
        if (type === 'book-open' || type === 'book-close') {
            overlay.classList.add('pt-book-overlay');
            var leftPage = document.createElement('div');
            leftPage.className = 'pt-book-page left';
            var rightPage = document.createElement('div');
            rightPage.className = 'pt-book-page right';
            overlay.appendChild(leftPage);
            overlay.appendChild(rightPage);
        }

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                overlay.classList.remove('pt-in');
                overlay.classList.add('pt-out');
            });
        });
        setTimeout(function () { overlay.remove(); }, (type === 'book-open' || type === 'book-close') ? 1560 : 620);
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', playEntry);
    } else {
        playEntry();
    }
})();
