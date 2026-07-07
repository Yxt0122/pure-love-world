import MemoryArchive from './components/MemoryArchive'

function App() {
  const returnToRootHome = () => {
    // 如果有历史记录，优先使用浏览器后退（从主页进入时回到主页）
    if (window.history.length > 1 && document.referrer) {
      window.history.back()
      return
    }
    // 生产环境：跳转到相对路径的主页
    window.location.href = '../index.html#pt=zoom'
  }

  return <MemoryArchive onBack={returnToRootHome} />
}

export default App
