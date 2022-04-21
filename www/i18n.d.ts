
type DictOf<T> = { [key: string]: T };
type Conditions = DictOf<string>;
type ConditionsOf<K extends Languages> = AllConditions[K];
type LanguageData = DictOf<Conditions | string>;
type Things = { [index: number | string]: number | string } | Array<number | string>;
type Extension = (things: Things, conditions: Conditions) => string;
type ExtensionOf<K extends Languages> = (things: Things, conditions: ConditionsOf<K>) => string;
type Languages = keyof AllConditions;

/**
 * All known possible condition keys, per language
 */
type AllConditions = {
    'en-US': {
        'single': string,
        'multiple': string,
        '1st': string,
        '2nd': string,
        '3rd': string,
        'nth': string
    },
    'de-DE': {
        'single': string,
        'multiple': string
    },
    'zh-CN': {}
};

interface I18nCallable extends I18n {
    (text: string, things: Things, can_change_things: boolean): string;
}