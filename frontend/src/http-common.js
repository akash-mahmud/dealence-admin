import axios from 'axios';

export default axios.create({
  baseURL: '/ea',
  headers: {
    'Content-type': 'application/json',
  },
});
