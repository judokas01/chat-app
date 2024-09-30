import { QueryGetUserConversationsArgs, RegisterResponse } from '@libs/graphql/types/graphql'
import { FindUsersArgsGql, GetConversationArgsGql } from '../request-type'

export const getUserConversationGqlRequest = (
    args: GetConversationArgsGql,
): { query: string; variables: GetConversationArgsGql } => {
    return {
        query: `
           query ($userId:String!){
            getUserConversations(userId:$userId){
                id
                createdAt
                lastMessageAt
                name
                users{
                email
                id
                userName
                }
            }
        }`,
        variables: args,
    }
}

export const getUserConversationGqlRequestNew = (
    args: QueryGetUserConversationsArgs,
): { query: string; variables: GetConversationArgsGql } => {
    return {
        query: `
           query ($userId:String!){
            getUserConversations(userId:$userId){
                id
                createdAt
                lastMessageAt
                name
                users{
                email
                id
                userName
                }
            }
        }`,
        variables: args,
    }
}

export const findUsersGqlRequest = (
    args: FindUsersArgsGql,
): { query: string; variables: FindUsersArgsGql } => {
    return {
        query: `
           query ($email:String,$userName:String) {
            findUsers(email: $email, userName: $userName){
                email
                id
                userName
            }
        }`,
        variables: args,
    }
}
