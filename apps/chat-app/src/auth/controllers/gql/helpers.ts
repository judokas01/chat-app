import { LoginArgsGql } from './request-type'

export const getLogInGqlRequest = (
    args: LoginArgsGql,
): { query: string; variables: LoginArgsGql } => {
    return {
        query: `
            query ($password:String!,$userName:String!) {
                login(password: $password, userName: $userName) {
                    accessToken
                    accessToken
                }
            }`,
        variables: args,
    }
}

export const commonUtil = <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends new (...args: any[]) => any,
    M extends keyof InstanceType<T>,
    A extends Parameters<InstanceType<T>[M]>,
>(args: {
    type: 'query' | 'mutation'
    name: string
    class: T
    classMethod: M
    args: A
}) => {
    const methodArguments = args.args.at(0)
    const inferredArgs = inferArguments(methodArguments)

    const returnQuery: Awaited<ReturnType<InstanceType<T>[M]>> = {}

    const queryStart = args.type === 'query' ? 'query' : 'mutation'

    const queryString = `${queryStart}
    (${inferredArgs.map(({ key, type }) => `$${key}:${type}`).join(', ')})
    {
        ${args.name}(${inferredArgs.map(({ key }) => `${key}:$${key}`).join(', ')}) {
            accessToken
            renewToken
        }
    } 
    `

    return { variables: methodArguments, [args.type]: queryString }
}

const inferArguments = (methodArguments: unknown) => {
    const resolvedArguments = []
    if (isObject(methodArguments)) {
        for (const key in methodArguments) {
            resolvedArguments.push({ key, type: typeToGqlType(typeof methodArguments[key]) })
        }
    }

    return resolvedArguments
}

const isObject = (obj: unknown): obj is Record<string, unknown> => {
    return typeof obj === 'object' && obj !== null
}

const typeToGqlType = (type: string) => {
    switch (type) {
        case 'string':
            return 'String!'
        case 'number':
            return 'Int!'
        case 'boolean':
            return 'Boolean!'
        default:
            return 'String!'
    }
}
