export interface IThemeColors {
    readonly backgroundColor: string;
    readonly textColor: string;
    readonly borderColor: string;
}

const getThemeVars: (colors: IThemeColors) => string = function (colors: IThemeColors): string {
    return `:host {
            --background-color: ${colors.backgroundColor};
            --text-color: ${colors.textColor};
            --border-color: ${colors.borderColor};
        }`;
}

export abstract class Theme {

    public abstract getColors(): IThemeColors;
}

const DarkThemeColors: IThemeColors = Object.freeze(
    {
        backgroundColor: "#333",
        textColor: "white",
        borderColor: "green",
    });

export class ThemeManager {
    private _theme!: Theme;
    private _themeCss!: CSSStyleSheet;

    constructor() {
        this.setTheme(new DarkTheme());
    }

    public getTheme(): Theme {
        return this._theme;
    }

    public setTheme(theme: Theme) {
        this._theme = theme;
        this.getCSSStyleSheet().replaceSync(getThemeVars(theme.getColors()));
    }

    public getCSSStyleSheet(): CSSStyleSheet {
        return this._themeCss ??= new CSSStyleSheet();
    }
}

export class DarkTheme extends Theme {
    public getColors(): IThemeColors {
        return DarkThemeColors;
    }
}

export const ThemeManagerInstance = new ThemeManager();


