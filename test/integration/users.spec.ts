import faker from '@faker-js/faker'

import api from './helpers/api'

describe('users', () => {
  it('should fail when trying to create a user with invalid data', async () => {
    try {
      await api.post('/users', {})
    } catch (error) {
      expect(error.response.status).toEqual(400)
      expect(error.response.data).toHaveProperty('error')
    }
  })

  it('should create a user when using valid data', async () => {
    const userData = {
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(8)
    }

    const response = await api.post('/users', userData)

    expect(response.status).toEqual(201)
  })

  it('should fail when trying to fetch profile without being logged in', async () => {
    try {
      await api.get('/users/profile')
    } catch (error) {
      expect(error.response.status).toEqual(401)
    }
  })

  it('should return logged in user profile', async () => {
    const userData = {
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(8)
    }

    await api.post('/users', userData)

    const authResponse = await api.post('/auth/login', {
      email: userData.email,
      password: userData.password
    })

    const profileResponse = await api.get('/users/profile', {
      headers: {
        Authorization: `Bearer ${authResponse.data.access_token}`
      }
    })

    expect(profileResponse.status).toEqual(200)
    expect(profileResponse.data).toHaveProperty(['email'])
    expect(profileResponse.data.email).toEqual(userData.email)
  })

  it('should fail when trying to update user without being logged in', async () => {
    const userData = {
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(8)
    }

    await api.post('/users', userData)

    const emptyData = {}
    try {
      await api.put('/users', emptyData)
    } catch (error) {
      expect(error.response.status).toEqual(401)
    }
  })

  it('should fail when trying to update user with invalid data', async () => {
    const userData = {
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(8)
    }

    await api.post('/users', userData)

    const authResponse = await api.post('/auth/login', {
      email: userData.email,
      password: userData.password
    })

    const emptyData = {}
    try {
      await api.put('/users', emptyData, {
        headers: {
          Authorization: `Bearer ${authResponse.data.access_token}`
        }
      })
    } catch (error) {
      expect(error.response.status).toEqual(400)
      expect(error.response.data).toHaveProperty('error')
    }
  })

  it('should update the logged in user when using valid data', async () => {
    const userData = {
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(8)
    }

    await api.post('/users', userData)

    const authResponse = await api.post('/auth/login', {
      email: userData.email,
      password: userData.password
    })

    const updateData = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName()
    }
    const updateResponse = await api.put('/users', updateData, {
      headers: {
        Authorization: `Bearer ${authResponse.data.access_token}`
      }
    })

    expect(updateResponse.status).toEqual(200)

    const profileResponse = await api.get('/users/profile', {
      headers: {
        Authorization: `Bearer ${authResponse.data.access_token}`
      }
    })

    expect(profileResponse.status).toEqual(200)
    expect(profileResponse.data).toHaveProperty('firstname')
    expect(profileResponse.data.firstname).toEqual(updateData.firstname)
    expect(profileResponse.data).toHaveProperty('lastname')
    expect(profileResponse.data.lastname).toEqual(updateData.lastname)
  })
})
