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
    T extends new (...args: any[]) => InstanceType<T>,
    M extends keyof InstanceType<T>,
    A extends Parameters<InstanceType<T>[M]>,
>(args: {
    type: 'query' | 'mutation'
    name: string
    class: T
    classMethod: M
    args: A
}) => {
    return args
}
