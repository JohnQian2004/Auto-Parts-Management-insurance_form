import { GroupBy } from "./groupBy.model";

export class Report {

    label: string = "";
    data: GroupBy[] = new Array();
    counts: number = 0;
}