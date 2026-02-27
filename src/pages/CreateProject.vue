<template>
  <el-form :model="form" style="max-width: 600px">
    <el-form-item label="项目">
      <el-input v-model="form.name" style="width: 240px" placeholder="项目名称" />
    </el-form-item>
    <el-button type="primary" @click="createProject">创建</el-button>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import axios from '@/api/request';
const form = reactive({
  name: '',
});
import { ElNotification } from 'element-plus'

const showMsg = (msg: string) => {
  ElNotification({
    title: '消息',
    message: msg,
    type: 'success',
    duration: 2000
  })
}

// 创建项目
const createProject = () => {
  axios.post('/api/admin/createProject',
    {
      name: form.name,
    },
  )
    .then(function (response) {
      console.log(response.data);
      if (response.status === 200) {
        showMsg(response.data.msg);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
</script>

<style scoped lang="scss"></style>
