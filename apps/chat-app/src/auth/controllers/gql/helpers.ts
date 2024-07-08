import { LoginArgsGql, RegisterArgsGql } from './request-type'

export const getLogInGqlRequest = (
    args: LoginArgsGql,
): { query: string; variables: LoginArgsGql } => {
    return {
        query: `
            query ($password:String!,$userName:String!) {
                login(password: $password, userName: $userName) {
                    accessToken
                    renewToken
                }
            }`,
        variables: args,
    }
}

export const getRegisterGqlRequest = (
    args: RegisterArgsGql,
): { query: string; variables: RegisterArgsGql } => {
    return {
        query: `
            mutation ($email:String!,$password:String!,$userName:String!) {
                register(email:$email, password:$password, userName:$userName) {
                    email
                    id
                    userName
                }
}`,
        variables: args,
    }
}
