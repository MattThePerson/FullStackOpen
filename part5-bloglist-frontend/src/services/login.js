import api from './api'

const baseUrl = '/api/login'

const authenticateUser = async (username, password) => {
    const data = { username, password }
    return api.post(baseUrl, data)
}

export default {
    authenticateUser,
}
