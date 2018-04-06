import axios from 'axios';

export default axios.create({
  timeout: 1000,
  headers: {
    'x-requested-with': 'XMLHttpRequest'
  }
});
