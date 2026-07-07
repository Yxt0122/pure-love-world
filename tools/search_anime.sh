#!/bin/bash

echo "搜索动漫信息..."

# 1. 想结束这场"我爱你"的游戏
echo "=== 1. 想结束这场我爱你的游戏 ==="
curl -s "https://api.jikan.moe/v4/anime?q=Sukisuki%20Game&limit=3" | grep -E '"title"|"synopsis"' | head -20
sleep 2

# 2. 熏香花朵凛然绽放
echo -e "\n=== 2. 熏香花朵凛然绽放 ==="
curl -s "https://api.jikan.moe/v4/anime?q=Kaoru%20Hana%20wa%20Rin%20to%20Saku&limit=1" | grep -o '"large_image_url":"[^"]*"' | head -1
sleep 2

# 3. 躲在超市后门吸烟的两人
echo -e "\n=== 3. 躲在超市后门吸烟的两人 ==="
curl -s "https://api.jikan.moe/v4/anime?q=Smoking%20Behind%20the%20Supermarket&limit=1" | grep -o '"large_image_url":"[^"]*"' | head -1
sleep 2

# 4. 正相反的你和我
echo -e "\n=== 4. 正相反的你和我 ==="
curl -s "https://api.jikan.moe/v4/anime?q=Seihantai%20na%20Kimi%20to%20Boku&limit=1" | grep -o '"large_image_url":"[^"]*"' | head -1
sleep 2

# 5. 义妹生活
echo -e "\n=== 5. 义妹生活 ==="
curl -s "https://api.jikan.moe/v4/anime?q=Gimai%20Seikatsu&limit=1" | grep -o '"large_image_url":"[^"]*"' | head -1

