import { Injector, StaticProvider } from '@angular/core';
import { FORM_DATA, FORM_PARAMS } from '../lib/components/form/constant';

export function trackFunc(field: string | string[] = 'id') {
    return function (index: number, item: any): number | string {
        if (typeof field === 'string') {
            return item[field] || item || index;
        } else {
            return field.map(field => item[field] || index).join('-');
        }
    };
}

export function newInjector(parent: Injector, providers: StaticProvider[] = []) {
    return Injector.create({
        providers,
        parent,
    });
}

export function injectParams(parent: Injector, params: { [key: string]: any }) {
    return Injector.create({
        providers: [
            {
                provide: FORM_PARAMS,
                useValue: params,
            },
        ],
        parent,
    });
}

export function injectData(parent: Injector, data: any) {
    return Injector.create({
        providers: [
            {
                provide: FORM_DATA,
                useValue: data,
            },
        ],
        parent,
    });
}
