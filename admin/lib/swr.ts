import useSWR, { mutate } from 'swr'
import api from './api'

const fetcher = (url: string) => api.get(url).then(res => {
  // Handle different response structures
  // Backend returns { data: [...], pagination: {...} } for paginated endpoints
  // Extract the actual data array
  if (res.data && res.data.data && Array.isArray(res.data.data)) {
    return res.data.data
  }
  // If it's already an array, return it
  if (Array.isArray(res.data)) {
    return res.data
  }
  // If it's an object with data property, return data
  if (res.data && typeof res.data === 'object') {
    return res.data
  }
  // Otherwise return the full response
  return res
}).catch(error => {
  // Return empty array or null to prevent crashes
  return null
})

export function useSWRData(url: string | null, options?: any) {
  return useSWR(url, fetcher, {
    revalidateOnFocus: false, // Disable revalidation on focus to prevent blinking
    revalidateOnReconnect: false, // Disable revalidation on reconnect to prevent blinking
    dedupingInterval: 60000, // Reduce deduping interval to 1 minute to pick up database changes faster
    refreshInterval: 0, // Don't auto-refresh, only on mutation
    shouldRetryOnError: false, // Disable retry on error to prevent hanging
    errorRetryCount: 0, // No retries on error
    errorRetryInterval: 0, // No retry interval
    loadingTimeout: 3000, // 3 second timeout for loading (reduced from 5s)
    keepPreviousData: true, // Keep previous data while loading to prevent UI flicker
    ...options
  })
}

// Export mutate function for manual cache invalidation
export { mutate }
