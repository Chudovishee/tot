import axios from 'axios';

export default axios.create({
  headers: {
    timeout: 1000,
    'x-requested-with': 'XMLHttpRequest'
  }
});
