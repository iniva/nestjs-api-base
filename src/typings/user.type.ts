export type User = {
  id: string
  password: string
  email: string
  username: string
  active: boolean
  firstname: string | null
  lastname: string | null
}

export type AuthedUser = Omit<User, 'password'>
