const { app, BrowserWindow } = require('electron')
const path = require('path')

// 创建一个窗口
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  })

  // 在开发环境下，我们加载Vite开发服务器的URL
  // 在生产环境下，我们加载打包后的文件
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173') // Vite默认的端口是5173，如果你更改了端口，请相应调整
    // 打开开发者工具
    win.webContents.openDevTools()
  } else {
    // 生产环境加载打包后的文件
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})