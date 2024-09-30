import { Query, Mutation } from '@libs/graphql/types/graphql'

type NoTypename<T> = Omit<T, '__typename'>

export type QueryInputs = NoTypename<Query>
export type MutationInputs = NoTypename<Mutation>

export const createOperation = <
    T extends 'Query' | 'Mutation',
    O extends keyof (T extends 'Query' ? Omit<Query, '__typename'> : Omit<Mutation, '__typename'>),
    I extends (T extends 'Query' ? QueryInputs : MutationInputs)[O] | undefined,
>(args: {
    type: T
    operationName: O
}): NonNullable<I> => {
    throw new Error('')
}

const users = createOperation({
    operationName: 'findUsers',
    type: 'Query',
})

users.forEach(({}) => {})
