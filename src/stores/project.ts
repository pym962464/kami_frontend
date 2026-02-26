import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
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
      .get('http://localhost:3000/api/admin/projects', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      })
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
