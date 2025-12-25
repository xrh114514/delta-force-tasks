const { app, BrowserWindow, screen } = require('electron')
const path = require('path')
const fs = require('fs')
const http = require('http')
const finalhandler = require('finalhandler')
const serveStatic = require('serve-static')

// 配置
const isDev = false//!app.isPackaged
const PORT = 43970
const APP_DIR = 'app' // 前端文件目录
const WINDOW_STATE_FILE = path.join(app.getPath('userData'), 'window-state.json')

let server = null
let mainWindow = null

// 窗口状态管理
function getWindowState() {
  try {
    const data = fs.readFileSync(WINDOW_STATE_FILE, 'utf8')
    const state = JSON.parse(data)

    // 验证状态是否在屏幕范围内
    const { width, height, x, y } = state
    const displays = screen.getAllDisplays()

    for (const display of displays) {
      const bounds = display.bounds
      if (
        x >= bounds.x && x <= bounds.x + bounds.width &&
        y >= bounds.y && y <= bounds.y + bounds.height &&
        width <= bounds.width && height <= bounds.height
      ) {
        return state
      }
    }
  } catch (err) {
    // 文件不存在或格式错误，使用默认值
  }

  // 默认窗口状态
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize

  return {
    width: Math.min(1200, screenWidth),
    height: Math.min(800, screenHeight),
    x: Math.floor((screenWidth - 1200) / 2),
    y: Math.floor((screenHeight - 800) / 2),
    isMaximized: false
  }
}

function saveWindowState(window) {
  if (!window || window.isDestroyed()) return

  try {
    const state = {
      width: window.getNormalBounds().width,
      height: window.getNormalBounds().height,
      x: window.getNormalBounds().x,
      y: window.getNormalBounds().y,
      isMaximized: window.isMaximized()
    }

    fs.writeFileSync(WINDOW_STATE_FILE, JSON.stringify(state, null, 2))
  } catch (err) {
    console.error('保存窗口状态失败:', err)
  }
}

// 启动静态文件服务器
function startStaticServer() {
  return new Promise((resolve, reject) => {
    if (server) {
      server.close()
    }

    // 设置静态文件服务
    const serve = serveStatic(path.join(__dirname, APP_DIR), {
      index: ['index.html'],
      setHeaders: (res, filePath) => {
        // 禁用缓存
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
        res.setHeader('Pragma', 'no-cache')
        res.setHeader('Expires', '0')
        res.setHeader('Surrogate-Control', 'no-store')
      }
    })

    // 创建服务器
    server = http.createServer((req, res) => {
      // SPA 路由支持：所有未找到的文件都返回 index.html
      const done = finalhandler(req, res)

      serve(req, res, (err) => {
        if (err) {
          // 文件未找到，返回 index.html 用于 SPA 路由
          if (err.statusCode === 404) {
            req.url = '/index.html'
            serve(req, res, done)
          } else {
            done(err)
          }
        }
      })
    })

    server.listen(PORT, '127.0.0.1', (err) => {
      if (err) {
        reject(err)
      } else {
        console.log(`✅ 静态文件服务器运行在 http://127.0.0.1:${PORT}`)
        resolve()
      }
    })
  })
}

function createWindow() {
  const windowState = getWindowState()

  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    x: windowState.x,
    y: windowState.y,
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
    show: false, // 先隐藏，等加载完成再显示
    webPreferences: {
      nodeIntegration: false, // 禁用 Node.js 集成
      contextIsolation: true, // 启用上下文隔离
      webSecurity: false, // 允许加载本地资源
      // 不设置 preload
    }
  })

  // 监听窗口事件保存状态
  mainWindow.on('close', () => {
    saveWindowState(mainWindow)
  })

  // 移除可能导致问题的resize和move事件监听器，只在close事件时保存状态
  // 这些频繁触发的事件在窗口销毁过程中可能导致问题
  /*
  mainWindow.on('resize', () => {
    if (!mainWindow.isMaximized()) {
      saveWindowState(mainWindow)
    }
  })

  mainWindow.on('move', () => {
    if (!mainWindow.isMaximized()) {
      saveWindowState(mainWindow)
    }
  })

  mainWindow.on('maximize', () => {
    saveWindowState(mainWindow)
  })

  mainWindow.on('unmaximize', () => {
    saveWindowState(mainWindow)
  })
  */

  // 加载页面
  if (isDev) {
    // 开发环境：连接到 Vite 开发服务器
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
    mainWindow.show()
  } else {
    // 生产环境：启动本地服务器服务打包文件
    startStaticServer()
      .then(() => {
        mainWindow.loadURL(`http://localhost:${PORT}`)
        mainWindow.show()
      })
      .catch(err => {
        console.error('启动服务器失败:', err)

        // 尝试备用方案
        try {
          mainWindow.loadFile(path.join(__dirname, APP_DIR, 'index.html'))
          mainWindow.show()
        } catch (loadErr) {
          console.error('加载文件失败:', loadErr)
          // 显示错误页面
          mainWindow.loadURL(`data:text/html;charset=utf-8,
            <html>
              <body style="padding: 40px; font-family: sans-serif;">
                <h1>应用启动失败</h1>
                <p>错误: ${err.message}</p>
                <button onclick="location.reload()">重试</button>
              </body>
            </html>
          `)
          mainWindow.show()
        }
      })
  }

  // 可选：监听页面加载错误
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('页面加载失败:', errorCode, errorDescription)
  })
}

// 应用生命周期
app.whenReady().then(createWindow)

// 应用关闭时停止服务器
app.on('before-quit', () => {
  if (server) {
    server.close()
    console.log('🛑 静态文件服务器已停止')
  }
  // 移除before-quit中的saveWindowState调用，避免与close事件冲突
  // saveWindowState(mainWindow)
})

// macOS 特殊处理
app.on('window-all-closed', () => {
  // 移除window-all-closed中的额外事件绑定
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})