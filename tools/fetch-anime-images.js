// 使用 Jikan API 获取动漫图片的脚本
// 在浏览器控制台中运行此脚本

const animeList = [
    { title: "好想告诉你", searchTitle: "Kimi ni Todoke", year: 2009 },
    { title: "我心里危险的东西", searchTitle: "Boku no Kokoro no Yabai Yatsu", year: 2023 },
    { title: "堀与宫村", searchTitle: "Horimiya", year: 2021 },
    { title: "中二病也要谈恋爱", searchTitle: "Chuunibyou demo Koi ga Shitai", year: 2012 },
    { title: "你的名字", searchTitle: "Kimi no Na wa", year: 2016 },
    { title: "我想吃掉你的胰脏", searchTitle: "Kimi no Suizou wo Tabetai", year: 2018 },
    { title: "辉夜大小姐想让我告白", searchTitle: "Kaguya-sama wa Kokurasetai", year: 2019 },
    { title: "夏洛特", searchTitle: "Charlotte", year: 2015 },
    { title: "花开伊吕波", searchTitle: "Hanasaku Iroha", year: 2011 },
    { title: "冰菓", searchTitle: "Hyouka", year: 2012 },
    { title: "RELIFE", searchTitle: "ReLIFE", year: 2016 },
    { title: "月色真美", searchTitle: "Tsuki ga Kirei", year: 2017 },
    { title: "四月是你的谎言", searchTitle: "Shigatsu wa Kimi no Uso", year: 2014 },
    { title: "我的青春恋爱物语果然有问题", searchTitle: "Yahari Ore no Seishun", year: 2013 },
    { title: "佐佐木与宫野", searchTitle: "Sasaki to Miyano", year: 2022 },
    { title: "擅长捉弄的高木同学", searchTitle: "Karakai Jouzu no Takagi-san", year: 2018 },
    { title: "正相反的你和我", searchTitle: "Seihantai na Kimi to Boku", year: 2024 },
    { title: "更衣人偶坠入爱河", searchTitle: "Sono Bisque Doll wa Koi wo Suru", year: 2022 },
    { title: "和山田进行LV999的恋爱", searchTitle: "Yamada-kun to Lv999 no Koi wo Suru", year: 2023 },
    { title: "古见同学有交流障碍症", searchTitle: "Komi-san wa Comyushou desu", year: 2021 }
];

async function searchAnime(title) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=5`);
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            // 返回第一个结果的图片URL
            return data.data[0].images.jpg.large_image_url || data.data[0].images.jpg.image_url;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching ${title}:`, error);
        return null;
    }
}

async function getAllImages() {
    const results = [];

    for (let i = 0; i < animeList.length; i++) {
        const anime = animeList[i];
        console.log(`Fetching ${i + 1}/${animeList.length}: ${anime.title} (${anime.searchTitle})...`);

        const imageUrl = await searchAnime(anime.searchTitle);
        results.push({
            id: i + 1,
            title: anime.title,
            searchTitle: anime.searchTitle,
            year: anime.year,
            image: imageUrl
        });

        // API有速率限制，每次请求后等待1秒
        if (i < animeList.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    console.log("\n完成！结果：");
    console.log(JSON.stringify(results, null, 2));
    return results;
}

// 执行
getAllImages();
