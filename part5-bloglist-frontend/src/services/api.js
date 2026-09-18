import axios from 'axios'

const request = async (promise) => {
    try {
        const res = await promise

        return {
            data: res.data,
            status: res.status,
            good: true,
        }
    } catch (err) {
        return {
            data: err.response?.data,
            status: err.response?.status,
            good: false,
        }
    }
}

const api = {
    get: (url, config) => request(axios.get(url, config)),
    post: (url, data, config) => request(axios.post(url, data, config)),
}

export default api
