async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  let data = null
  const text = await response.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { detail: text }
    }
  }

  if (!response.ok) {
    const detail = data?.detail || 'Request failed'
    throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail))
  }

  return data
}

export function login(username, password) {
  return request('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export function fetchBooks(userId) {
  const query = userId ? `?user_id=${userId}` : ''
  return request(`/api/books${query}`)
}

export function buyBook(bookId, userId) {
  return request(`/api/books/${bookId}/buy?user_id=${userId}`, {
    method: 'POST',
  })
}

export function fetchPurchases(userId) {
  return request(`/api/purchases?user_id=${userId}`)
}
