<template>
  <div class="outer">
    <el-card class="form-outer">
      <form action="#" method="post" class="form">
        <h2>网络验证系统</h2>
        <el-form :model="form" style="max-width: 600px">
          <el-form-item label="账号">
            <el-input v-model="form.username" style="width: 240px" placeholder="请输入账号" />
          </el-form-item>

          <el-form-item label="密码">
            <el-input v-model="form.password" style="width: 240px" placeholder="请输入密码" show-password />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login">登录</el-button>
            <el-button @click="register">注册</el-button>
          </el-form-item>
        </el-form>
      </form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/api/request'
const router = useRouter()
const form = reactive({
  username: '',
  password: '',
})

const login = () => {
  console.log('login!')

  axios.post('/api/login', {
    username: form.username,
    password: form.password
  })
    .then(function (response) {
      if (response.data.msg == '登录成功') {
        localStorage.setItem('token', "Bearer " + response.data.data.token);
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
        localStorage.setItem('username', response.data.data.username);
        // window.location.href = '/';
        router.push('/')
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
const register = () => {
  console.log('register!')
}

// 全局监听 Enter 键（适配输入框按 Enter 登录）
const handleGlobalEnter = (e: KeyboardEvent) => {
  // 排除输入框按 Enter 时的默认行为（如换行），同时触发登录
  if (e.key === 'Enter' && e.target && ['INPUT'].includes((e.target as HTMLElement).tagName)) {
    login();
    e.preventDefault();
  }
};

// 挂载时监听，卸载时移除（避免内存泄漏）
onMounted(() => {
  window.addEventListener('keydown', handleGlobalEnter);
});
onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalEnter);
});
</script>

<style scoped lang="scss">
.outer {
  width: 100%;
  height: 100vh;
  background-color: skyblue;
  display: flex;

  .form-outer {
    margin: auto;
    width: 400px;
    height: 400px;
    display: flex;

    .form {
      margin: auto;
      padding-top: 100px;
      width: 300px;
      height: 300px;

      h2 {
        text-align: center;
        margin-bottom: 15px;
      }
    }
  }
}
</style>
