import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const sendMessage = async ({ messages, image, settings }) => {
  const formData = new FormData()
  formData.append('messages', JSON.stringify(messages))
  formData.append('settings', JSON.stringify(settings))
  if (image) formData.append('image', image)

  const res = await axios.post(`${BASE_URL}/chat`, formData)
  return res.data
}