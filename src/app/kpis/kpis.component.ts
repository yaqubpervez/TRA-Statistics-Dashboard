import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { ExcelService } from "src/app/Services/excel.service";
import { KPI, TransformedKPI } from "../Models/interfaces";

@Component({
  selector: "dpt-kpis",
  templateUrl: "./kpis.component.html",
  styleUrls: ["./kpis.component.scss"],
})
export class KPIsComponent {
  kpis: KPI[];
  transformKpis: TransformedKPI[];
  imageUrls: Array<any>;
  logoTextColor: Array<any>;

  constructor(private excelService: ExcelService) {
    this.transformKpis = [];
    this.kpis = [];
    this.logoTextColor = [
      "#F9A338",
      "#879CE7",
      "#35CBC4",
      "#E77697",
      "#4B955F",
      "#843DFB",
      "#FF0000",
    ];
    this.imageUrls = [
      "assets/parking.png",
      "assets/rfm.jpg",
      "assets/row.png",
      "assets/trf.png",
      "assets/rds.png",
      "assets/its.png",
    ];
  }

  ngOnInit() {
    this.loadExcelData();
  }

  loadExcelData() {
    const filePath = "assets/ADC_dashboard.xlsx";

    this.excelService
      .fetchFile(filePath)
      .then((result) => {
        if (result) {
          this.kpis = result.kpis;
          this.transformKpis = this.kpis.map((el, index) => ({
            dptName: el.dptname,
            data: [el.nofeatureclasses, el.datacompleteness, el.accuracy],
            logo: this.imageUrls[index],
          }));
          console.log("KPIs in component:", this.transformKpis);
        }
      })
      .catch((error) => {
        console.error("Error processing file:", error);
      });
  }
}
