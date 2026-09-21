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

const update = async ({ id, title, author, url, likes, user }) => {
    const config = {
        headers: { Authorization: `Bearer ${authToken}` }
    }
    const body = { title, author, url, likes, user }
    return api.put(`${baseUrl}/${id}`, body, config)
}

const remove = async (id) => {
    const config = {
        headers: { Authorization: `Bearer ${authToken}` }
    }
    return api.delete(`${baseUrl}/${id}`, config)
}

export default {
    getAll,
    create,
    update,
    remove,
    setAuthToken,
}
