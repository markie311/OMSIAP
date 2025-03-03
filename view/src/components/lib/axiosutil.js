import axios from 'axios';

const axiosCreatedInstace = axios.create({baseURL: 'http://localhost:4000/'});
//const axiosCreatedInstace = axios.create({baseURL: 'https://vanguard-hjpg.onrender.com/'});

export default axiosCreatedInstace;