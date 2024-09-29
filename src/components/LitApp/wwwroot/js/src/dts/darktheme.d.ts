export interface IThemeColors {
    readonly backgroundColor: string;
    readonly textColor: string;
    readonly borderColor: string;
}
export declare abstract class Theme {
    abstract getThemeColors(): IThemeColors;
    abstract getThemeCss(): CSSStyleSheet;
    protected static toCss(colors: IThemeColors): string;
}
export declare class ThemeManager {
    private _theme;
    getTheme(): Theme;
    setTheme(theme: Theme): void;
}
export declare class DarkTheme extends Theme {
    getThemeColors(): IThemeColors;
    getThemeCss(): CSSStyleSheet;
}
export declare const ThemeManagerInstance: ThemeManager;
