<template>
  <!-- 卡密数量 项目名称 -->
  <el-text class="mx-1">项目：</el-text>
  <el-select v-model="currentProject" :placeholder="currentProject" style="width: 200px">
    <el-option v-for="item in projects" :key="item._id" :label="item.name" :value="item.name" />
  </el-select>
  <form action="#" method="post" class="form" style="margin-top: 20px;">
    <el-form :model="form" style="max-width: 600px">
      <el-form-item label="项目">
        <el-input v-model="form.project" style="width: 240px" placeholder="项目名称" />
      </el-form-item>
      <el-form-item label="数量">
        <el-input v-model="form.count" style="width: 240px" placeholder="生成数量" />
      </el-form-item>
      <el-form-item label="时长">
        <el-input v-model="form.duration" style="width: 240px" placeholder="时长(小时)" />
      </el-form-item>
      <el-button type="primary" @click="generateCards">生成</el-button>
    </el-form>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue';
import axios from 'axios';
import { ElNotification } from 'element-plus'
const form = reactive({
  project: '',
  count: '',
  duration: ''
})
const projects: {
  _id: string,
  name: string
}[] = reactive([]);
const currentProject = ref('')

const showMsg = (msg: string) => {
  ElNotification({
    title: '消息',
    message: msg,
    type: 'success',
    duration: 2000
  })
}

watch(currentProject, (value) => {
  console.log("currentProject", value)
  currentProject.value = value
  form.project = value
})
// 生成卡密
const generateCards = () => {
  console.log(localStorage.getItem('token'))
  axios.post('http://localhost:3000/api/admin/generate',
    {
      project: form.project,
      count: form.count,
      duration: form.duration
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    }
  )
    .then(function (response) {
      console.log(response.data);
      showMsg(response.data.msg)
    })
    .catch(function (error) {
      console.log(error);
    });
}
const getProjects = () => {
  axios.get('http://localhost:3000/api/admin/projects',
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    }
  )
    .then(function (response) {
      console.log(response.data.data);
      Object.assign(projects, response.data.data);
      if (projects.length > 0) {
        currentProject.value = projects[0]?.name || ""
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
onMounted(() => {
  getProjects()
});
</script>

<style scoped lang="scss"></style>
