import {
    setTheme,
    accordionDefinition,
    accordionItemDefinition,
    ButtonDefinition,
    FluentDesignSystem,
    SpinnerDefinition,
    SliderDefinition,
    MenuDefinition,
    MenuListDefinition,
    MenuButtonDefinition,
    MenuItemDefinition,
    TextInputDefinition,
    TextAreaDefinition,
    LabelDefinition,
    FieldDefinition,
    RadioGroupDefinition,
    RadioDefinition,
    CheckboxDefinition,

} from '@fluentui/web-components';

import { webDarkTheme, webLightTheme } from '@fluentui/tokens';

export type Themes = "dark" | "light";

export interface IThemes {
    [key: string]: any
}

const themes: IThemes = {
    "dark": webDarkTheme,
    "light": webLightTheme
}

export function setFluentTheme(theme: Themes) {
    setTheme(themes[theme]);
}


ButtonDefinition.define(FluentDesignSystem.registry);
accordionDefinition.define(FluentDesignSystem.registry);
accordionItemDefinition.define(FluentDesignSystem.registry);
SpinnerDefinition.define(FluentDesignSystem.registry);
SliderDefinition.define(FluentDesignSystem.registry);
MenuDefinition.define(FluentDesignSystem.registry);
MenuListDefinition.define(FluentDesignSystem.registry);
MenuButtonDefinition.define(FluentDesignSystem.registry);
MenuItemDefinition.define(FluentDesignSystem.registry);
TextInputDefinition.define(FluentDesignSystem.registry);
TextAreaDefinition.define(FluentDesignSystem.registry);
LabelDefinition.define(FluentDesignSystem.registry);
FieldDefinition.define(FluentDesignSystem.registry);
RadioGroupDefinition.define(FluentDesignSystem.registry);
RadioDefinition.define(FluentDesignSystem.registry);
CheckboxDefinition.define(FluentDesignSystem.registry);

setFluentTheme("dark");

