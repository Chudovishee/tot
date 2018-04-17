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
    handleError(response) {
      let other = [];
      if (response.data) {
        each(response.data, (errors, field) => {
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
      else if (response.statusText) {
        this.otherErrors = response.statusText;
      }
      else {
        this.otherErrors = 'Unknown error';
      }
    }
  }
};
