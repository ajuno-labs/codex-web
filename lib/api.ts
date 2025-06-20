const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api'

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
}

export interface ErrorResponse {
  error: string
}

export interface ValidationError {
  error: string
  messages: Record<string, string[]>
}

export interface User {
  id: string
  email: string
  created_at: string
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: ErrorResponse | ValidationError
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const response = await fetch(url, {
    credentials: 'include', // Include cookies for refresh token
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(
      `API request failed: ${response.status}`,
      response.status,
      data
    )
  }

  return data
}

export const authApi = {
  // Login with email and password
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },

  // Get OAuth provider URL
  async getOAuthUrl(provider: 'google' | 'github'): Promise<{ redirect_url: string }> {
    return apiRequest<{ redirect_url: string }>(`/auth/oauth/${provider}/url`)
  },

  // Refresh access token
  async refreshToken(): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/refresh', {
      method: 'POST',
    })
  },

  // Logout
  async logout(): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/auth/logout', {
      method: 'POST',
    })
  },

  // Get current user (requires authentication)
  async getCurrentUser(accessToken: string): Promise<User> {
    return apiRequest<User>('/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
}

export { ApiError } 