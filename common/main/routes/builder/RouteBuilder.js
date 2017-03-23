"use strict";
class RouteBuilder {
    static build(routeLocation, routeFiller) {
        if (routeLocation == null || typeof routeLocation != 'string') {
            throw new Error('routeLocation missed');
        }
        const filler = routeFiller || {};
        let result = routeLocation;
        const invalidParametersTypes = [];
        const invalidStringParameters = [];
        const redundantParameters = [];
        for (const parameter in filler) {
            if (filler.hasOwnProperty(parameter)) {
                const value = filler[parameter];
                const type = typeof value;
                const instanceOfString = type === 'string';
                const instanceOfNumber = type === 'number';
                if (!instanceOfString && !instanceOfNumber) {
                    invalidParametersTypes.push(`${parameter}(${type})`);
                    continue;
                }
                if (instanceOfString && !RouteBuilder.isValidStringParameter(value)) {
                    invalidStringParameters.push(`${parameter}(${value})`);
                    continue;
                }
                const previousResult = result;
                result = result.replace(new RegExp(`\:${parameter}`, 'g'), value);
                if (previousResult == result) {
                    redundantParameters.push(`${parameter}(${value})`);
                }
            }
        }
        if (invalidParametersTypes.length > 0) {
            throw new Error(`invalid parameters types: ${invalidParametersTypes.sort()}`);
        }
        if (invalidStringParameters.length > 0) {
            throw new Error(`invalid string parameters values: ${invalidStringParameters.sort()}`);
        }
        if (redundantParameters.length > 0) {
            throw new Error(`redundant parameters: ${redundantParameters.sort()}`);
        }
        if (result.indexOf(':') > -1) {
            throw new Error(`location still has unresolved parameter(s): ${result}`);
        }
        return result;
    }
    static isValidStringParameter(value) {
        const afterReplace = value.replace(/[-a-z]+/, '');
        return afterReplace === '';
    }
}
exports.RouteBuilder = RouteBuilder;
//# sourceMappingURL=RouteBuilder.js.map