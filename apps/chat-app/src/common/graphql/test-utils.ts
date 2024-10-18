import { Query, Mutation } from '@libs/graphql/types/graphql'
import { Response } from 'supertest'
import { expect } from 'vitest'

type NoTypename<T> = Omit<T, '__typename'>

export type QueryInputs = NoTypename<Query>
export type MutationInputs = NoTypename<Mutation>

export const createOperation = <
    T extends 'Query' | 'Mutation',
    O extends keyof (T extends 'Query' ? Omit<Query, '__typename'> : Omit<Mutation, '__typename'>),
    I extends (T extends 'Query' ? QueryInputs : MutationInputs)[O] | undefined,
>(_args: {
    type: T
    operationName: O
}): NonNullable<I> => {
    throw new Error('')
}

export const responseContainsNoErrors = (body: Response['body']) => {
    expect(hasErrors(body)).toBeFalsy()
}

const hasErrors = (body: Response['body']) => {
    if (!body) {
        return {
            errors: ['Missing data in response!'],
            hasErrors: true,
        }
    }

    if (body.errors?.length ?? 0 > 0) {
        return {
            // Cast is OK due to the condition above
            errors: body.errors as unknown[],

            hasErrors: true,
        }
    }

    return false
}
