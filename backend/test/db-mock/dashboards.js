module.exports = {
  users: [
    {
      name: 'admin',
      password: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
      token: '61540aa1864e8980884e33587507e74c0f88189dbee097584d91b1f492c23dcc',
      token_expire: 2525067467409,
      access: 3
    },
    {
      name: 'configure',
      password: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
      token: '71540aa1864e8980884e33587507e74c0f88189dbee097584d91b1f492c23dcc',
      token_expire: 2525067467409,
      access: 2
    },
    {
      name: 'user',
      password: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
      token: '81540aa1864e8980884e33587507e74c0f88189dbee097584d91b1f492c23dcc',
      token_expire: 2525067467409,
      access: 1
    }
  ],
  dashboards: [
    {
      name: 'one',
      description: 'one one one',
      grid: [
        { i: '0', x: 0, y: 0, w: 1, h: 1 },
        { i: '1', x: 1, y: 0, w: 1, h: 1 }
      ]
    },
    {
      name: 'two',
      description: 'two two two',
      grid: [
        { i: '0', x: 0, y: 0, w: 1, h: 1 },
        { i: '1', x: 1, y: 0, w: 1, h: 1 },
        { i: '2', x: 0, y: 1, w: 1, h: 1 },
        { i: '3', x: 1, y: 1, w: 1, h: 1 }
      ]
    }
  ]
};
