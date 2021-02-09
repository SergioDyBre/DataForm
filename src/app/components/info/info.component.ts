import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataService } from 'src/app/services/auth/data.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  responseError: boolean = false;

  columnDefs = [
    { field: 'FECHA' },
    { field: 'HG' },
    { field: 'HM' },
    { field: 'HR' }
  ];

  // Table related attributes
  tableRowData = [];

  // Line chart related attributes
  lineChartData: ChartDataSets[] = [];
  lineChartLabels: Label[] = [];
  lineChartOptions: ChartOptions = { responsive: true };

  constructor(private dataService: DataService, private authService: AuthService, private modalService: NgbModal, private router: Router) { }

  onCellDoubleClicked(event: any) {
    let tableRowData: any = event.data;
    let max: number = Math.max(tableRowData.HG, tableRowData.HM, tableRowData.HR);
    let min: number = Math.min(tableRowData.HG, tableRowData.HM, tableRowData.HR);
    let sum: number = parseInt(tableRowData.HG) + parseInt(tableRowData.HM) + parseInt(tableRowData.HR);
    let mean: number = sum / 3;

    const modalRef = this.modalService.open(ModalContent);

    // Sets the inner modal component defined references to the stored values
    modalRef.componentInstance.modalHG = tableRowData.HG;
    modalRef.componentInstance.modalHM = tableRowData.HM;
    modalRef.componentInstance.modalHR = tableRowData.HR;
    modalRef.componentInstance.modalMax = max;
    modalRef.componentInstance.modalMin = min;
    modalRef.componentInstance.modalSum = sum;
    modalRef.componentInstance.modalMean = mean;
  }

  onLogoutButtonClick() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  reloadPage(){
    this.router.navigate([this.router.url]);
  }

  ngOnInit(): void {
    this.dataService.getData().subscribe(response => {
      if(!response){
        this.manageResponseError();
        return;
      }

      this.responseError = false;

      let finalData: Map<string, Object> = new Map();
      response.HG.forEach((element: any) => {
        finalData.set(element.Date, { HG: element.Value, HM: undefined, HR: undefined });
      });

      response.HM.forEach((element: any) => {
        if (finalData.has(element.Date)) {
          finalData.set(element.Date, { HG: finalData.get(element.Date)["HG"], HM: element.Value, HR: 0 });
        } else {
          finalData.set(element.Date, { HG: undefined, HM: element.Value, HR: undefined });
        }
      });

      response.HR.forEach((element: any) => {
        if (finalData.has(element.Date)) {
          finalData.set(element.Date, { HG: finalData.get(element.Date)["HG"], HM: finalData.get(element.Date)["HM"], HR: element.Value });
        } else {
          finalData.set(element.Date, { HG: undefined, HM: undefined, HR: element.Value });
        }
      });

      // Clears table data
      this.tableRowData = [];

      // Chart data
      let dateValues: string[] = [];
      let hgValues: number[] = [];
      let hmValues: number[] = [];
      let hrValues: number[] = [];

      finalData.forEach((value, key) => {
        this.tableRowData.push({ FECHA: new Date(key), HG: value["HG"], HM: value["HM"], HR: value["HR"] });

        let currentDate: Date = new Date(key);
        dateValues.push(`${currentDate.getDate().toString()}/${(currentDate.getMonth() + 1).toString()}/${currentDate.getFullYear().toString()}`);
        hgValues.push(parseInt(value["HG"]));
        hmValues.push(parseInt(value["HM"]));
        hrValues.push(parseInt(value["HR"]));
      });

      this.lineChartLabels = dateValues;
      this.lineChartData = [
        { data: hgValues, label: 'HG' },
        { data: hmValues, label: 'HM' },
        { data: hrValues, label: 'HR' }
      ];
    },
      error => {
        this.manageResponseError();
      });
  }

  manageResponseError(){
    console.log("There was a response error");
    this.responseError = true;
  }

}


@Component({
  selector: 'modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Resumen de Datos</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
    <p>Valores HG: {{modalHG}} HM: {{modalHM}} HR: {{modalHR}}</p>
    <p>
      Máximo: {{modalMax}}<br>
      Mínimo: {{modalMin}}<br>
      Media: {{modalMean}}<br>
      Suma: {{modalSum}}<br>
    </p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Cerrar</button>
    </div>
  `
})
export class ModalContent {
  @Input() modalHG;
  @Input() modalHM;
  @Input() modalHR;
  @Input() modalMax;
  @Input() modalMin;
  @Input() modalMean;
  @Input() modalSum;

  constructor(public activeModal: NgbActiveModal) { }
}