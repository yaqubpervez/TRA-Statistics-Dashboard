import { Component, OnInit } from "@angular/core";
import { ExcelService } from "src/app/Services/excel.service";
import { featureStats } from "../Models/interfaces";

@Component({
  selector: "features",
  templateUrl: "./features.component.html",
  styleUrls: ["./features.component.scss"],
})
export class FeaturesComponent implements OnInit {
  featureStatistics: featureStats[] = [];
  imageUrls: Array<any> = []

  constructor(private excelService: ExcelService) {
    this.imageUrls = [
      'assets/road.png',
      'assets/lane.jpg',
      'assets/pole.png',
      'assets/signal.png'
    ]
  }

  ngOnInit(): void {
    this.loadExcelData();
  }

  loadExcelData() {
    const filePath = "assets/ADC_dashboard.xlsx";

    this.excelService
      .fetchFile(filePath)
      .then((result) => {
        // console.log(result)
        if (result) {
          this.featureStatistics = result.featureStats;

          for (let i = 0; i < this.featureStatistics.length; i++) {
            const grandFeature = this.featureStatistics[i].locationcount;
            this.featureStatistics[i].logo = this.imageUrls[i % this.imageUrls.length];
            if (grandFeature.length > 0) {
              const lastItem = grandFeature[grandFeature.length - 1];
              this.featureStatistics[i].grand = lastItem;
              grandFeature.pop();
            }
          }
          console.log("stats in feature:", this.featureStatistics);
        }
      })
      .catch((error) => {
        console.error("Error processing file:", error);
      });
  }
}
