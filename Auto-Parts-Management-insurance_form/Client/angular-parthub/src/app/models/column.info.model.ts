

export class ColumnInfo {
  id?: any = 0;
  name?: string;
  enabled?: boolean = true;
  //{ id: 2, sequenceNumber: 1, enabled: true, name: 'year', comments: "year", header: "year", width: 100, tooltip: "Sort By Year", fieldName: "year", isCollection: false },

  comments?: string;

  header?: string;
  width?: any;
  tooltip?: any;
  fieldName?: any;
  collection?: boolean = false;



  userId?: number;

  companyId?: number;

  sequenceNumber: number = 0;


  color?: string;

}