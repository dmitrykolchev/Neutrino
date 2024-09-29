const getThemeVars = function (colors) {
    return `:host {
            --background-color: ${colors.backgroundColor};
            --text-color: ${colors.textColor};
            --border-color: ${colors.borderColor};
        }`;
};
export class Theme {
}
const DarkThemeColors = Object.freeze({
    backgroundColor: "#333",
    textColor: "white",
    borderColor: "green",
});
export class ThemeManager {
    _theme;
    _themeCss;
    constructor() {
        this.setTheme(new DarkTheme());
    }
    getTheme() {
        return this._theme;
    }
    setTheme(theme) {
        this._theme = theme;
        this.getCSSStyleSheet().replaceSync(getThemeVars(theme.getColors()));
    }
    getCSSStyleSheet() {
        return this._themeCss ??= new CSSStyleSheet();
    }
}
export class DarkTheme extends Theme {
    getColors() {
        return DarkThemeColors;
    }
}
export const ThemeManagerInstance = new ThemeManager();
//# sourceMappingURL=theme.js.map