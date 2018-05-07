import { each } from 'lodash';

export default {
  data() {
    return {
      errors: {},
      otherErrors: null
    };
  },
  methods: {
    clearErrors() {
      each(this.errors, (value, field) => {
        this.errors[field] = null;
      });
      this.otherErrors = null;
    },
    handleError(error) {
      let other = [];
      if (error.response && error.response.data) {
        each(error.response.data, (errors, field) => {
          if (this.errors[field] !== undefined) {
            this.errors[field] = errors.join('; ');
          }
          else {
            other = other.concat(errors);
          }
        });
        if (other.length) {
          this.otherErrors = other.join('; ');
        }
      }
      else if (error.response && error.response.statusText) {
        this.otherErrors = error.response.statusText;
      }
      else if (error.message) {
        this.otherErrors = error.message;
      }
      else {
        this.otherErrors = 'Unknown error';
      }
    }
  }
};
