import axios from 'axios'
const baseUrl = '/api/login'

const authenticateUser = async (username, password) => {
    try {
        const res = await axios.post(baseUrl, { username, password })
        return res.data
    } catch {
        return null
    }
}

export default {
    authenticateUser,
}
