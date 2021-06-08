import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://create-constituencies-default-rtdb.firebaseio.com/'
});

export default instance;