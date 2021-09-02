import { SortOrder } from "../db/query/sort-option";

export class SortUtil {
    
    public static sortByCustomProperty(sortProperty: string, sortOrder: SortOrder){
        return function (a, b) {
            /* 
             * next line works with strings, numbers and dates
             */
            var result = (a[sortProperty] < b[sortProperty]) ? -1 : (a[sortProperty] > b[sortProperty]) ? 1 : 0;
            return result * sortOrder;
        }
    }
}