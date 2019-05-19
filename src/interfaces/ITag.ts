interface ITags {
    [id: string]: ITag;
}

interface ITag {
    name: string;
    color: string;
}

interface TagsState {
    tags: ITags;
}
