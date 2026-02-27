<template>
  <el-text class="mx-1">项目：</el-text>
  <el-select v-model="currentProject" :placeholder="currentProject" style="width: 200px">
    <el-option v-for="item in projects" :key="item._id" :label="item.name" :value="item.name" />
  </el-select>

  <el-text class="mx-1">状态：</el-text>
  <el-select v-model="currentStatus.name" :placeholder="currentStatus.desc" style="width: 200px">
    <el-option v-for="item in status" :key="item.name" :label="item.desc" :value="item.name" />
  </el-select>
  <el-table :data="cards.cards" style="width: 100%">
    <el-table-column type="index" width="50" />
    <el-table-column prop="pid.name" label="项目" width="180" />
    <el-table-column prop="code" label="卡密" width="180" />
    <el-table-column prop="status" label="状态" width="180" :formatter="getStatusDesc" />
    <el-table-column prop="duration" label="总时长(小时)" width="180" />
    <el-table-column prop="expireTime" label="过期时间" width="180" :formatter="formatExpireTime" />
    <el-table-column fixed="right" label="操作" min-width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="deleteCard(scope.row.code)">
          删除
        </el-button>
        <el-button link type="primary" size="small">封禁</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination :page-size="cards.pagination.pageCount" :pager-count="11" layout="prev, pager, next"
    :total="cards.pagination.total" :current-page="currentPage" @update:current-page="changePage" />


</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { ElNotification, ElMessageBox } from 'element-plus'

import axios from '@/api/request';
const currentPage = ref(1)
const projects: {
  _id: string,
  name: string
}[] = reactive([]);
const status = reactive([{ name: "all", desc: "所有" }, { name: "unused", desc: "未使用" }, { name: "used", desc: "已使用" }, { name: "expired", desc: "已过期" }]);
const cards = reactive({
  cards: [],
  pagination: {
    total: 0,
    pageCount: 0,
    totalPage: 0
  }
});

const currentProject = ref('')
const currentStatus = reactive({ name: "all", desc: "所有" })

const deleteCard = (code: string) => {

  ElMessageBox.confirm(
    '确定要删除该项目吗？删除后相关卡密可能也会被清理！',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {

    axios.get('/api/admin/deleteCards',
      {
        params: {
          code: code
        }
      }
    )
      .then(function (response) {
        if (response.status === 200) {
          ElNotification({
            title: '成功',
            message: response.data.msg || '删除成功',
            type: 'success',
            duration: 2000
          })
          getCards()
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
watch(currentProject, (value) => {
  console.log("currentProject", value)
  currentProject.value = value
  getCards()
})
watch(() => currentStatus.name, (value) => {
  console.log("currentStatus", value)
  // 同步更新 desc（可选）
  const matched = status.find(item => item.name === value);
  if (matched) currentStatus.desc = matched.desc;
  getCards()
})


// 改变页码
function changePage(currPage: number, count: number = 10) {
  currentPage.value = currPage
  console.log("changePage", currentPage, count)
  getCards()
}

// 过期时间格式化
const formatExpireTime = (row: { expireTime: string }) => {
  if (row.expireTime) {
    const time = new Date(row.expireTime);
    return time.toLocaleString();
  }
}
// 获取状态描述
const getStatusDesc = (row: { status: string }) => {
  if (row.status === "used") {
    return "已使用";
  } else if (row.status === "unused") {
    return "未使用";
  } else if (row.status === "expired") {
    return "已过期";
  }
  return "意外错误";
}
const getProjects = () => {
  axios.get('/api/admin/projects',

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
const getCards = () => {
  axios.get('/api/admin/cards',
    {
     
      params: {
        page: currentPage.value,
        count: 10,
        pName: currentProject.value,
        status: currentStatus.name
      }
    }
  )
    .then(function (response) {
      // console.log(response.data.data.pagination.totalPage);
      // console.log(response.data.data);
      Object.assign(cards, response.data.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
onMounted(() => {
  getProjects()
  getCards()
});
</script>

<style scoped lang="scss"></style>
