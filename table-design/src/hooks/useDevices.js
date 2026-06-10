import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export const useDevices = () => {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDevices = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_URL}/devices`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch devices')
      }
      
      const data = await response.json()
      if (data.success) {
        setDevices(data.data)
      }
    } catch (err) {
      setError(err.message)
      console.error('Error fetching devices:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  return { devices, loading, error, refetch: fetchDevices }
}
