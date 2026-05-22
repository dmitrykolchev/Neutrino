export type Themes = "dark" | "light";
export interface IThemes {
    [key: string]: any;
}
export declare function setFluentTheme(theme: Themes): void;
