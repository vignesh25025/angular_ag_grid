import { Component, Input } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { IOlympicData } from './interfaces';

@Component({
    selector: 'country-component',
    template: `<span>{{ this.displayValue }}</span>`,
})
export class CountryRenderer implements ICellRendererAngularComp {
    public displayValue!: string;

    agInit(params: ICellRendererParams<IOlympicData, number> | any): void {
        this.displayValue = params.value + " (" + params.countryCounts[params.value] + ")";
    }

    refresh(params: ICellRendererParams) {
        return false;
    }
}