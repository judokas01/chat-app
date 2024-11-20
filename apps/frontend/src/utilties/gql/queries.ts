import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client'

export const loginQuery = async (
    args: { userName: string; password: string },
    client: ApolloClient<NormalizedCacheObject>,
) => {
    const query = gql`
        query ($password: String!, $userName: String!) {
            login(password: $password, userName: $userName) {
                accessToken
                renewToken
            }
        }
    `

    const res = await client.query({
        query,
        variables: args,
    })

    console.log(res)
}
