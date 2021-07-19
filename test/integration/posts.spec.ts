import * as faker from 'faker'

import api from './helpers/api'

describe('Posts', () => {
  it('returns an empty list when there are no posts', async () => {
    const response = await api.get('/posts')

    expect(response.status).toEqual(200)
    expect(response.data.length).toEqual(0)
  })

  it('fails when trying to create a post with invalid data', async () => {
    try {
      await api.post('/posts', {})
    } catch (error) {
      expect(error.response.status).toEqual(400)
      expect(error.response.data).toHaveProperty('error')
    }
  })

  it('should create a post when receiving valid data', async () => {
    const postData = {
      title: faker.lorem.words(3),
      content: faker.lorem.paragraph(2),
      author: `${faker.name.firstName()} ${faker.name.lastName()}`,
    }

    const response = await api.post('/posts', postData)

    expect(response.status).toEqual(201)
    expect(response.data).toHaveProperty('id')
    expect(response.data.id).toBeTruthy()
  })
})
