import { ApolloClient, InMemoryCache } from '@apollo/client'

export const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: 'http://localhost:3000/graphql',
})
