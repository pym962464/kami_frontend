import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from '@/api/request'
export const useProjectStore = defineStore('project', () => {
  const projects = ref<
    {
      _id: string
      name: string
    }[]
  >([])

  const currentProject = ref('')
  const getProjects = () => {
    axios
      .get('/api/admin/projects', {})
      .then(function (response) {
        projects.value = response.data.data || []
        if (projects.value.length > 0) {
          currentProject.value = projects.value[0]?.name || ''
        } else {
          currentProject.value = '' // 无项目时清空
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  return { getProjects, currentProject, projects }
})
