const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const helper = require('./test_helper')
const User = require('../../server/models/user')

const app = require('../../app')
const api = supertest(app)

jest.useRealTimers()

describe('when there is intially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ name: 'master', username: 'root', passwordHash })
    await user.save()
  })

  test('creation ok with unique username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ekiesim',
      name: 'Erkki Esimerkki',
      password: 'ekinpassu'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtend = await helper.usersInDb()
    expect(usersAtend).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtend.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with statuscode 400 and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Mestarien mestari',
      password: 'passuonpossu'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')
    const usersAtend = await helper.usersInDb()
    expect(usersAtend).toHaveLength(usersAtStart.length)
  })

  test('creation fails with statuscode 400 and message if username too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'rt',
      name: 'Mestarien mestari',
      password: 'passuonpossu'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('is shorter than the minimum allowed length')
    const usersAtend = await helper.usersInDb()
    expect(usersAtend).toHaveLength(usersAtStart.length)
  })
  test('creation fails with statuscode 400 and message if password too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Ekiesim',
      name: 'Erkki Esimerkki',
      password: 'ek'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password minimum length 3 characters')
    const usersAtend = await helper.usersInDb()
    expect(usersAtend).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})