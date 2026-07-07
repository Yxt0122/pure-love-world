# 纯爱世界 — 部署指南

## 项目结构

```
动漫网站测试/
├── index.html              # 登录后主页
├── login.html              # 登录页
├── loading.html            # 加载动画
├── tree/                   # 次元树 React 构建产物
│   ├── index.html
│   └── assets/
├── pages/                  # 静态页面
│   ├── treehole.html       # 恋爱物语树洞
│   ├── 动漫推荐.html       # 青春恋爱动漫推荐
│   └── 恋爱碎忆.html       # 恋爱碎忆视频
├── assets/                 # 静态资源
│   ├── css/
│   ├── js/
│   ├── images/
│   └── videos/
├── services/
│   └── comment-backend/    # Python FastAPI 评论后端
│       ├── main.py
│       ├── requirements.txt
│       └── render.yaml
└── vercel.json             # Vercel 部署配置
```

---

## 已完成的生产化修改

1. **前端 API 可配置**：`dimension-tree/src/config/api.js` 支持 `VITE_API_BASE` 环境变量
2. **后端上传 URL 可配置**：`main.py` 通过 `API_BASE_URL` 环境变量生成上传文件 URL
3. **次元树入口路径**：主页入口从 `localhost:5173` 改为相对路径 `tree/index.html`
4. **返回主页逻辑**：使用 `history.back()` 或相对路径 `../index.html#pt=zoom`
5. **单服务部署支持**：后端支持 `STATIC_DIR` 环境变量挂载前端静态文件

---

## 方案一：单服务 + PostgreSQL（推荐）

使用 **Render** 同时托管前端、后端和 PostgreSQL 数据库。评论数据会保存到 PostgreSQL，不再依赖临时的 `comments.db` 文件。

### 步骤

1. 将整个项目推送到 GitHub
2. 访问 [render.com](https://render.com) 注册/登录
3. 点击 **New +** → **Blueprint**
4. 选择你的 GitHub 仓库
5. Render 会读取根目录的 `render.yaml`，自动创建：
   - `pure-love-world` 网站服务
   - `pure-love-db` PostgreSQL 数据库
6. 如果你手动创建 Web Service，则使用以下配置：
   - **Name**: `pure-love-world`
   - **Environment**: `Python 3`
   - **Build Command**: `cd services/comment-backend && pip install -r requirements.txt`
   - **Start Command**: `cd services/comment-backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
7. 环境变量：
   - `API_BASE_URL` = `https://你的服务名.onrender.com`（部署后 Render 会提供实际 URL）
   - `DATABASE_URL` = PostgreSQL 数据库连接串（使用 Blueprint 时会自动注入）
8. 点击 **Create Web Service**

**缺点**：免费实例 15 分钟无请求会休眠，首次访问需要 30 秒唤醒。

### 数据库说明

- 本地开发：没有 `DATABASE_URL` 时自动使用 SQLite 的 `comments.db`
- Render 线上：有 `DATABASE_URL` 时自动使用 PostgreSQL
- 已支持的持久化数据：评论、评论记录、审核状态、星空打卡记录
- 注意：用户上传的图片/视频文件仍保存在 `uploads/` 目录；如果也要永久保存上传文件，后续需要接入对象存储或 Render Disk

---

## 方案二：前后端分离部署

### 前端 → Vercel

1. 访问 [vercel.com](https://vercel.com) 注册/登录
2. 导入 GitHub 仓库
3. 配置：
   - **Framework Preset**: `Other`
   - **Build Command**: 留空
   - **Output Directory**: 留空
4. 在 Vercel 项目设置中添加 **Rewrites**：
   - Source: `/api/(.*)`
   - Destination: `https://你的后端地址.onrender.com/api/$1`
5. 部署

### 后端 → Render

1. 创建 Web Service
2. 配置：
   - **Root Directory**: `services/comment-backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. 环境变量：
   - `API_BASE_URL` = 你的 Render 服务公网 URL

---

## 方案三：本地临时分享（最快）

使用 Cloudflare Tunnel 或 ngrok 暴露本地服务：

### Cloudflare Tunnel（推荐，免费）

```bash
# 安装 cloudflared
winget install Cloudflare.cloudflared

# 启动隧道（映射本地 8000 端口）
cloudflared tunnel --url http://localhost:8000
```

你会得到一个类似 `https://abc123.trycloudflare.com` 的公网地址，直接分享给朋友即可。

**注意**：此地址每次重启会变化，适合临时分享。

### ngrok

```bash
# 安装 ngrok
choco install ngrok

# 启动
ngrok http 8000
```

---

## 环境变量说明

| 变量 | 作用位置 | 默认值 | 说明 |
|------|----------|--------|------|
| `API_BASE_URL` | 后端 | `http://localhost:8080` | 后端自身的公网 URL，用于生成上传文件链接 |
| `DATABASE_URL` | 后端 | 空 | PostgreSQL 连接串；为空时使用本地 SQLite |
| `STATIC_DIR` | 后端 | 空 | 前端静态文件目录路径（通常无需手动设置，后端会自动检测） |
| `VITE_API_BASE` | 前端构建时 | 空 | 后端 API 的完整地址，如 `https://api.example.com` |

---

## 本地开发验证

```bash
# 1. 启动后端
cd services/comment-backend
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8080

# 2. 启动前端（另开终端）
cd ../..
python -m http.server 8000 --bind 127.0.0.1

# 3. 访问 http://127.0.0.1:8000
```

---

## 重要注意事项

1. **数据库持久化**：已支持 PostgreSQL。使用 Render Blueprint 创建时，`DATABASE_URL` 会自动注入，评论和打卡数据会进入 PostgreSQL

2. **文件上传**：上传的文件仍保存在 `uploads/` 目录。如果希望上传的图片/视频也永久保存，建议下一步接入对象存储或 Render Disk

3. **CORS**：后端已配置 `allow_origins=["*"]`，支持跨域

4. **单服务部署时**：FastAPI 会自动检测项目根目录并挂载静态文件，API 路由仍优先匹配
