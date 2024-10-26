import {
    CreateConversationArgsGql,
    FindUsersArgsGql,
    GetConversationArgsGql,
    GetMessagesSubArgsGql,
    SendMessageArgsGql,
} from '../request-type'

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

export const createConversationMutationGqlRequest = (
    args: CreateConversationArgsGql,
): { query: string; variables: CreateConversationArgsGql } => {
    return {
        query: `
          mutation (
            $name: String,
            $userIds: [String!]!
            ) {
                createConversation(name:$name, userIds:$userIds) {
                    id
                    name
                    users {
                    id
                    email
                    userName
                    }
                }
            }`,
        variables: args,
    }
}

export const sendMessageMutationGqlRequest = (
    args: SendMessageArgsGql,
): { query: string; variables: SendMessageArgsGql } => {
    return {
        query: `
          mutation ($conversationId: String!,
            $text: String!) {
            sendMessage(conversationId:$conversationId, text: $text){
                author {
                email
                id
                userName
                }
                createdAt
                id
                isRemoved
                text
                conversationId
            }
        }`,
        variables: args,
    }
}

export const getConversationMessagesSub = (
    args: GetMessagesSubArgsGql,
): { query: string; variables: GetMessagesSubArgsGql } => {
    return {
        query: `
          subscription($conversationId: String!) {
              getConversationMessagesSub(conversationId: $conversationId) {
                author {
                  id
                  email
                }
                id
                text
                conversationId
                id
              }
            }
            `,
        variables: args,
    }
}
