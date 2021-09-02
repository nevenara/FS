import { ISelectOption } from "./select-option";
 
import { ISortOption } from "./sort-option";
import { DbObject } from "../db-object";
import { getObjectIdFromString } from "../schema-util";
import { Test } from "mocha";

export class QueryObject {
    private _selectOptions: ISelectOption[] = [];

    private _sortOptions: ISortOption[] = [];

    constructor(public readonly dbObject: DbObject) {
    }

    get selectOptions(): ISelectOption[] {
        return this._selectOptions;
    }

    set selectOptions(value: ISelectOption[]) {
        this._selectOptions = value;
    }

    get sortOptions(): ISortOption[] {
        return this._sortOptions;
    }

    set sortOptions(value: ISortOption[]) {
        this._sortOptions = value;
    }

    public addSelectOption(selectOption: ISelectOption): void {
        this._selectOptions.push(selectOption);
    }

    public addSortOption(sortOption: ISortOption): void {
        this._sortOptions.push(sortOption);
    }

    /* istanbul ignore next */
    public getQueryObj4MongoDb(): JSON {
        const queryObj: any = {};

        for (const selectOption of this.selectOptions) {
            // check if selectionOption.field is valid query field
            if (!this.dbObject.existsDBField(selectOption.field)) {
                throw new Error("Query field is not supported");
            }
            let operator: string = selectOption.operator || "";
            if (operator === "EQ" || !operator || operator.length === 0) {
                queryObj[selectOption.field] = selectOption.value;
            } else {
                operator = `$${operator.toLowerCase()}`;
                queryObj[selectOption.field] = {};
                queryObj[selectOption.field][operator] = selectOption.value;
            }
        }
        return queryObj as JSON;
    }

    /* istanbul ignore next */
    public getSortOptions4MongoDb(): JSON {
        const sortOptionsObj: any = {};
        for (const sortOption of this.sortOptions) {
            // check if sortOption.field is valid
            if (!this.dbObject.existsDBField(sortOption.field)) {
                throw new Error("Sort field is not supported");
            }
            sortOptionsObj[sortOption.field] = sortOption.sortOrder;
        }
        return sortOptionsObj as JSON;
    }
}
