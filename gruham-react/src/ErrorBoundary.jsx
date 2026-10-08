import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { err: null }

  static getDerivedStateFromError(err) {
    return { err }
  }

  componentDidCatch(err) {
    console.error(err)
  }

  render() {
    const { err } = this.state
    if (!err) return this.props.children
    const msg = String((err && err.message) || err)
    if (this.props.fallback) return this.props.fallback(msg)
    return (
      <div style={{ maxWidth: 760, margin: '80px auto', padding: '0 24px' }}>
        <h2 style={{ marginBottom: 16 }}>Something went wrong on this page</h2>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#fff', border: '1px solid #E8DDB5', padding: 16, marginBottom: 20 }}>{msg}</pre>
        <button className="btn" onClick={() => window.location.reload()}>Reload</button>
      </div>
    )
  }
}