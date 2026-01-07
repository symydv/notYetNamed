import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

export default api;

//so we int have to write axios. whole url evry time we ca just use api. and /video something check on hom epage how we use it