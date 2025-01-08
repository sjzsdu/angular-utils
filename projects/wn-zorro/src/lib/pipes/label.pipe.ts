import { Pipe, PipeTransform } from '@angular/core';

const labelFuncs: Record<string, Function> = {
    FirstUppercase: (str: string): string => {
        const parts = str.split('_');
        const formattedParts = parts.map((part, index) => {
            if (index === 0) {
                return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
            } else {
                return part.toLowerCase();
            }
        });
        return formattedParts.join(' ');
    },

    FirstLetterUppercase: (str: string): string => {
        return str[0].toUpperCase() + str.substring(1);
    },

    WordUppercase: (str: string): string => {
        const arr = str.split(/[\s_]+/);
        return arr
            .map((item, index) => {
                if (index === 0) {
                    return labelFuncs['FirstUppercase'](item);
                } else {
                    return item;
                }
            })
            .join(' ');
    },

    WordUppercaseNoUnderline: (str: string): string => {
        const arr = str.split(/[\s]+/);
        return arr.map(item => labelFuncs['FirstUppercase'](item)).join(' ');
    },

    noop: (str: string): string => {
        return str;
    },
};

@Pipe({
    name: 'label',
})
export class LabelPipe implements PipeTransform {
    transform(value: string, ...args: string[]): string {
        const opt = args[0] || 'WordUppercase';
        const func = labelFuncs[opt];
        if (!func) {
            console.error('there is no label function, please check it ');
            return '';
        }
        return func(value) || '';
    }
}
