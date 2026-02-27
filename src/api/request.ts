import axios from 'axios'

// 根据域名/环境变量判断
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  // 本地开发环境：直接访问后端 3000 端口
  axios.defaults.baseURL = 'http://localhost:3000'
} else {
  // 生产环境（服务器）：走 Nginx 代理（相对路径）
  axios.defaults.baseURL = '/'
}
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
axios.defaults.headers.common['Content-Type'] = 'application/json'

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    if (config.url?.indexOf('/api/login') === -1) {
      const token = localStorage.getItem('token')
      if (!token) {
        return Promise.reject(new Error('请先登录'))
      }
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

export default axios
