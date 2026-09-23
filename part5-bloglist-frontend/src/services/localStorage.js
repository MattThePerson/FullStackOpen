
export default {
  get: (key) => window.localStorage.getItem(key),
  set: (key, value) => window.localStorage.setItem(key, value),
  remove: (key) => window.localStorage.removeItem(key),
  getJson: (key) => JSON.parse(window.localStorage.getItem(key)),
  setJson: (key, value) => window.localStorage.setItem(key, JSON.stringify(value)),
  clear: () => window.localStorage.clear(),
}
