import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ColDef, FilterChangedEvent, GridApi, GridReadyEvent, SideBarDef } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { CountryRenderer } from './country-renderer.component';
import { IOlympicData } from './interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public countryCounts: any = {};

  public columnDefs: ColDef[] = [
    { field: 'athlete', filter: 'agMultiColumnFilter' },
    {
      field: 'country',
      filter: 'agMultiColumnFilter',
      filterParams: {
        filters: [
          {
            filter: 'agTextColumnFilter',
            filterParams: {
              defaultOption: 'startsWith',
              buttons: ['reset']
            },
          },
          {
            filter: 'agSetColumnFilter',
            filterParams: {
              buttons: ['reset'],
              cellRenderer: CountryRenderer,
              cellRendererParams: {
                countryCounts: this.countryCounts
              }
            }
          },
        ],
      },
    },
    {
      field: 'gold',
      filter: 'agMultiColumnFilter',
      filterParams: {
        filters: [
          {
            filter: 'agNumberColumnFilter',
          },
          {
            filter: 'agSetColumnFilter',
          },
        ],
      },
    },
    {
      field: 'date',
      filter: 'agMultiColumnFilter',
      filterParams: dateFilterParams,
    },
  ];
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 200,
    resizable: true,
    filter: true,
    menuTabs: ['filterMenuTab'],
  };
  public sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: ['filters'],
  };
  public rowData!: IOlympicData[];
  private gridApi!: GridApi<IOlympicData>;

  constructor(private http: HttpClient) { }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<IOlympicData[]>(
        'https://www.ag-grid.com/example-assets/olympic-winners.json'
      )
      .subscribe((data) => {
        this.rowData = data;
        this.countryCounts["(Select All)"] = this.rowData.length;
        for (let data of this.rowData) {
          if (!this.countryCounts[data.country]) {
            this.countryCounts[data.country] = 1;
          }
          else {
            this.countryCounts[data.country] += 1
          }
        }
      });
  }

  onFilterChanged(event: FilterChangedEvent<IOlympicData>) {
    console.log(event);
    console.log(this.gridApi.getFilterModel())
  }

}

var dateFilterParams = {
  filters: [
    {
      filter: 'agDateColumnFilter',
      filterParams: {
        comparator: (filterDate: Date, cellValue: string) => {
          if (cellValue == null) return -1;
          return getDate(cellValue).getTime() - filterDate.getTime();
        },
      },
    },
    {
      filter: 'agSetColumnFilter',
      filterParams: {
        comparator: (a: string, b: string) => {
          return getDate(a).getTime() - getDate(b).getTime();
        },
      },
    },
  ],
};
function getDate(value: string): Date {
  var dateParts = value.split('/');
  return new Date(
    Number(dateParts[2]),
    Number(dateParts[1]) - 1,
    Number(dateParts[0])
  );
}