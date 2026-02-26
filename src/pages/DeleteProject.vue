<template>
  <el-form style="max-width: 600px">
    <el-form-item label="项目">
      <el-select v-model="currentProject" placeholder="请选择项目" style="width: 200px" :disabled="!projects.length">
        <el-option v-for="item in projects" :key="item._id" :label="item.name" :value="item.name" />
      </el-select>
    </el-form-item>
  </el-form>
  <el-button type="primary" @click="deleteProject" :disabled="!currentProject">
    删除
  </el-button>
</template>

<script setup lang="ts">
import { useProjectStore } from '@/stores/project';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { ElNotification, ElMessageBox } from 'element-plus'

// 解构响应式数据
const projectStore = useProjectStore()
const { currentProject, projects } = storeToRefs(projectStore)
const { getProjects } = projectStore

// 删除项目（增加二次确认）
const deleteProject = () => {
  if (!currentProject.value) return

  ElMessageBox.confirm(
    '确定要删除该项目吗？删除后相关卡密可能也会被清理！',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    axios.get('http://localhost:3000/api/admin/deleteProject', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      },
      params: {
        name: currentProject.value
      }
    })
      .then(function (response) {
        if (response.status === 200) {
          ElNotification({
            title: '成功',
            message: response.data.msg || '项目删除成功',
            type: 'success',
            duration: 2000
          })
          // 重新拉取项目列表（此时仓库已改为 ref，会实时更新）
          getProjects()
        }
      })
      .catch(function (error) {
        ElNotification({
          title: '失败',
          message: error.response?.data?.msg || '删除失败',
          type: 'error',
          duration: 2000
        })
        console.log(error);
      });
  }).catch(() => {
    ElNotification({
      title: '取消',
      message: '已取消删除操作',
      type: 'info',
      duration: 1500
    })
  })
}

onMounted(() => {
  getProjects()
});
</script>
