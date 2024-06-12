export type User = {
    id: string
    userName: string
    email: string
    password: string
    createdAt: Date
}

export type UserInput = Omit<User, 'id'>
