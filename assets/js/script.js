const animeData = [
    {
        id: 1,
        title: "好想告诉你",
        mediaType: "电视",
        year: "2009",
        genres: ["校园", "纯爱", "治愈"],
        rating: 5.0,
        description: "讲述了性格内向、外表阴沉的黑沼爽子与开朗阳光的风早翔太之间温暖治愈的青春恋爱故事。爽子在翔太的鼓励下逐渐变得自信，两人的感情也慢慢升温。",
        image: "https://cdn.myanimelist.net/images/anime/1502/124384l.jpg",
        links: { bilibili: "https://www.bilibili.com" }
    },
    {
        id: 2,
        title: "我心里危险的东西",
        mediaType: "电视",
        year: "2023",
        genres: ["校园", "纯爱", "喜剧"],
        rating: 5.0,
        description: "市川京太郎是个沉默寡言、有着阴暗想法的中二少年，却被班上最受欢迎的女生山田杏奈所吸引。在与山田的相处中，市川逐渐发现了自己内心的温柔。",
        image: "https://cdn.myanimelist.net/images/anime/1545/133887l.jpg",
        links: { bilibili: "https://www.bilibili.com" }
    },
    {
        id: 3,
        title: "堀与宫村",
        mediaType: "电视",
        year: "2021",
        genres: ["校园", "纯爱", "青春"],
        rating: 5.0,
        description: "表面上是完美班长的堀京子与看似阴暗却隐藏着多重秘密的宫村伊澄，两人意外发现彼此不为人知的一面后，开启了一段甜蜜的恋爱故事。",
        image: "https://cdn.myanimelist.net/images/anime/1695/111486l.jpg",
        links: { bilibili: "https://www.bilibili.com" }
    },
    {
        id: 4,
        title: "中二病也要谈恋爱",
        mediaType: "电视",
        year: "2012",
        genres: ["校园", "喜剧", "纯爱"],
        rating: 5.0,
        description: "富樫勇太曾是重度中二病患者，升入高中后想要摆脱黑历史，却遇到了现役中二病少女小鸟游六花。两人在中二病的世界里展开了独特的恋爱喜剧。",
        image: "https://cdn.myanimelist.net/images/anime/1905/142840l.jpg",
        links: { bilibili: "https://www.bilibili.com" }
    },
    {
        id: 5,
        title: "你的名字",
        mediaType: "电影",
        year: "2016",
        genres: ["奇幻", "纯爱", "治愈"],
        rating: 5.0,
        description: "生活在东京的少年泷和住在乡下小镇的少女三叶，某天突然开始互换身体。跨越时空的羁绊将两人紧紧相连，创造了一段奇迹般的爱情故事。",
        image: "https://cdn.myanimelist.net/images/anime/5/87048l.jpg",
        links: { bilibili: "https://www.bilibili.com" }
    },
    {
        id: 6,
        title: "我想吃掉你的胰脏",
        mediaType: "电影",
        year: "2018",
        genres: ["校园", "催泪", "青春"],
        rating: 5.0,
        description: "性格孤僻的少年偶然得知开朗活泼的同学山内樱良患有胰脏疾病。在有限的时光里，两人共同度过了珍贵而难忘的青春时光，留下了刻骨铭心的回忆。",
        image: "https://cdn.myanimelist.net/images/anime/1768/93291l.jpg",
        links: { bilibili: "https://www.bilibili.com" }
    },
    {
        id: 7,
        title: '想结束这场"我爱你"的游戏',
        mediaType: "电视",
        year: "2026",
        genres: ["校园", "喜剧", "纯爱"],
        rating: 5.0,
        description: '浅葱优希也和樱美玖从小就是青梅竹马，两人玩着名为"恋爱游戏"的游戏：互相告白，先脸红的人就输。现在升入高中后，两人的游戏规则有所改变，可以用任何方式让对方害羞认输，但真实的感情却越来越难以掩饰。',
        image: "https://cdn.myanimelist.net/images/anime/1879/155958l.jpg",
        links: { bilibili: "https://www.bilibili.com" }
    },
    {
        id: 8,
        title: "夏洛特",
        mediaType: "电视",
        year: "2015",
        genres: ["奇幻", "青春", "治愈"],
        rating: 5.0,
        description: "拥有特殊能力的少年乙坂有宇过着自私的生活，直到遇见了友利奈绪。为了保护能力者们的未来，有宇踏上了一段既悲伤又温暖的旅程。",
        image: "https://cdn.myanimelist.net/images/anime/1826/147276l.jpg",
        links: { bilibili: "https://www.bilibili.com" }
    },
    {
        id: 9,
        title: "熏香花朵凛然绽放",
        mediaType: "电视",
        year: "2024",
        genres: ["校园", "纯爱", "青春"],
        rating: 5.0,
        description: "紬凛太郎和和栗薰子之间纯真美好的恋爱故事。两人在校园生活中相遇相知，如同花朵般凛然绽放的青春恋爱物语。",
        image: "https://cdn.myanimelist.net/images/anime/1744/150433l.jpg",
        links: { bilibili: "https://www.bilibili.com" }
    },
    {
        id: 10,
        title: "冰菓",
        mediaType: "电视",
        year: "2012",
        genres: ["校园", "推理", "青春"],
        rating: 5.0,
        description: '奉行"节能主义"的折木奉太郎加入了古籍研究社，与好奇心旺盛的千反田爱瑠一起解开校园中的各种谜题。平淡的日常中暗藏着青春的悸动。',
        image: "https://cdn.myanimelist.net/images/anime/13/50521l.jpg",
        links: { bilibili: "https://www.bilibili.com" }
    },
    {
        id: 11,
        title: "RELIFE",
        mediaType: "电视",
        year: "2016",
        genres: ["校园", "青春", "治愈"],
        rating: 5.0,
        description: "27岁的失意青年海崎新太参加了重返高中的实验计划，以17岁的身份重新体验青春。在这一年里，他重新审视了人生，也收获了珍贵的感情。",
        image: "https://cdn.myanimelist.net/images/anime/3/82149l.jpg",
        links: { bilibili: "https://www.bilibili.com" }
    },
    {
        id: 12,
        title: "月色真美",
        mediaType: "电视",
        year: "2017",
        genres: ["校园", "纯爱", "青春"],
        rating: 5.0,
        description: "初三学生安昙小太郎与水野茜的纯真初恋故事。从最初的怦然心动到小心翼翼的交往，细腻地描绘了青涩而美好的中学生恋爱。",
        image: "https://cdn.myanimelist.net/images/anime/2/85592l.jpg",
        links: { bilibili: "https://www.bilibili.com" }
    },
    {
        id: 13,
        title: "四月是你的谎言",
        mediaType: "电视",
        year: "2014",
        genres: ["音乐", "催泪", "青春"],
        rating: 5.0,
        description: "曾是天才钢琴少年的有马公生因母亲去世而无法听到自己的琴声。直到遇见了开朗的小提琴手宫园薰，她用音乐和爱让公生的世界重新充满色彩。",
        image: "https://cdn.myanimelist.net/images/anime/1405/143284l.jpg",
        links: { bilibili: "https://www.bilibili.com" }
    },
    {
        id: 14,
        title: "我的青春恋爱物语果然有问题",
        mediaType: "电视",
        year: "2013",
        genres: ["校园", "青春", "喜剧"],
        rating: 5.0,
        description: '比企谷八幡因为扭曲的性格被老师强制加入"侍奉部"，与完美超人雪之下雪乃和天然系少女由比滨结衣一起，解决学生们的各种烦恼。',
        image: "https://cdn.myanimelist.net/images/anime/11/75376l.jpg",
        links: { bilibili: "https://www.bilibili.com" }
    },
    {
        id: 15,
        title: "躲在超市后门吸烟的两人",
        mediaType: "电视",
        year: "2024",
        genres: ["职场", "纯爱", "治愈"],
        rating: 5.0,
        description: "在超市打工的佐佐木与山田在吸烟区相遇。两个寂寞的人在短暂的休息时间里分享彼此的日常，渐渐产生了微妙的情愫。",
        image: "https://cdn.myanimelist.net/images/anime/1768/156339l.jpg",
        links: { bilibili: "https://www.bilibili.com" }
    },
    {
        id: 16,
        title: "擅长捉弄的高木同学",
        mediaType: "电视",
        year: "2018",
        genres: ["校园", "纯爱", "喜剧"],
        rating: 5.0,
        description: "西片总是被坐在旁边的高木同学捉弄，他发誓要捉弄回去。但每次都被高木同学看穿，两人在日常的捉弄中度过了甜蜜的青春时光。",
        image: "https://cdn.myanimelist.net/images/anime/1591/95091l.jpg",
        links: { bilibili: "https://www.bilibili.com" }
    },
    {
        id: 17,
        title: "正相反的你和我",
        mediaType: "电视",
        year: "2024",
        genres: ["校园", "纯爱", "青春"],
        rating: 5.0,
        description: "谷悠介和铃木实优，性格完全相反的两人结成学习搭档。在相处中互相影响，渐渐发现了对方的可爱之处。",
        image: "https://cdn.myanimelist.net/images/anime/1140/154457l.jpg",
        links: { bilibili: "https://www.bilibili.com" }
    },
    {
        id: 18,
        title: "更衣人偶坠入爱河",
        mediaType: "电视",
        year: "2022",
        genres: ["校园", "纯爱", "治愈"],
        rating: 5.0,
        description: "梦想成为雏人偶师的五条新菜遇到了喜欢cosplay的辣妹喜多川海梦。新菜为海梦制作cos服，两人在共同的爱好中越走越近。",
        image: "https://cdn.myanimelist.net/images/anime/1179/119897l.jpg",
        links: { bilibili: "https://www.bilibili.com" }
    },
    {
        id: 19,
        title: "和山田君进行LV999的恋爱",
        mediaType: "电视",
        year: "2023",
        genres: ["游戏", "纯爱", "青春"],
        rating: 5.0,
        description: "被男友劈腿的木之下茜决定在游戏里寻找慰藉，却意外认识了游戏高手山田。从线上到线下，两人的关系逐渐从游戏伙伴发展成恋人。",
        image: "https://cdn.myanimelist.net/images/anime/1298/134178l.jpg",
        links: { bilibili: "https://www.bilibili.com" }
    },
    {
        id: 20,
        title: "古见同学有交流障碍症",
        mediaType: "电视",
        year: "2021",
        genres: ["校园", "喜剧", "治愈"],
        rating: 5.0,
        description: '外表出众但患有交流障碍症的古见硝子，在只野仁人的帮助下努力结交朋友。两人在帮助古见实现"交100个朋友"目标的过程中渐生情愫。',
        image: "https://cdn.myanimelist.net/images/anime/1899/117237l.jpg",
        links: { bilibili: "https://www.bilibili.com" }
    },
    {
        id: 21,
        title: "义妹生活",
        mediaType: "电视",
        year: "2024",
        genres: ["校园", "纯爱", "青春"],
        rating: 5.0,
        description: "因为父母再婚而成为义兄妹的两人，在同一屋檐下开始了既熟悉又陌生的新生活。在日常相处中，两人渐渐产生了超越兄妹的特殊情感。",
        image: "https://cdn.myanimelist.net/images/anime/1420/143707l.jpg",
        links: { bilibili: "https://www.bilibili.com" }
    }
];

let currentView = 'all';
let allAnime = [...animeData];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let viewHistory = JSON.parse(localStorage.getItem('viewHistory')) || [];

function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function saveViewHistory() {
    localStorage.setItem('viewHistory', JSON.stringify(viewHistory));
}

function addToHistory(animeId) {
    const existingIndex = viewHistory.findIndex(item => item.id === animeId);
    if (existingIndex !== -1) {
        viewHistory.splice(existingIndex, 1);
    }
    viewHistory.unshift({ id: animeId, timestamp: Date.now() });
    if (viewHistory.length > 50) viewHistory.pop();
    saveViewHistory();
}

function toggleFavorite(animeId) {
    const index = favorites.indexOf(animeId);
    if (index === -1) {
        favorites.push(animeId);
    } else {
        favorites.splice(index, 1);
    }
    saveFavorites();
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<span class="star filled">★</span>';
        } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
            stars += '<span class="star half">★</span>';
        } else {
            stars += '<span class="star">★</span>';
        }
    }
    return stars;
}

function renderAnime(animeList) {
    const animeGrid = document.getElementById('animeGrid');
    animeGrid.innerHTML = '';

    animeList.forEach(anime => {
        const card = document.createElement('div');
        card.className = 'anime-card';
        card.innerHTML = `
            <img src="${anime.image}" alt="${anime.title}" onclick="openModal(${anime.id})">
            <div class="anime-info">
                <h2 class="anime-title">${anime.title}</h2>
                <div class="genre-tags">
                    ${anime.genres.map(g => `<span class="genre-tag">${g}</span>`).join('')}
                </div>
                <div class="rating">
                    ${renderStars(anime.rating)}
                </div>
            </div>
        `;
        animeGrid.appendChild(card);
    });
}

function openModal(animeId) {
    addToHistory(animeId);
    const anime = animeData.find(a => a.id === animeId);
    const isFavorited = favorites.includes(animeId);

    const modal = document.getElementById('animeModal');
    const modalContent = document.querySelector('.modal-content');

    modalContent.innerHTML = `
        <span class="close" onclick="closeModal()">&times;</span>
        <div class="modal-body">
            <img src="${anime.image}" alt="${anime.title}" class="modal-image">
            <div class="modal-info">
                <h2>${anime.title}</h2>
                <p class="modal-year">📅 ${anime.year}年 · ${anime.mediaType}</p>
                <div class="genre-tags">
                    ${anime.genres.map(g => `<span class="genre-tag">${g}</span>`).join('')}
                </div>
                <div class="rating">
                    ${renderStars(anime.rating)}
                    <span class="rating-score">${anime.rating}</span>
                </div>
                <p class="modal-description">${anime.description}</p>
                <div class="modal-actions">
                    <button class="btn-favorite ${isFavorited ? 'favorited' : ''}" onclick="handleFavorite(${animeId})">
                        ${isFavorited ? '❤️ 已收藏' : '🤍 收藏'}
                    </button>
                    <a href="${anime.links.bilibili}" target="_blank" class="btn-link">📺 B站观看</a>
                </div>
                <div class="comments-section">
                    <h3>评论</h3>
                    <p class="no-comments">暂无评论</p>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('animeModal').style.display = 'none';
}

function handleFavorite(animeId) {
    toggleFavorite(animeId);
    openModal(animeId);
    if (currentView === 'favorites') {
        showFavorites();
    }
}

function showAll() {
    currentView = 'all';
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[onclick="showAll()"]').classList.add('active');
    renderAnime(allAnime);
}

function showHistory() {
    currentView = 'history';
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[onclick="showHistory()"]').classList.add('active');

    const historyAnime = viewHistory.map(item =>
        animeData.find(a => a.id === item.id)
    ).filter(Boolean);

    renderAnime(historyAnime);
}

function showFavorites() {
    currentView = 'favorites';
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[onclick="showFavorites()"]').classList.add('active');

    const favoriteAnime = favorites.map(id =>
        animeData.find(a => a.id === id)
    ).filter(Boolean);

    if (favoriteAnime.length === 0) {
        document.getElementById('animeGrid').innerHTML = '<p class="empty-message">还没有收藏任何动漫哦~</p>';
        return;
    }

    renderAnime(favoriteAnime);
}

function searchAnime() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredAnime = allAnime.filter(anime => {
        return anime.title.toLowerCase().includes(searchTerm) ||
               anime.description.toLowerCase().includes(searchTerm) ||
               anime.genres.some(g => g.toLowerCase().includes(searchTerm));
    });
    renderAnime(filteredAnime);
}

document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchAnime();
    }
});

document.getElementById('searchInput').addEventListener('input', function(e) {
    if (e.target.value === '') {
        if (currentView === 'all') {
            renderAnime(allAnime);
        } else if (currentView === 'history') {
            showHistory();
        } else if (currentView === 'favorites') {
            showFavorites();
        }
    }
});

window.onclick = function(event) {
    const modal = document.getElementById('animeModal');
    if (event.target === modal) {
        closeModal();
    }
};

renderAnime(allAnime);
