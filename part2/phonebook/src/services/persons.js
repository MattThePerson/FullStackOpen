import axios from "axios"


const url_base = "http://localhost:3001/persons"

// getAll
const getAll = () => {
    const req = axios.get(url_base);
    return req.then(resp => resp.data);
}


// create
const create = (newPerson) => {
    const req = axios
        .post(url_base, newPerson)
    return req.then(resp => resp.data)
}


// update
const update = (id, updatedPerson) => {
    const req = axios
        .put(`http://localhost:3001/persons/${id}`, updatedPerson)
    return req.then(resp => resp.data);
}


export default {
    getAll,
    create,
    update,
}
