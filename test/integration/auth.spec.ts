import { faker } from '@faker-js/faker'

import { apiClient } from './helpers/api'

describe('auth', () => {
  it('should fail when using invalid credentials', async () => {
    const userData = {
      email: faker.internet.email(),
      password: faker.string.alphanumeric(8),
    }

    await apiClient.post('/users', userData)

    try {
      await apiClient.post('/auth/login', {
        email: faker.internet.email(),
        password: userData.password,
      })
    } catch (error) {
      expect(error.response.status).toEqual(401)
    }
  })

  it('should return an access token', async () => {
    const userData = {
      email: faker.internet.email(),
      password: faker.string.alphanumeric(8),
    }

    await apiClient.post('/users', userData)

    const authResponse = await apiClient.post('/auth/login', {
      email: userData.email,
      password: userData.password,
    })

    expect(authResponse.status).toEqual(201)
    expect(authResponse.data).toHaveProperty('access_token')
  })
})
