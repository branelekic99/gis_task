import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://gis-dev.listlabs.net/api/',
});


