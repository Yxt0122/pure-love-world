#!/bin/bash

# 动漫列表（英文名称用于搜索）
declare -a anime_search=(
    "Kimi ni Todoke"
    "Boku no Kokoro no Yabai Yatsu"
    "Horimiya"
    "Chuunibyou demo Koi ga Shitai"
    "Kimi no Na wa"
    "Kimi no Suizou wo Tabetai"
    "Kaguya-sama wa Kokurasetai"
    "Charlotte"
    "Hanasaku Iroha"
    "Hyouka"
    "ReLIFE"
    "Tsuki ga Kirei"
    "Shigatsu wa Kimi no Uso"
    "Yahari Ore no Seishun"
    "Sasaki to Miyano"
    "Karakai Jouzu no Takagi-san"
    "Taishou Otome Otogibanashi"
    "Sono Bisque Doll wa Koi wo Suru"
    "Yamada-kun to Lv999 no Koi wo Suru"
    "Komi-san wa Comyushou desu"
)

echo "["

for i in "${!anime_search[@]}"; do
    search_term="${anime_search[$i]}"
    echo "Fetching: $search_term" >&2

    # URL编码并发送请求
    encoded=$(echo "$search_term" | sed 's/ /%20/g')
    response=$(curl -s "https://api.jikan.moe/v4/anime?q=${encoded}&limit=1")

    # 提取图片URL
    image_url=$(echo "$response" | grep -o '"large_image_url":"[^"]*"' | head -1 | cut -d'"' -f4)

    if [ ! -z "$image_url" ]; then
        echo "  \"$image_url\""
        if [ $i -lt $((${#anime_search[@]} - 1)) ]; then
            echo "  ,"
        fi
    fi

    # 避免触发API速率限制
    sleep 1
done

echo "]"
