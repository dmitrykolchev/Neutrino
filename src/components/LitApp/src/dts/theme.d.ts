export interface IThemeColors {
    readonly backgroundColor: string;
    readonly textColor: string;
    readonly borderColor: string;
}
export declare abstract class Theme {
    abstract getColors(): IThemeColors;
}
export declare class ThemeManager {
    private _theme;
    private _themeCss;
    constructor();
    getTheme(): Theme;
    setTheme(theme: Theme): void;
    getCSSStyleSheet(): CSSStyleSheet;
}
export declare class DarkTheme extends Theme {
    getColors(): IThemeColors;
}
export declare const ThemeManagerInstance: ThemeManager;
