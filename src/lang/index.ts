import enUS from './en_US.json';
import zhCN from './zh_CN.json';

export type CasketI18nData = Record<string, string | undefined>;
export type CasketI18n = (key: string) => string;

export let i18n: CasketI18n = () => '';

export function initI18n(data: CasketI18nData[] | CasketI18nData){

    const mergedData = (() => {
        if(!Array.isArray(data))
            return Object.assign({}, enUS, data);
        else 
            return Object.assign({}, enUS, ...data);
    })();

    i18n = (key: string) => mergedData[key] || key;
}

export { enUS, zhCN };