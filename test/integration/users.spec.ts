import { faker } from '@faker-js/faker'

import { apiClient } from './helpers/api'

describe('users', () => {
  it('should fail when trying to create a user with invalid data', async () => {
    try {
      await apiClient.post('/users', {})
    } catch (error) {
      expect(error.response.status).toEqual(400)
      expect(error.response.data).toHaveProperty('error')
    }
  })

  it('should create a user when using valid data', async () => {
    const userData = {
      email: faker.internet.email(),
      password: faker.string.alphanumeric(8),
    }

    const response = await apiClient.post('/users', userData)

    expect(response.status).toEqual(201)
  })

  it('should fail when trying to fetch profile without being logged in', async () => {
    try {
      await apiClient.get('/users/profile')
    } catch (error) {
      expect(error.response.status).toEqual(401)
    }
  })

  it('should return logged in user profile', async () => {
    const userData = {
      email: faker.internet.email(),
      password: faker.string.alphanumeric(8),
    }

    await apiClient.post('/users', userData)

    const authResponse = await apiClient.post('/auth/login', {
      email: userData.email,
      password: userData.password,
    })

    const profileResponse = await apiClient.get('/users/profile', {
      headers: {
        Authorization: `Bearer ${authResponse.data.access_token}`,
      },
    })

    expect(profileResponse.status).toEqual(200)
    expect(profileResponse.data).toHaveProperty(['email'])
    expect(profileResponse.data.email).toEqual(userData.email)
  })

  it('should fail when trying to update user without being logged in', async () => {
    const userData = {
      email: faker.internet.email(),
      password: faker.string.alphanumeric(8),
    }

    await apiClient.post('/users', userData)

    const emptyData = {}
    try {
      await apiClient.put('/users', emptyData)
    } catch (error) {
      expect(error.response.status).toEqual(401)
    }
  })

  it('should fail when trying to update user with invalid data', async () => {
    const userData = {
      email: faker.internet.email(),
      password: faker.string.alphanumeric(8),
    }

    await apiClient.post('/users', userData)

    const authResponse = await apiClient.post('/auth/login', {
      email: userData.email,
      password: userData.password,
    })

    const emptyData = {}
    try {
      await apiClient.put('/users', emptyData, {
        headers: {
          Authorization: `Bearer ${authResponse.data.access_token}`,
        },
      })
    } catch (error) {
      expect(error.response.status).toEqual(400)
      expect(error.response.data).toHaveProperty('error')
    }
  })

  it('should update the logged in user when using valid data', async () => {
    const userData = {
      email: faker.internet.email(),
      password: faker.string.alphanumeric(8),
    }

    await apiClient.post('/users', userData)

    const authResponse = await apiClient.post('/auth/login', {
      email: userData.email,
      password: userData.password,
    })

    const updateData = {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
    }
    const updateResponse = await apiClient.put('/users', updateData, {
      headers: {
        Authorization: `Bearer ${authResponse.data.access_token}`,
      },
    })

    expect(updateResponse.status).toEqual(200)

    const profileResponse = await apiClient.get('/users/profile', {
      headers: {
        Authorization: `Bearer ${authResponse.data.access_token}`,
      },
    })

    expect(profileResponse.status).toEqual(200)
    expect(profileResponse.data).toHaveProperty('firstname')
    expect(profileResponse.data.firstname).toEqual(updateData.firstname)
    expect(profileResponse.data).toHaveProperty('lastname')
    expect(profileResponse.data.lastname).toEqual(updateData.lastname)
  })
})
