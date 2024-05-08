import zhCN from './zh_CN.json';
import enUS from './en_US.json';

export type CasketI18n = (key: string) => string;

export function I18nBuilder(data: Record<string, string | undefined>){
    return (key: string) => data[key] || key; 
}

export function getI18n(language: string): CasketI18n {
    switch(language.toLowerCase()){
        case 'zh_cn': return I18nBuilder(zhCN);
        case 'en_us': return I18nBuilder(enUS);

        default:
            return I18nBuilder(enUS);
    }
}