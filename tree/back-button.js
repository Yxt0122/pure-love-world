/**
 * 次元树返回主页按钮
 */
(function() {
    // 创建返回按钮
    const backBtn = document.createElement('button');
    backBtn.id = 'tree-back-btn';
    backBtn.innerHTML = '← 返回主页';
    backBtn.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 10000;
        padding: 12px 24px;
        background: rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 24px;
        color: #333;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        font-family: 'Segoe UI', sans-serif;
    `;

    // 悬停效果
    backBtn.addEventListener('mouseenter', () => {
        backBtn.style.background = 'rgba(255, 255, 255, 0.4)';
        backBtn.style.transform = 'translateX(-4px)';
    });

    backBtn.addEventListener('mouseleave', () => {
        backBtn.style.background = 'rgba(255, 255, 255, 0.25)';
        backBtn.style.transform = 'translateX(0)';
    });

    // 点击返回主页，使用高级转场效果
    backBtn.addEventListener('click', () => {
        // 创建多层转场效果
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 99999;
            pointer-events: none;
        `;

        // 第一层：径向渐变遮罩
        const layer1 = document.createElement('div');
        layer1.style.cssText = `
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at center, transparent 0%, rgba(255,107,157,0.15) 100%);
            opacity: 0;
            transition: opacity 0.6s cubic-bezier(0.19, 1, 0.22, 1);
        `;

        // 第二层：模糊层
        const layer2 = document.createElement('div');
        layer2.style.cssText = `
            position: absolute;
            inset: 0;
            backdrop-filter: blur(0px);
            transition: backdrop-filter 0.6s cubic-bezier(0.19, 1, 0.22, 1);
        `;

        // 第三层：缩放遮罩
        const layer3 = document.createElement('div');
        layer3.style.cssText = `
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255,107,157,0.08), rgba(107,197,255,0.08));
            transform: scale(1.5);
            opacity: 0;
            transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
        `;

        overlay.appendChild(layer1);
        overlay.appendChild(layer2);
        overlay.appendChild(layer3);
        document.body.appendChild(overlay);

        // 触发动画
        requestAnimationFrame(() => {
            layer1.style.opacity = '1';
            layer2.style.backdropFilter = 'blur(20px)';
            layer3.style.transform = 'scale(1)';
            layer3.style.opacity = '1';
        });

        // 600ms后跳转
        setTimeout(() => {
            window.location.href = '../index.html#pt=zoom';
        }, 600);
    });

    // 添加到页面
    document.body.appendChild(backBtn);
})();
