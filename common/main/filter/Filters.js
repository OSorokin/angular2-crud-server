"use strict";
(function (ConditionType) {
    ConditionType[ConditionType["NUMBER"] = 0] = "NUMBER";
    ConditionType[ConditionType["TEXT"] = 1] = "TEXT";
    ConditionType[ConditionType["DATE"] = 2] = "DATE";
    ConditionType[ConditionType["BOOL"] = 3] = "BOOL";
})(exports.ConditionType || (exports.ConditionType = {}));
var ConditionType = exports.ConditionType;
(function (ConditionComparison) {
    ConditionComparison[ConditionComparison["EQUAL"] = 0] = "EQUAL";
    ConditionComparison[ConditionComparison["GREATER_THAN"] = 1] = "GREATER_THAN";
    ConditionComparison[ConditionComparison["LOWER_THAN"] = 2] = "LOWER_THAN";
    ConditionComparison[ConditionComparison["NOT_EQUAL"] = 3] = "NOT_EQUAL";
    ConditionComparison[ConditionComparison["IS_NULL"] = 4] = "IS_NULL";
    ConditionComparison[ConditionComparison["IN"] = 5] = "IN";
    ConditionComparison[ConditionComparison["CONTAINS"] = 6] = "CONTAINS";
    ConditionComparison[ConditionComparison["STARTS_WITH"] = 7] = "STARTS_WITH";
    ConditionComparison[ConditionComparison["ENDS_WITH"] = 8] = "ENDS_WITH";
    ConditionComparison[ConditionComparison["BETWEEN"] = 9] = "BETWEEN";
})(exports.ConditionComparison || (exports.ConditionComparison = {}));
var ConditionComparison = exports.ConditionComparison;
class FilterCondition {
    static build(value, comparison, type) {
        const condition = {
            v: value,
            t: type ? type : ConditionType.TEXT,
            c: comparison ? comparison : ConditionComparison.EQUAL,
        };
        return JSON.stringify(condition);
    }
}
exports.FilterCondition = FilterCondition;
//# sourceMappingURL=Filters.js.map