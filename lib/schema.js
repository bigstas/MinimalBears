export const schema = [`
type Language {
    id: ID
    name: String
    iso639-9: String
}

type Contrast {
    id: ID
    name: String
    language: Language
    pairs: [CachedPair]
}

type Pair {
    id: ID
    contrast: Contrast
    first: Item
    second: Item
}

type CachedPair {
    first: Item
    second: Item
}

type Item {
    id: ID
    language: Language
    homophones: [String]
    audio: [String]
}

type Audio {
    id: ID
    file: String
    speaker: String
    item: Item
}

type Query {
    getFoo(bar: Int): Int

schema {
    query: Query
}
`];
