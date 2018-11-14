import axios from "axios";

const instance = axios.create({
  baseURL: "https://react-my-burger-63ecc.firebaseio.com/",
});

export default instance;
