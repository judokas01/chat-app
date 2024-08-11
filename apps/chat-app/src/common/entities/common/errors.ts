import { InternalServerErrorException } from '@nestjs/common'

export class RelationNotLoadedError extends InternalServerErrorException {
    constructor(path: string) {
        super({
            message: `Trying to access unloaded relation! The relation at: ${path} was not loaded!`,
            payload: { path },
        })
    }
}
