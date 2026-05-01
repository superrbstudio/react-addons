interface ApiResponse {
  success: boolean
  error?: string
  errors?: Record<string, string[]>
  message?: string
}

export default ApiResponse
