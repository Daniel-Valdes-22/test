import { useEffect, useState } from 'react'
import { buyBook, fetchBooks, fetchPurchases, login } from './api'
import './App.css'

const SESSION_KEY = 'library_user'

function App() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  })
  const [username, setUsername] = useState('alice')
  const [password, setPassword] = useState('password123')
  const [books, setBooks] = useState([])
  const [purchases, setPurchases] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return

    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const [bookList, purchaseList] = await Promise.all([
          fetchBooks(user.id),
          fetchPurchases(user.id),
        ])
        if (!cancelled) {
          setBooks(bookList)
          setPurchases(purchaseList)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [user])

  async function handleLogin(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const loggedIn = await login(username.trim(), password)
      localStorage.setItem(SESSION_KEY, JSON.stringify(loggedIn))
      setUser(loggedIn)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
    setBooks([])
    setPurchases([])
    setMessage('')
    setError('')
  }

  async function handleBuy(bookId) {
    setError('')
    setMessage('')
    try {
      await buyBook(bookId, user.id)
      const [bookList, purchaseList] = await Promise.all([
        fetchBooks(user.id),
        fetchPurchases(user.id),
      ])
      setBooks(bookList)
      setPurchases(purchaseList)
      setMessage('Purchase recorded.')
    } catch (err) {
      setError(err.message)
    }
  }

  if (!user) {
    return (
      <div className="page">
        <main className="panel login-panel">
          <h1>Library</h1>
          <p className="lede">Sign in to browse the catalog and buy books.</p>
          <form onSubmit={handleLogin} className="login-form">
            <label>
              Username
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="hint">Demo users: alice / password123 · bob / password123</p>
          {error ? <p className="error">{error}</p> : null}
        </main>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>Library</h1>
          <p className="lede">Signed in as {user.username}</p>
        </div>
        <button type="button" className="ghost" onClick={handleLogout}>
          Log out
        </button>
      </header>

      {error ? <p className="error banner">{error}</p> : null}
      {message ? <p className="success banner">{message}</p> : null}

      <section className="panel">
        <h2>Catalog</h2>
        {loading ? <p>Loading books…</p> : null}
        <ul className="book-list">
          {books.map((book) => (
            <li key={book.id} className="book-row">
              <div>
                <h3>{book.title}</h3>
                <p className="meta">
                  {book.author} · ${book.price.toFixed(2)}
                </p>
                <p>{book.description}</p>
              </div>
              {book.owned ? (
                <span className="owned">Owned</span>
              ) : (
                <button type="button" onClick={() => handleBuy(book.id)}>
                  Buy
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Your purchases</h2>
        {purchases.length === 0 ? (
          <p className="hint">No purchases yet.</p>
        ) : (
          <ul className="purchase-list">
            {purchases.map((purchase) => (
              <li key={purchase.id}>
                {purchase.book.title} —{' '}
                {new Date(purchase.purchased_at).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default App
