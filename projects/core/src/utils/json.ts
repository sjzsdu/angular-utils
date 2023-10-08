function _parseCircular(root: any, parent: any, objkey: string | number) {
    const obj = parent[objkey];
    if (null === obj || typeof obj !== 'object') {
        //
    } else if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            _parseCircular(root, obj, i);
        }
    } else if (!!obj['$ref']) {
        let paths = (obj['$ref'] as string).split(/.|[|]/).filter(s => !!s);
        paths.shift();
        parent[objkey] = paths.reduce((a, b) => a[b], root);
    } else {
        Object.keys(obj).forEach(key => {
            _parseCircular(root, obj, key);
        });
    }
}
function _serializeCircular(
    parent: any,
    base: string,
    objkey: string | number,
    obj_key_map: Map<string, any>,
    result: any
) {
    const obj = parent[objkey];
    if (null === obj || typeof obj !== 'object') {
        result[objkey] = obj;
    } else if (obj_key_map.has(obj)) {
        result[objkey] = { $ref: obj_key_map.get(obj) };
    } else {
        const endFix = Array.isArray(parent) ? `[${objkey}]` : `.${objkey}`;
        let objrefstr = `${base}${endFix}`;
        obj_key_map.set(obj, objrefstr);
        if (Array.isArray(obj)) {
            result = result[objkey] = [];
            for (let i = 0; i < obj.length; i++) {
                _serializeCircular(obj, objrefstr, i, obj_key_map, result);
            }
        } else {
            result = result[objkey] = {};
            Object.keys(obj).forEach(key => {
                _serializeCircular(obj, objrefstr, key, obj_key_map, result);
            });
        }
    }
}
export function serializeCircular(root: any) {
    const map = new Map();
    map.set(root, '$');
    if (Array.isArray(root)) {
        let result: any[] = [];
        for (let i = 0; i < root.length; i++) {
            _serializeCircular(root, '$', i, map, result);
        }
        return result;
    } else if (null !== root && typeof root === 'object') {
        let result = {};
        Object.keys(root).forEach(key => {
            _serializeCircular(root, '$', key, map, result);
        });
        return result;
    } else {
        return root;
    }
}

export function parseCircular(root: any): any {
    if (Array.isArray(root)) {
        for (let i = 0; i < root.length; i++) {
            _parseCircular(root, root, i);
        }
    } else if (null !== root && typeof root === 'object') {
        Object.keys(root).forEach(key => {
            _parseCircular(root, root, key);
        });
    }
    return root;
}

export function customStringify(obj: any): string {
    return JSON.stringify(serializeCircular(obj));
}

export function customParse(str: string): any {
    let content = str;
    try {
        content = JSON.parse(str);
    } catch (err) {}
    return parseCircular(content);
}
