export { };
declare global {

    type Palette = {
        name: string,
        colors: string[],
        stroke: string,
        background: string,
    }

    type tomeType = {
        getRandom(): () => Palette
        get(name: string): () => Palette
        getAll(): () => Palette[]
        getNames(): () => string[]
    }
}