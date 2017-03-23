export enum ConditionType {
  NUMBER = 0,
  TEXT = 1,
  DATE = 2,
  BOOL = 3,
}

export enum ConditionComparison {
  EQUAL = 0,
  GREATER_THAN = 1,
  LOWER_THAN = 2,
  NOT_EQUAL = 3,
  IS_NULL = 4,
  IN = 5,
  CONTAINS = 6,
  STARTS_WITH = 7,
  ENDS_WITH = 8,
  BETWEEN = 9,
}

export interface ICondition {
  type?: ConditionType;
  comparison?: ConditionComparison;
  value?: any;
}

export interface IHttpCondition {
  t: ConditionType;
  c: ConditionComparison;
  v?: any;
}

export interface IHttpConditions {
  [field: string]: IHttpCondition;
}

export class FilterCondition {

  static build(value: any, comparison?: ConditionComparison, type?: ConditionType): string {
    const condition = {
      v: value,
      t: type ? type : ConditionType.TEXT,
      c: comparison ? comparison : ConditionComparison.EQUAL,
    };
    return JSON.stringify(condition);
  }
}