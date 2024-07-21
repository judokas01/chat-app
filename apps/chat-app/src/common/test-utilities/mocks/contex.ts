/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContextType, ExecutionContext } from '@nestjs/common'
import { RpcArgumentsHost, WsArgumentsHost } from '@nestjs/common/interfaces'

export const getMockContext = (overrides: { authToken?: string }): ExecutionContext => ({
    getArgByIndex: <T = any>(_index: number): T => {
        throw new Error('Function not implemented.')
    },
    getArgs: <T extends any[] = any[]>(): T => {
        return null as any
    },
    getClass: <T = any>(): T => {
        throw new Error('Function not implemented.')
    },
    getHandler: () => {
        throw new Error('Function not implemented.')
    },
    getType: <TContext extends string = ContextType>(): TContext => {
        return null as any
    },
    switchToHttp: () => ({
        getNext: <T = any>(): T => {
            throw new Error('Function not implemented.')
        },
        getRequest: <Request>(): Request => {
            const req: Request = {
                headers: {
                    get: () => `Bearer ${overrides.authToken ?? ''}`,
                },
            } as Request

            return req
        },
        getResponse: <T = any>(): T => {
            throw new Error('Function not implemented.')
        },
    }),
    switchToRpc: function (): RpcArgumentsHost {
        throw new Error('Function not implemented.')
    },
    switchToWs: function (): WsArgumentsHost {
        throw new Error('Function not implemented.')
    },
})
