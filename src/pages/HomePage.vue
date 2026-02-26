<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="2">
          </el-col>
          <el-col :span="22">
            <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" background-color="#545c64"
              text-color="#fff" active-text-color="#ffd04b" @select="handleSelect" :ellipsis="false">

              <el-menu-item index="1">网络验证系统</el-menu-item>
              <el-sub-menu index="3" style="margin-left: auto">
                <template #title>{{ username }}</template>
                <el-menu-item index="2-1" @click="logout">退出登录</el-menu-item>
              </el-sub-menu>
            </el-menu>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside>

          <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
            default-active="2" text-color="#fff">
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <Grid />
                </el-icon>
                <span>项目管理</span>
              </template>

              <router-link to="/home/createProject">
                <el-menu-item index="createProject">
                  <el-icon>
                    <Plus />
                  </el-icon>
                  创建项目</el-menu-item>
              </router-link>
              <router-link to="/home/deleteProject">
                <el-menu-item index="deleteProject">
                  <el-icon>
                    <Delete />
                  </el-icon>删除项目</el-menu-item>
              </router-link>
            </el-sub-menu>
            <router-link to="/home/cardList">
              <el-menu-item index="cardList">
                <el-icon>
                  <Memo />
                </el-icon>
                <span>查看卡密</span>
              </el-menu-item>
            </router-link>
            <router-link to="/home/generateCards">
              <el-menu-item index="generateCards">
                <el-icon>
                  <CirclePlus />
                </el-icon>
                <span>生成卡密</span>
              </el-menu-item>
            </router-link>
          </el-menu>


        </el-aside>
        <el-container>
          <el-main>
            <RouterView />
          </el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>


</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  CirclePlus,
  Memo,
  Grid,
  Delete,
  Plus
  // Setting,
} from '@element-plus/icons-vue'



const activeIndex2 = ref('1')
const router = useRouter()
const username = ref('')

const showUsername = () => {
  username.value = localStorage.getItem('username') || '未知'
}
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}



onMounted(() => {
  showUsername()
});
</script>

<style scoped lang="scss">
.el-header {
  padding: 0;
  background-color: #545c64;
}

.el-menu-vertical-demo {
  height: calc(100vh - 60px);
}
</style>
