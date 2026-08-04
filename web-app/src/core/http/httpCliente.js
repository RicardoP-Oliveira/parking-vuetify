export function createHttpClient() {
  const getToken = () => localStorage.getItem('token')

  const withAuth = (fn) => (...args) => {
    const token = `Bearer ${getToken()}`
    return fn(...args, token)
  }

  return { withAuth }
}