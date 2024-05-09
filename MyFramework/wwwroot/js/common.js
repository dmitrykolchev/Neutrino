export class HtmlUtils {
    static createElementFromHtml(htmlText) {
        let container = document.createElement("div");
        container.innerHTML = htmlText;
        const element = container.firstElementChild;
        container.removeChild(element);
        return element;
    }
    static parseFromString(text, type) {
        return HtmlUtils.s_parser.parseFromString(text, type);
    }
    static parseHtml(html) {
        return HtmlUtils.s_parser.parseFromString(html, "text/html");
    }
    static parseXml(xml) {
        return HtmlUtils.s_parser.parseFromString(xml, "application/xml");
    }
}
HtmlUtils.s_parser = new DOMParser();
export class UrlUtils {
    static buildFilterUrl(baseUrl, filter) {
        let filterValues = filter instanceof Array ? filter.map(x => x.value) : [filter];
        const queryString = UrlUtils.objectToQueryString(filterValues, "Filter");
        return UrlUtils.appendUrl(baseUrl, queryString);
    }
    static appendUrl(baseUrl, queryString) {
        if (baseUrl) {
            if (baseUrl.indexOf("?") >= 0) {
                return `${baseUrl}&${queryString}`;
            }
            return `${baseUrl}?${queryString}`;
        }
        return baseUrl;
    }
    static getPath(url) {
        const index = url.indexOf("?");
        if (index >= 0) {
            return url.substring(index);
        }
        return url;
    }
    static buildUrl(baseUrl, param) {
        if (param) {
            let queryString = UrlUtils.objectToQueryString(param, "");
            return this.appendUrl(baseUrl, queryString);
        }
        return baseUrl;
    }
    static objectToArray(prefix, value, list) {
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
    static objectToQueryString(value, prefix) {
        const list = [];
        UrlUtils.objectToArray(prefix ?? "", value, list);
        return list.join("&");
    }
}
//# sourceMappingURL=common.js.map