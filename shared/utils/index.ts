// [2025-01-07 12:00] - Shared utility functions

// Format currency for display
export function formatCurrency(amount: number, currency: string = 'THB'): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Format date for display
export function formatDate(date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    case 'long':
      return dateObj.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
    case 'time':
      return dateObj.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit'
      })
    default:
      return dateObj.toLocaleDateString('th-TH')
  }
}

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Generate random ID
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `${prefix}${timestamp}${randomStr}`
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number (Thai format)
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+66|0)[0-9]{8,9}$/
  return phoneRegex.test(phone.replace(/\s|-/g, ''))
}

// Format phone number for display
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('66')) {
    return `+66 ${cleaned.substring(2, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`
  } else if (cleaned.startsWith('0')) {
    return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`
  }
  return phone
}

// Calculate time ago
export function timeAgo(date: string | Date): string {
  const now = new Date()
  const past = typeof date === 'string' ? new Date(date) : date
  const diffInMs = now.getTime() - past.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 1) return 'just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInDays < 7) return `${diffInDays}d ago`
  return formatDate(past, 'short')
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

// Local storage helpers with error handling
export const localStorage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue
    }
  },

  set<T>(key: string, value: T): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  },

  remove(key: string): void {
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  }
}

// Session storage helpers
export const sessionStorage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from sessionStorage:', error)
      return defaultValue
    }
  },

  set<T>(key: string, value: T): void {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error writing to sessionStorage:', error)
    }
  },

  remove(key: string): void {
    try {
      window.sessionStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from sessionStorage:', error)
    }
  }
}

// API response helpers
export function isApiError(response: any): boolean {
  return response && typeof response === 'object' && 'error' in response
}

export function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.error?.message) return error.error.message
  return 'An unexpected error occurred'
} 