type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: HTTPMethod
  body?: any
  headers?: HeadersInit
}

class APIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

/**
 * API client with error handling
 */
async function fetcher<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {} } = options

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  }

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new APIError(
        response.status,
        response.statusText,
        errorData.message || errorData.error || 'An error occurred'
      )
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }

    // Network error or other fetch error
    throw new Error('Network error. Please check your connection.')
  }
}

/**
 * API client methods
 */
export const api = {
  get: <T>(url: string, headers?: HeadersInit) =>
    fetcher<T>(url, { method: 'GET', headers }),

  post: <T>(url: string, body?: any, headers?: HeadersInit) =>
    fetcher<T>(url, { method: 'POST', body, headers }),

  put: <T>(url: string, body?: any, headers?: HeadersInit) =>
    fetcher<T>(url, { method: 'PUT', body, headers }),

  patch: <T>(url: string, body?: any, headers?: HeadersInit) =>
    fetcher<T>(url, { method: 'PATCH', body, headers }),

  delete: <T>(url: string, headers?: HeadersInit) =>
    fetcher<T>(url, { method: 'DELETE', headers })
}

export { APIError }
