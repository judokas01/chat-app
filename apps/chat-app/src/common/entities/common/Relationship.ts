/**
 * These relation helpers are here to provide maximum flexibility for the storage medium of the application entities.
 * The relations are possibly "not loaded" at all times and will require the storage medium to provide the relation data if used.
 *
 * Also the relation is represented only by the minimal relation reference ID and does not require the whole underlying entity to be loaded.
 *
 * A runtime error will be thrown if the relation data are not available when accessed.
 * This will prompt the developer to make sure the data is available via the storage repository.
 */

const NOT_LOADED = {
    // This is here to cause trouble on wrong assignment
    id: false,
    notLoaded: true,
}

type NotLoaded = typeof NOT_LOADED

export type ObjectWithId = { id: string }
export class HasOneCustom<TRelationType> {
    private readonly refProperty: TRelationType | NotLoaded

    constructor(
        input: TRelationType | undefined,
        public readonly errPath: string,
    ) {
        if (input === undefined) {
            this.refProperty = NOT_LOADED
            return
        }

        if (input === null) {
            throw new Error(
                `The relation at: ${errPath} was set to null! Do not use null values for relation wrappers! The wrappers should only contain existing references!`,
            )
        }

        this.refProperty = input
    }

    public toRefObject<TCast extends { id: TRelationType }>(): TCast | NotLoaded {
        if (!isLoaded(this.refProperty)) {
            return NOT_LOADED
        }

        if (!this.refProperty) {
            throw new Error(
                `The relation at: ${this.errPath} was not set! This should never happen due to TS checks!`,
            )
        }

        // Notice the cast here!
        // It is here to allow for intended type casting for easier reuse of existing types
        return { id: this.refProperty } as TCast
    }

    public getRefOrFail() {
        if (!isLoaded(this.refProperty)) {
            throw new Error(
                `Trying to access unloaded relation! The relation at: ${this.errPath} was not loaded!`,
            )
        }

        return this.refProperty
    }
}

export class HasOne<
    TEntity extends ObjectWithId,
    TProperty extends keyof TEntity = 'id',
    TTargetProp = TEntity[TProperty],
> extends HasOneCustom<TTargetProp> {}

export class HasMany<
    TEntity extends ObjectWithId,
    TProperty extends keyof TEntity = 'id',
    TTargetProp = TEntity[TProperty],
> {
    private readonly refs: TTargetProp[] | NotLoaded

    constructor(
        input: TTargetProp[] | undefined,
        private readonly errPath: string,
    ) {
        if (input === null) {
            throw new Error(
                `The relation at: ${errPath} was set to null! Do not use null values for relation wrappers! The wrappers should only contain existing references!`,
            )
        }
        this.refs = input ?? NOT_LOADED
    }

    public toRefArray<TCast extends { id: TTargetProp }>(): TCast[] | NotLoaded {
        if (!isLoaded(this.refs)) {
            return NOT_LOADED
        }

        if (!this.refs || !Array.isArray(this.refs)) {
            throw new Error(
                `The relation at: ${this.errPath} was not set! This should never happen due to TS checks!`,
            )
        }

        // Notice the cast here!
        // It is here to allow for intended type casting for easier reuse of existing types
        return this.refs.map((ref) => ({
            id: ref,
        })) as TCast[]
    }

    public getRefsOrFail() {
        if (!isLoaded(this.refs)) {
            throw new Error(
                `Trying to access unloaded relation! The relation at: ${this.errPath} was not loaded!`,
            )
        }

        return this.refs
    }
}

export const isLoaded = <TToCheck extends unknown | NotLoaded>(
    something: TToCheck | NotLoaded,
): something is TToCheck => {
    if (typeof something !== 'object') {
        return true
    }

    return !('notLoaded' in (something as Partial<NotLoaded>))
}
