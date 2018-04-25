const validate = require('validate.js');

const Base = require('./base');

class Dashboard extends Base {
  fetch(db) {
    this.data = db.get('dashboards')
      .find({ name: this.get('name') });
    return this;
  }

  shortPublish() {
    return this.data.pick(['name', 'description']).value();
  }

  publish() {
    return this.data.pick(['name', 'description', 'grid']).value();
  }

  createValidate(db) {
    const fields = this.data.value();

    let errors = validate(fields, {
      name: {
        presence: true,
        format: {
          pattern: /^[\w]{1,20}$/,
          message: 'must be string with 1-20 characters'
        }
      },
      description: {
        format: {
          pattern: /^[\w ]{0,64}$/,
          message: 'must be string with 0-64 characters'
        }
      }
    });

    if ((!errors || Object.keys(errors).length === 0) &&
      db.get('dashboards').find({ name: fields.name }).value()) {
      errors = {
        name: [`Dashboard with name "${fields.name}" already exists`]
      };
    }

    return errors;
  }
}

module.exports = Dashboard;
