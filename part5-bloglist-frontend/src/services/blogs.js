import api from './api'

const baseUrl = '/api/blogs'

let authToken = null

const setAuthToken = (t) => {
    authToken = t
}

const getAll = () => {
    return api.get(baseUrl)
}

const create = async (title, author, url) => {
    const config = {
        headers: { Authorization: `Bearer ${authToken}` }
    }
    const body = { title, author, url }
    return api.post(baseUrl, body, config)
}

export default {
    getAll,
    create,
    setAuthToken,
}
