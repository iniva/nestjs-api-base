import axios from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:8091',
  timeout: 5000,
})
