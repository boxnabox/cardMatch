interface LayoutTree {
    tag: string;
    cls?: string | string[];
    attrs?: {
        [key: string]: string;
    };
    content?: string | LayoutTree[] | undefined | null;
}

type Card = string[];

type CardFacesType =
    | string
    | string[]
    | LayoutTree
    | LayoutTree[]
    | null
    | undefined;

type DifficultyLevel = 'low' | 'med' | 'high' | 'no-lvl';

type GameStatus = 'start' | 'game' | 'win' | 'lose';

type ErrorsType = {
    [key: string]: {
        [key: string]: string;
    };
};
