
export class HtmlUtils {
    private static s_parser = new DOMParser();

    public static createElementFromHtml(htmlText: string): HTMLElement {
        let container = document.createElement("div");
        container.innerHTML = htmlText;
        const element = container.firstElementChild as HTMLElement;
        container.removeChild(element);
        return element;
    }

    public static parseFromString(text:string, type: DOMParserSupportedType): Document | XMLDocument {
        return HtmlUtils.s_parser.parseFromString(text, type);
    }

    public static parseHtml(html: string): Document {
        return HtmlUtils.s_parser.parseFromString(html, "text/html");
    }

    public static parseXml(xml: string): XMLDocument {
        return HtmlUtils.s_parser.parseFromString(xml, "application/xml");
    }
}


export class UrlUtils {
    /**
    * Построение адреса с указанием фильтра
    * @param baseUrl базовый адрес
    * @param filter объект со свойствами и значениями фильтров
    */
    public static buildFilterUrl(baseUrl: string, filter: Object) {

        // get values from Array<IUserFilter>
        let filterValues = filter instanceof Array ? filter.map(x => x.value) : [filter];

        const queryString = UrlUtils.objectToQueryString(filterValues, "Filter");
        return UrlUtils.appendUrl(baseUrl, queryString);
    }
    /**
     * Добавляет параметры к базовому URL
     * @param baseUrl базовый адрес
     * @param queryString строка с параметрами веб-запроса
     */
    public static appendUrl(baseUrl: string, queryString: string): string {
        if (baseUrl) {
            if (baseUrl.indexOf("?") >= 0) {
                return `${baseUrl}&${queryString}`;
            }
            return `${baseUrl}?${queryString}`;
        }
        return baseUrl;
    }

    public static getPath(url: string): string {
        const index = url.indexOf("?");
        if (index >= 0) {
            return url.substring(index);
        }
        return url;
    }
    /**
    * Построение адреса с указанием параметров
    * @param baseUrl базовый адрес
    * @param param объект со свойствами и значениями параметров
    */
    public static buildUrl(baseUrl: string, param: any) {
        if (param) {
            let queryString = UrlUtils.objectToQueryString(param, "");
            return this.appendUrl(baseUrl, queryString);
        }
        return baseUrl;
    }

    private static objectToArray(prefix: string, value: any, list: string[]) {
        if (value !== null && value !== undefined && value !== "") {
            if (value instanceof Array) {
                value.forEach(item => UrlUtils.objectToArray(prefix, item, list));
            }
            else if (typeof value === 'object') {
                Object.keys(value).forEach(key => UrlUtils.objectToArray(prefix ? `${prefix}.${key}` : key, value[key], list));
            }
            else {
                list.push(`${encodeURIComponent(prefix)}=${encodeURIComponent(value)}`);
            }
        }
    }

    private static objectToQueryString(value: any, prefix?: string): string {
        const list: string[] = [];
        UrlUtils.objectToArray(prefix ?? "", value, list);
        return list.join("&");
    }
}
