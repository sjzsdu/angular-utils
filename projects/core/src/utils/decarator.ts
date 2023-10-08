export function delayExecute(ms: number) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            await new Promise(resolve => setTimeout(resolve, ms));
            return originalMethod.apply(this, args);
        };
    };
}

export function debounceExecute(ms: number) {
    let timeoutId: any;
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                originalMethod.apply(this, args);
            }, ms);
        };
    };
}

export function paramsFirst(field?: string) {
    return (target: any, key: string) => {
        Object.defineProperty(target, key, {
            get: function () {
                if (!this._params) {
                    this._params = {};
                }
                if (this.innerParams) {
                    const pVal = field ? this.innerParams[field] : this.innerParams[key];
                    return pVal ?? this._params[key] ?? this[key];
                }
                return this._params[key] ?? this[key];
            },
            set: function (val: any) {
                if (!this._params) {
                    this._params = {};
                }
                this._params[key] = val;
            },
        });
    };
}

export function InnerParams(target: any) {
    target.prototype.getParam = function (key: string) {
        return this?.innerParams[key] ?? this[key];
    };
}
