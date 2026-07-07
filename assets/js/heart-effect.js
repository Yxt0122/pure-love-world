// 鼠标爱心拖尾特效
(function() {
    const hearts = [];
    // 更明亮的颜色
    const colors = ['#ff69b4', '#ff1493', '#ff6ec7', '#ff85c1', '#ffa0d2', '#ffb3e6'];

    // 创建爱心元素
    function createHeart(x, y) {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.innerHTML = '♥';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.color = colors[Math.floor(Math.random() * colors.length)];
        // 稍微小一点的爱心
        heart.style.fontSize = (Math.random() * 8 + 12) + 'px';
        // 添加阴影让爱心更明亮
        heart.style.textShadow = '0 0 5px currentColor';

        document.body.appendChild(heart);

        // 添加到数组
        hearts.push({
            element: heart,
            x: x,
            y: y,
            // 减小横向速度
            vx: (Math.random() - 0.5) * 0.5,
            // 减小纵向速度，让它飘得更慢
            vy: -Math.random() * 1 - 0.5,
            life: 1,
            // 更慢的衰减速度
            decay: Math.random() * 0.01 + 0.008
        });

        // 减少最大爱心数量，让拖尾更短
        if (hearts.length > 20) {
            const removed = hearts.shift();
            removed.element.remove();
        }
    }

    // 更新爱心位置和透明度
    function updateHearts() {
        for (let i = hearts.length - 1; i >= 0; i--) {
            const heart = hearts[i];

            heart.x += heart.vx;
            heart.y += heart.vy;
            heart.life -= heart.decay;

            heart.element.style.left = heart.x + 'px';
            heart.element.style.top = heart.y + 'px';
            heart.element.style.opacity = heart.life;

            // 移除消失的爱心
            if (heart.life <= 0) {
                heart.element.remove();
                hearts.splice(i, 1);
            }
        }

        requestAnimationFrame(updateHearts);
    }

    // 鼠标移动事件
    let lastTime = 0;
    document.addEventListener('mousemove', function(e) {
        const now = Date.now();
        // 降低节流时间，让爱心更连续
        if (now - lastTime > 30) {
            // 使用clientX/clientY而不是pageX/pageY，因为爱心是fixed定位
            createHeart(e.clientX, e.clientY);
            lastTime = now;
        }
    });

    // 开始动画循环
    updateHearts();
})();
