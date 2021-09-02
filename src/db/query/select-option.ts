export enum OperatorType {
    EQ,
    NE,
    GT,
    LT,
}

export type OperatorTypeStrings = keyof typeof OperatorType;

export interface ISelectOption {
    field: string;
    operator?: OperatorTypeStrings;
    value: string;
}
