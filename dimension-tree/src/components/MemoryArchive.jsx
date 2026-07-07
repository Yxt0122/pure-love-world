import React, { useMemo, useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useTexture, useVideoTexture, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, ArrowLeft, Sparkles, Move, Image as ImageIcon, XCircle, MessageCircle, Trash2, ArrowLeft as BackIcon } from 'lucide-react';
import { PHOTO_DATA } from '../config/photos';
import { API_URL } from '../config/api';

// 访客唯一标识：稳定保存在 localStorage，用于识别“我留下的评论”
const getVisitorId = () => {
    let id = localStorage.getItem('comment_visitor_id');
    if (!id) {
        id = 'v_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem('comment_visitor_id', id);
    }
    return id;
};

const COLORS = {
    STAR_WHITE: new THREE.Color("#ffffff"),
    HOT_PINK: new THREE.Color("#ff1493"),
    CYAN: new THREE.Color("#00ffff"),
    VIOLET: new THREE.Color("#8b00ff"),
    STAR_DUST: new THREE.Color("#ffffff") 
};

// --- [NEW] 记忆星海粒子浪潮 (Particle Wave Sea - ALL-ANGLE VERSION) ---
const ParticleWave = () => {
    const count = 35000;
    const meshRef = useRef();
    
    // 生成柔和的圆形光晕纹理
    const glowTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.3)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(canvas);
    }, []);

    const [positions, offsets] = useMemo(() => {
        const p = new Float32Array(count * 3);
        const o = new Float32Array(count); 
        for (let i = 0; i < count; i++) {
            const r = 3.0 + Math.sqrt(Math.random()) * 58; 
            const theta = Math.random() * Math.PI * 2;
            p[i*3] = r * Math.cos(theta);
            // 微量纵向偏移 (±0.4)，确保侧视和俯视可见，且保持精致感
            p[i*3+1] = -11.5 + (Math.random() - 0.5) * 0.8; 
            p[i*3+2] = r * Math.sin(theta);
            o[i] = r; 
        }
        return [p, o];
    }, []);

    const yOffsets = useMemo(() => {
        const arr = new Float32Array(count);
        for(let i=0; i<count; i++) arr[i] = (Math.random() - 0.5) * 0.8;
        return arr;
    }, []);

    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.elapsedTime;
            const posAttr = meshRef.current.geometry.attributes.position;
            for (let i = 0; i < count; i++) {
                const r = offsets[i];
                const wave = Math.sin(r * 0.25 - time * 0.6) * 0.85;
                const wave2 = Math.cos(r * 0.12 + time * 0.4) * 0.3;
                posAttr.setY(i, (-11.5 + yOffsets[i]) + wave + wave2);
            }
            posAttr.needsUpdate = true;
            meshRef.current.rotation.y += 0.0003;
        }
    });

    return (
        <points ref={meshRef} renderOrder={5}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial 
                size={0.6} 
                map={glowTexture} 
                transparent 
                opacity={0.8} 
                fog={false} 
                blending={THREE.AdditiveBlending} 
                depthWrite={false} 
                sizeAttenuation={true} 
            />
        </points>
    );
};

// --- 环境星尘系统 (Star-Moon-Snow Trinity Version - ENHANCED) ---
const StarDust = () => {
    const totalCount = 5000;
    const countPerType = Math.floor(totalCount / 3);
    const textures = useMemo(() => {
        const createTex = (drawFn) => {
            const canvas = document.createElement('canvas');
            canvas.width = 64; canvas.height = 64;
            const ctx = canvas.getContext('2d');
            // 恢复最经典的 12 点发光，确保纹理极致清晰
            ctx.fillStyle = 'white'; ctx.shadowBlur = 12; ctx.shadowColor = 'white';
            drawFn(ctx);
            return new THREE.CanvasTexture(canvas);
        };
        return {
            star: createTex((ctx) => {
                const cx = 32, cy = 32, spikes = 5, outer = 28, inner = 12;
                let rot = Math.PI/2*3, step = Math.PI/spikes;
                ctx.beginPath(); ctx.moveTo(cx, cy - outer);
                for(let i=0; i<spikes; i++) {
                    ctx.lineTo(cx + Math.cos(rot)*outer, cy + Math.sin(rot)*outer); rot += step;
                    ctx.lineTo(cx + Math.cos(rot)*inner, cy + Math.sin(rot)*inner); rot += step;
                }
                ctx.closePath(); ctx.fill();
            }),
            snow: createTex((ctx) => {
                ctx.strokeStyle = 'white'; ctx.lineWidth = 5; ctx.lineCap = 'round';
                const cx = 32, cy = 32;
                for(let i=0; i<6; i++) {
                    const angle = (i * 60) * Math.PI / 180;
                    ctx.beginPath(); ctx.moveTo(cx, cy);
                    ctx.lineTo(cx + Math.cos(angle)*28, cy + Math.sin(angle)*28);
                    const bx = cx + Math.cos(angle)*18, by = cy + Math.sin(angle)*18;
                    ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(angle+0.6)*10, by + Math.sin(angle+0.6)*10);
                    ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(angle-0.6)*10, by + Math.sin(angle-0.6)*10);
                    ctx.stroke();
                }
            }),
            moon: createTex((ctx) => {
                ctx.beginPath();
                // 调整弧度范围，让实体部分位于右侧，开口位于左侧
                const start = Math.PI * 0.6;
                const end = Math.PI * 1.4;
                ctx.arc(32, 32, 26, start, end, true); // 使用 counter-clockwise 绘制实体圆弧
                // 使用贝塞尔曲线勾勒内凹部分，形成优雅的左开口月牙
                ctx.bezierCurveTo(44, 19, 44, 45, 32 + Math.cos(start)*26, 32 + Math.sin(start)*26);
                ctx.fill();
            })
        };
    }, []);

    return (
        <group>
            <PartSet count={countPerType} texture={textures.star} speedMult={1.0} />
            <PartSet count={countPerType} texture={textures.snow} speedMult={0.8} />
            <PartSet count={countPerType} texture={textures.moon} speedMult={0.6} />
        </group>
    );
};

const PartSet = ({ count, texture, speedMult }) => {
    const meshRef = useRef();
    const pos = useMemo(() => {
        const p = new Float32Array(count * 3);
        const rand = () => Math.random();
        for (let i = 0; i < count; i++) {
            const r = 25 + rand() * 65; 
            const theta = rand() * Math.PI * 2;
            const phi = Math.acos(rand() * 2 - 1);
            p[i*3] = r * Math.sin(phi) * Math.cos(theta);
            p[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
            p[i*3+2] = r * Math.cos(phi);
        }
        return p;
    }, [count]);
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.00015 * speedMult;
            meshRef.current.rotation.x += 0.00008 * speedMult;
            meshRef.current.material.opacity = 0.75 + Math.sin(state.clock.elapsedTime * 0.6 * speedMult) * 0.25;
        }
    });
    return (
        <points ref={meshRef}>
            <bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} /></bufferGeometry>
            <pointsMaterial size={1.05} map={texture} transparent alphaTest={0.05} color={COLORS.STAR_DUST} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation={true} />
        </points>
    );
};

const EnergyBeam = () => {
    const count = 18000;
    const meshRef = useRef();
    const [pos, colors] = useMemo(() => {
        const p = new Float32Array(count * 3);
        const c = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const h = Math.random() * 32.5 - 11.5;
            const rBase = Math.pow(Math.random(), 5.0) * 1.5; 
            const angle = Math.random() * Math.PI * 2;
            p[i*3] = Math.cos(angle) * rBase;
            p[i*3+1] = h;
            p[i*3+2] = Math.sin(angle) * rBase;
            const bColor = COLORS.STAR_WHITE.clone();
            if (rBase > 0.6) bColor.lerp(COLORS.HOT_PINK, 0.4);
            c[i*3] = bColor.r; c[i*3+1] = bColor.g; c[i*3+2] = bColor.b;
        }
        return [p, c];
    }, []);
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = (state.clock.elapsedTime * 0.15) % 0.12;
            meshRef.current.rotation.y += 0.008;
        }
    });
    return (
        <points ref={meshRef} renderOrder={11}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.045} vertexColors transparent opacity={0.65} fog={false} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
    );
};

const RadiantTree = () => {
    const pointsCount = 95000;
    const { positions, colors, sizes, finalCount } = useMemo(() => {
        const p = new Float32Array(pointsCount * 3);
        const c = new Float32Array(pointsCount * 3);
        const s = new Float32Array(pointsCount);
        const numTiers = 6; 
        let ptr = 0;
        for (let i = 0; i < pointsCount; i++) {
            const yNorm = Math.random();
            const tierIndex = Math.floor(yNorm * numTiers);
            const tierProgress = (yNorm * numTiers) - tierIndex; 
            const baseRadius = 13.5; 
            const tierExpansion = 0.9 + Math.pow(1.0 - tierProgress, 3.5) * 0.45;
            const maxR = Math.max(0.35 * (1.1 - yNorm), baseRadius * (1.0 - Math.pow(yNorm, 1.2)) * tierExpansion);
            const r = Math.pow(Math.random(), 1.4) * maxR; 
            if (r > maxR * 0.98) continue; 
            const angle = Math.random() * Math.PI * 2;
            p[ptr*3] = Math.cos(angle) * r;
            p[ptr*3+1] = yNorm * 32.0 - 11.5;
            p[ptr*3+2] = Math.sin(angle) * r;
            const bColor = COLORS.STAR_WHITE.clone();
            const rNorm = r / (maxR + 0.001);
            if (rNorm > 0.88) {
                const rand = Math.random();
                if (rand > 0.6) bColor.lerp(COLORS.CYAN, 0.6);
                else bColor.lerp(COLORS.HOT_PINK, 0.8);
            } else { bColor.lerp(COLORS.HOT_PINK, THREE.MathUtils.smoothstep(rNorm, 0.1, 0.8) * 0.8); }
            bColor.multiplyScalar(1.0 + (1.0 - rNorm) * 1.5);
            c[ptr*3] = bColor.r; c[ptr*3+1] = bColor.g; c[ptr*3+2] = bColor.b;
            s[ptr] = (r < 1.5 ? 0.16 : 0.08) * (1.2 + Math.random() * 0.6); 
            ptr++;
            if (ptr >= pointsCount) break;
        }
        return { positions: p, colors: c, sizes: s, finalCount: ptr };
    }, []);
    const geomRef = useRef();
    useEffect(() => { if (geomRef.current) geomRef.current.setDrawRange(0, finalCount); }, [finalCount]);
    const ref = useRef();
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y -= 0.0004;
            ref.current.material.opacity = 0.85 + Math.sin(state.clock.elapsedTime * 1.8) * 0.08;
        }
    });
    return (
        <points ref={ref} renderOrder={10}>
            <bufferGeometry ref={geomRef}>
                <bufferAttribute attach="attributes-position" count={pointsCount} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={pointsCount} array={colors} itemSize={3} />
                <bufferAttribute attach="attributes-size" count={pointsCount} array={sizes} itemSize={1} />
            </bufferGeometry>
            <pointsMaterial vertexColors size={0.14} transparent opacity={0.9} fog={false} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation={true} />
        </points>
    );
};

const LuminousPedestal = () => {
    const count = 9000;
    const meshRef = useRef();
    const [pos, colors] = useMemo(() => {
        const p = new Float32Array(count * 3);
        const c = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 8.5 + Math.random() * 32.0; 
            const theta = Math.random() * Math.PI * 2;
            p[i*3] = Math.cos(theta) * r;
            p[i*3+1] = (Math.random() - 0.5) * 1.2 - 11.5;
            p[i*3+2] = Math.sin(theta) * r;
            const bColor = COLORS.HOT_PINK.clone().lerp(COLORS.VIOLET, Math.random() * 0.5);
            c[i*3] = bColor.r; c[i*3+1] = bColor.g; c[i*3+2] = bColor.b;
        }
        return [p, c];
    }, []);
    useFrame(() => { if (meshRef.current) meshRef.current.rotation.y += 0.008; });
    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.2} vertexColors transparent opacity={0.35} fog={false} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
    );
};

const HeartTop = () => {
    const count = 4500;
    const meshRef = useRef();
    const pos = useMemo(() => {
        const p = new Float32Array(count * 3);
        const scale = 0.13; 
        for (let i = 0; i < count; i++) {
            const t = Math.random() * Math.PI * 2;
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
            p[i*3] = x * scale;
            p[i*3+1] = (y + 6) * scale + 23.5; 
            p[i*3+2] = (Math.random() - 0.5) * 1.8;
        }
        return p;
    }, []);
    useFrame((state) => { if (meshRef.current) meshRef.current.rotation.y += 0.015; });
    return (
        <points ref={meshRef}>
            <bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} /></bufferGeometry>
            <pointsMaterial size={0.38} color={COLORS.HOT_PINK} transparent opacity={1} fog={false} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
    );
};

const MediaNode = ({ photo, position, onSelect }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  const texture = photo.type === 'video' ? useVideoTexture(photo.url, { 
    muted: true, 
    loop: true, 
    start: true,
    crossOrigin: "Anonymous"
  }) : useTexture(photo.url);

  useFrame((state) => {
    if (meshRef.current) {
        meshRef.current.quaternion.copy(state.camera.quaternion);
        const t = state.clock.elapsedTime;
        
        // 确保数值安全
        const phaseOffset = typeof photo.id === 'number' ? photo.id : (parseInt(photo.id.replace(/\D/g, '')) || 0);
        meshRef.current.position.set(position[0], position[1] + Math.sin(t * 0.4 + phaseOffset) * 0.3, position[2]);
        
        const targetScale = hovered ? 1.2 : 1.0;
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <mesh ref={meshRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} onClick={() => onSelect(photo)}>
      <planeGeometry args={[3.4, 3.4]} />
      <meshBasicMaterial map={texture} transparent opacity={1} fog={false} />
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[3.6, 3.6]} />
        <meshBasicMaterial 
            color={hovered ? COLORS.HOT_PINK : "#ffffff"} 
            transparent 
            opacity={hovered ? 0.4 : 0.15} 
            fog={false} 
        />
      </mesh>
    </mesh>
  );
};

const getNebulaPos = (i, total) => {
    const phi = Math.acos(0.85 - (1.7 * i) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;
    const radius = 55 + Math.random() * 25;
    const angleOffset = Math.PI * 0.5 - (Math.sqrt(total * Math.PI) * Math.acos(0.85)); 
    const x = radius * Math.cos(theta + angleOffset) * Math.sin(phi);
    const y = (Math.random() * 40) - 5; 
    const z = radius * Math.sin(theta + angleOffset) * Math.sin(phi);
    return [x, y, z];
};

export default function MemoryArchive({ onBack }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [forceLoad, setForceLoad] = useState(false);

  // 模拟加载进度
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(prev + Math.random() * 15 + 5, 100);
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);
  
  // --- [NEW] 评论系统状态 ---
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  // “评论记录”面板相关状态
  const [showMyComments, setShowMyComments] = useState(false);
  const [myComments, setMyComments] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const handleFileSelect = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 20 * 1024 * 1024) {
          alert("文件大小不能超过 20MB 哦！");
          return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClearFile = () => {
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
      if (selectedPhoto) {
          fetch(`${API_URL}/api/comments/${selectedPhoto.id}`)
              .then(res => res.json())
              .then(data => {
                  if (data.status === 'success') setComments(data.data || []);
              })
              .catch(err => console.error("Failed to load comments:", err));
      } else {
          setComments([]);
      }
  }, [selectedPhoto]);

  const handleSubmitComment = async (e) => {
      e.preventDefault();
      if (!newComment.trim() && !selectedFile) return;
      setIsSubmitting(true);
      
      try {
          let media_url = null;
          let media_type = null;
          
          if (selectedFile) {
              const formData = new FormData();
              formData.append("file", selectedFile);
              const uploadRes = await fetch(`${API_URL}/api/upload`, { method: "POST", body: formData });
              const uploadData = await uploadRes.json();
              if (uploadData.status === "success") {
                  media_url = uploadData.url;
                  media_type = selectedFile.type.startsWith('video/') ? 'video' : 'image';
              } else { throw new Error("文件上传失败"); }
          }

          const visitorData = JSON.parse(localStorage.getItem('bob_visitor_data') || '{"name":"未命名","avatar":"https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"}');
          const res = await fetch(`${API_URL}/api/comments`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  photo_id: String(selectedPhoto.id), 
                  content: newComment,
                  media_url,
                  media_type,
                  nickname: visitorData.name,
                  avatar: visitorData.avatar,
                  visitor_id: getVisitorId()
              })
          });
          const data = await res.json();
          if (data.status === 'success') {
              setNewComment("");
              handleClearFile();
              // 提交成功后立即重新拉取评论，让新评论马上显示
              const refreshRes = await fetch(`${API_URL}/api/comments/${selectedPhoto.id}`);
              const refreshData = await refreshRes.json();
              if (refreshData.status === 'success') setComments(refreshData.data || []);
              alert("评论发送成功！");
          } else {
              alert(data.message || "提交失败");
          }
      } catch (err) {
          alert("提交失败，请检查网络连接");
          console.error(err);
      } finally {
          setIsSubmitting(false);
      }
  };

  // 打开“评论记录”面板：拉取当前访客在此图片下留下的全部评论
  const handleOpenMyComments = async () => {
      if (!selectedPhoto) return;
      setShowMyComments(true);
      try {
          const vid = getVisitorId();
          const res = await fetch(`${API_URL}/api/my-comments/${selectedPhoto.id}?visitor_id=${encodeURIComponent(vid)}`);
          const data = await res.json();
          if (data.status === 'success') setMyComments(data.data || []);
      } catch (err) {
          console.error("加载我的评论失败:", err);
      }
  };

  // 删除自己的一条评论：校验通过后从本地列表与主评论区同步移除
  const handleDeleteMyComment = async (commentId) => {
      if (!window.confirm("确定删除这条评论吗？删除后无法恢复。")) return;
      setDeletingId(commentId);
      try {
          const vid = getVisitorId();
          const res = await fetch(`${API_URL}/api/comments/${commentId}?visitor_id=${encodeURIComponent(vid)}`, { method: 'DELETE' });
          const data = await res.json();
          if (data.status === 'success') {
              setMyComments(prev => prev.filter(c => c.id !== commentId));
              // 同步刷新主评论区，让被删除的评论消失
              const refreshRes = await fetch(`${API_URL}/api/comments/${selectedPhoto.id}`);
              const refreshData = await refreshRes.json();
              if (refreshData.status === 'success') setComments(refreshData.data || []);
          } else {
              alert(data.message || "删除失败");
          }
      } catch (err) {
          alert("删除失败，请检查网络连接");
          console.error(err);
      } finally {
          setDeletingId(null);
      }
  };

  useEffect(() => {
    if (selectedPhoto?.id === 'v7' && videoRef.current) {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioCtx.createMediaElementSource(videoRef.current);
            const gainNode = audioCtx.createGain();
            gainNode.gain.value = 2.5; 
            source.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            return () => { audioCtx.close(); };
        } catch (e) { console.warn("Audio Boost failed:", e); }
    }
  }, [selectedPhoto]);

  useEffect(() => {
    const timer = setTimeout(() => { if (loadProgress < 100) setForceLoad(true); }, 4500);
    return () => clearTimeout(timer);
  }, [loadProgress]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `body, #root { background: black !important; overflow: hidden; margin: 0; } canvas { background: black !important; }`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const isLoaded = loadProgress === 100 || forceLoad;
  const videoRef = useRef(null);

  const photoPositions = useMemo(() => {
    return PHOTO_DATA.map((_, i) => getNebulaPos(i, PHOTO_DATA.length));
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 5000, backgroundColor: 'black', overflow: 'hidden', color: 'white' }}>
      <AnimatePresence>
        {!isLoaded && (
          <motion.div key="loader" exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, zIndex: 10000, background: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: COLORS.HOT_PINK, fontFamily: 'monospace', letterSpacing: '0.4em', marginBottom: '1.2rem' }}>正在唤醒记忆星海...{Math.round(loadProgress)}%</span>
            <div style={{ width: '240px', height: '1px', background: 'rgba(255,20,147,0.1)', position: 'relative' }}>
                <motion.div style={{ position: 'absolute', height: '100%', background: COLORS.HOT_PINK }} animate={{ width: `${loadProgress}%` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position: 'absolute', top: '2.5rem', left: '2.5rem', zIndex: 6000, display: 'flex', alignItems: 'center', gap: '15px' }}>
        {/* 返回按钮和音乐控制已隐藏 */}
      </div>

      {/* 右上角返回主页按钮 */}
<div style={{ position: 'absolute', top: '2.5rem', right: '2.5rem', zIndex: 6000 }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(25px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'white',
            padding: '1rem 2.2rem',
            borderRadius: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '10px',
            fontWeight: '900',
            letterSpacing: '0.3em',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
          }}
        >
          🏠 返回主页
        </button>
      </div>

      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 15, 80], fov: 42 }} gl={{ alpha: false, antialias: true, logarithmicDepthBuffer: true }}>
        <color attach="background" args={['#000000']} />
        <Suspense fallback={null}>
            <fog attach="fog" args={['#000000', 30, 150]} />
          <group position={[0, -12, 0]}>
            <ParticleWave />
            <StarDust />
            <EnergyBeam />
            <RadiantTree />
            <LuminousPedestal />
            <HeartTop />
            {PHOTO_DATA.map((p, i) => (
              <MediaNode key={p.id} photo={p} position={photoPositions[i]} onSelect={setSelectedPhoto} />
            ))}
          </group>
        </Suspense>
        <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.3} maxPolarAngle={Math.PI / 2 + 0.12} minDistance={45} maxDistance={110} />
      </Canvas>

      <AnimatePresence>
        {selectedPhoto && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 7000, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(40px) saturate(200%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.95 }} style={{ position: 'relative', background: 'rgba(10, 10, 20, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderLeft: '2px solid rgba(0, 255, 255, 0.2)', borderTop: '1px solid rgba(255, 182, 193, 0.15)', borderRadius: '32px', overflow: 'hidden', maxWidth: '1150px', width: '100%', display: 'flex', flexDirection: 'row', height: '80vh', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}>
                <button onClick={() => setSelectedPhoto(null)} style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 8000, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}><X size={20} /></button>
                <div style={{ flex: 1.6, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    {selectedPhoto.type === 'video' ? <video ref={videoRef} src={selectedPhoto.url} autoPlay loop controls style={{ maxHeight: '100%', maxWidth: '100%' }} /> : <img src={selectedPhoto.url} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', transform: selectedPhoto.rotate ? `rotate(${selectedPhoto.rotate}deg)` : 'none', transition: 'transform 0.4s ease' }} />}
                </div>
                <div style={{ flex: 1, padding: '4rem 3rem', color: 'white', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                    <div style={{ color: COLORS.HOT_PINK, display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', flexShrink: 0 }}>
                        <Sparkles size={16} /><span style={{ fontSize: '12px', fontWeight: '900', letterSpacing: '0.4em' }}>精神印记</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', flexShrink: 0 }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: '1', letterSpacing: '-0.02em', whiteSpace: 'pre-line' }}>{selectedPhoto.title}</h2>
                        <button onClick={handleOpenMyComments} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: 'white', padding: '7px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', flexShrink: 0, transition: 'all 0.3s', whiteSpace: 'nowrap' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(254, 44, 85, 0.25)'; e.currentTarget.style.borderColor = 'rgba(254, 44, 85, 0.5)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; }}><MessageCircle size={13} />评论记录</button>
                    </div>
                    {selectedPhoto.location && selectedPhoto.location !== selectedPhoto.title && (
                        <div style={{ alignSelf: 'flex-start', flexShrink: 0, marginBottom: '2rem' }}>
                            <div style={{ fontSize: '10px', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>拍摄地点 / 备注</div>
                            <span style={{ color: 'white', fontSize: '15px', fontWeight: '500', whiteSpace: 'pre-line' }}>{selectedPhoto.location}</span>
                        </div>
                    )}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
                        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '15px', paddingRight: '10px' }} className="custom-scrollbar">
                           {showMyComments ? (
                               <div>
                                   <button onClick={() => setShowMyComments(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', padding: '6px 12px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', marginBottom: '16px', transition: 'all 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}><BackIcon size={13} />返回全部评论</button>
                                   <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '14px', letterSpacing: '0.05em' }}>我在此图片下留下的评论（共 {myComments.length} 条）</div>
                                   {myComments.length === 0 ? (
                                       <div style={{ opacity: 0.4, fontSize: '13px', marginTop: '40px', textAlign: 'center' }}>你还没有在这里留下评论~</div>
                                   ) : (
                                       myComments.map(mc => (
                                           <div key={mc.id} style={{ display: 'flex', gap: '12px', marginBottom: '16px', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                               <div style={{ flex: 1, minWidth: 0 }}>
                                                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                       <span style={{ fontSize: '11px', color: mc.status === 1 ? 'rgba(0,255,136,0.8)' : mc.status === -1 ? 'rgba(255,80,80,0.8)' : 'rgba(255,200,0,0.8)', fontWeight: '700' }}>{mc.status === 1 ? '已公开' : (mc.status === -1 ? '已被拦截' : '待审核')}</span>
                                                       <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>{mc.created_at?.slice(0, 16).replace('T', ' ')}</span>
                                                   </div>
                                                   <div style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)', whiteSpace: 'pre-wrap', marginBottom: '8px' }}>{mc.content}</div>
                                                   {mc.media_url && (
                                                       <div style={{ display: 'inline-block', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                           {mc.media_type === 'video' ? <video src={mc.media_url} style={{ maxWidth: '100%', borderRadius: '8px', maxHeight: '160px' }} controls /> : <img src={mc.media_url} style={{ maxWidth: '100%', borderRadius: '8px', maxHeight: '160px' }} alt="my upload" />}
                                                       </div>
                                                   )}
                                               </div>
                                               <button onClick={() => handleDeleteMyComment(mc.id)} disabled={deletingId === mc.id} style={{ background: 'rgba(254,44,85,0.12)', border: '1px solid rgba(254,44,85,0.3)', color: '#fe2c55', width: '32px', height: '32px', borderRadius: '8px', cursor: deletingId === mc.id ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s', opacity: deletingId === mc.id ? 0.5 : 1 }} onMouseOver={(e) => { if (deletingId !== mc.id) { e.currentTarget.style.background = 'rgba(254,44,85,0.3)'; } }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(254,44,85,0.12)'; }}><Trash2 size={14} /></button>
                                           </div>
                                       ))
                                   )}
                               </div>
                           ) : (
                           comments.length === 0 ? (
                               <div style={{ opacity: 0.4, fontSize: '13px', marginTop: '40px', textAlign: 'center' }}>暂无评论，快来抢沙发~</div>
                           ) : (
                               comments.map(c => (
                                   <div key={c.id} style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                                       {c.avatar ? <img src={c.avatar} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }} alt="avatar" /> : <div style={{ width: '36px', height: '36px', borderRadius: '18px', background: 'rgba(255,255,255,0.1)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{c.nickname ? c.nickname.charAt(0) : (c.location ? c.location.charAt(0) : "匿")}</div>}
                                       <div style={{ flex: 1 }}>
                                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                               <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: '600' }}>{c.nickname || "访客"}</span>
                                               <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>来自 {c.location ? c.location.split(' (')[0] : "未知地域"}</span>
                                           </div>
                                           <div style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,0.95)', whiteSpace: 'pre-wrap', marginBottom: '8px' }}>{c.content}</div>
                                           {c.media_url && (
                                               <div style={{ marginBottom: '10px', display: 'inline-block', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                                                   {c.media_type === 'video' ? <video src={c.media_url} style={{ maxWidth: '100%', borderRadius: '8px', maxHeight: '200px' }} controls /> : <img src={c.media_url} style={{ maxWidth: '100%', borderRadius: '8px', maxHeight: '200px' }} alt="comment upload" onClick={() => window.open(c.media_url)} />}
                                               </div>
                                           )}
                                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.15)' }}><span>{c.created_at?.slice(0, 16).replace('T', ' ')}</span></div>
                                       </div>
                                   </div>
                               ))
                           ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                            {previewUrl && (
                                <div style={{ position: 'relative', display: 'inline-block', width: 'fit-content' }}>
                                    {selectedFile?.type?.startsWith('video/') ? <video src={previewUrl} style={{ height: '80px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }} muted /> : <img src={previewUrl} style={{ height: '80px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }} alt="preview" />}
                                    <button type="button" onClick={handleClearFile} style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'black', borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer', color: 'white' }}><XCircle size={20} fill="#fe2c55" /></button>
                                </div>
                            )}
                            <form onSubmit={handleSubmitComment} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input type="file" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} accept="image/*,video/*" />
                                <button type="button" onClick={() => fileInputRef.current?.click()} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', width: '40px', height: '40px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, color: 'white', transition: 'background 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}><ImageIcon size={18} /></button>
                                <div style={{ flex: 1, position: 'relative' }}><input type="text" placeholder={selectedFile ? "添加描述文字..." : "输入你的评论..."} value={newComment} onChange={(e) => setNewComment(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '12px 16px', borderRadius: '24px', outline: 'none', fontSize: '14px', transition: 'all 0.3s' }} onFocus={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }} onBlur={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }} /></div>
                                <button type="submit" disabled={isSubmitting || (!newComment.trim() && !selectedFile)} style={{ background: isSubmitting ? 'transparent' : ((newComment.trim() || selectedFile) ? '#fe2c55' : 'transparent'), color: (newComment.trim() || selectedFile) ? 'white' : 'rgba(255,255,255,0.3)', border: 'none', padding: '10px 16px', borderRadius: '24px', cursor: (newComment.trim() || selectedFile) ? 'pointer' : 'default', fontWeight: 'bold', fontSize: '14px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>发送</button>
                            </form>
                        </div>
                    </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
