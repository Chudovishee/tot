module.exports = {
  
  env: {
    node: true
  },
  extends: ['airbnb-base'],
  'rules': {
    'class-methods-use-this': 0,
    'comma-dangle': 0,
    'func-names': 0,
    'no-param-reassign': 0,
    'brace-style': ['error', 'stroustrup'],
    'no-await-in-loop': 0
  }
};
