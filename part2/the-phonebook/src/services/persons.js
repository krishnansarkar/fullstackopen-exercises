import axios from "axios";

const baseUrl = "http://localhost:3002/persons";

const getAll = () => {
    return axios.get(baseUrl).then((response) => response.data);
};

const post = (data) => {
    return axios.post(baseUrl, data).then((response) => response.data);
};

const put = (id, data) => {
    return axios
        .put(`${baseUrl}/${id}`, data)
        .then((response) => response.data);
};

const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`).then((response) => response.data);
};

export default { getAll, post, put, remove };
