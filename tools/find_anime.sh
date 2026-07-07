#!/bin/bash

echo "搜索《想结束这场我爱你的游戏》..."

# 尝试不同的关键词搜索
echo "=== 尝试1: 使用日文名 ==="
curl -s "https://api.jikan.moe/v4/anime?q=Sukisuki&limit=5" | grep -E '"title"|"large_image_url"|"synopsis"' | head -30
sleep 2

echo -e "\n=== 尝试2: 使用英文关键词 ==="
curl -s "https://api.jikan.moe/v4/anime?q=I%20want%20to%20end%20this%20love%20game&limit=5" | grep -E '"title"|"large_image_url"' | head -20
sleep 2

echo -e "\n=== 尝试3: 使用角色名搜索 ==="
curl -s "https://api.jikan.moe/v4/anime?q=Yukiya%20Asagi&limit=3" | grep -E '"title"|"large_image_url"' | head -15
sleep 2

echo -e "\n=== 尝试4: 2024年恋爱番 ==="
curl -s "https://api.jikan.moe/v4/anime?q=2024%20romance%20school&limit=5" | grep -E '"title"' | head -20

