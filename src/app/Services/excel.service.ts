import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as XLSX from "xlsx";
import { map } from "rxjs/operators";
import { KPI, statsDpt, statsinPie, featureStats } from "../Models/interfaces";

@Injectable({
  providedIn: "root",
})
export class ExcelService {
  constructor(private http: HttpClient) {}

  private transposeArray(matrix: any[][]): any[][] {
    return matrix[0].map((col, i) => matrix.map((row) => row[i]));
  }

  fetchFile(
    filePath: string
  ): Promise<{
    kpis: KPI[];
    statsbyDpt: statsDpt[];
    statsInPie: statsinPie[];
    featureStats: featureStats[];
  }> {
    return this.http
      .get(filePath, { responseType: "arraybuffer" })
      .toPromise()
      .then((data: ArrayBuffer) => {
        const wb: XLSX.WorkBook = XLSX.read(new Uint8Array(data), {
          type: "array",
        });
        const allKPIs: KPI[] = [];
        const statsbyDpt: Array<any> = [];
        const statsinPie: Array<any> = [];
        const featureStats: Array<any> = [];
        wb.SheetNames.forEach((sheetName) => {
          const ws: XLSX.WorkSheet = wb.Sheets[sheetName];
          let jsonData = <any[][]>XLSX.utils.sheet_to_json(ws, { header: 1 });
          if (sheetName === "Dpt_KPis") {
            const kpiData = this.processKpiData(jsonData);
            allKPIs.push(...kpiData);
          }
          if (sheetName === "statistics_Dpt") {
            jsonData = this.transposeArray(jsonData);
            const statsData = this.processStatisticDpt(jsonData);
            statsbyDpt.push(...statsData);
          }
          if (sheetName === "dpt_Pie") {
            const statsbyPie = this.processStatsinPie(jsonData);
            statsinPie.push(...statsbyPie);
          }
          if (sheetName === "feature_stats") {
            const features = this.processFeatureeStsts(jsonData);
            featureStats.push(...features);
          }
        });

        return {
          kpis: allKPIs,
          statsbyDpt: statsbyDpt,
          statsInPie: statsinPie,
          featureStats: featureStats,
        };
      });
  }

  private processKpiData(data: any[][]): KPI[] {
    const rows = data.slice(1);
    const kpi: KPI[] = [];

    let currentDepartment = "";
    let noFeatureClassesSum = 0;
    let dataCompleteness = "";

    rows.forEach((row) => {
      const dptname = row[1] || currentDepartment;
      const noOfFeatureClass = row[3] ? parseInt(row[3].toString(), 10) : 0;
      const departmentCompletenessKPI = row[4] || dataCompleteness;

      if (dptname && dptname !== currentDepartment) {
        if (currentDepartment) {
          kpi.push({
            dptname: currentDepartment,
            nofeatureclasses: noFeatureClassesSum,
            datacompleteness: dataCompleteness,
            accuracy: "NA",
          });
        }

        currentDepartment = dptname;
        noFeatureClassesSum = 0;
        dataCompleteness = "";
      }

      if (noOfFeatureClass !== undefined) {
        noFeatureClassesSum += noOfFeatureClass;
      }

      if (departmentCompletenessKPI && departmentCompletenessKPI !== "NA") {
        if (!isNaN(departmentCompletenessKPI)) {
          dataCompleteness = (departmentCompletenessKPI * 100).toFixed(2) + "%";
          // dataCompleteness = departmentCompletenessKPI
        }
      }
    });

    if (currentDepartment) {
      kpi.push({
        dptname: currentDepartment,
        nofeatureclasses: noFeatureClassesSum,
        datacompleteness: dataCompleteness,
        accuracy: "NA",
      });
    }

    return kpi;
  }

  private processStatisticDpt(data: any[][]): statsDpt[] {
    const rows = data.slice(1);
    console.log("special-check", data);

    const statisticsDpt: Array<any> = [];

    rows.forEach((row) => {
      const layerType = row[0];
      const statsbyDpt = row.slice(1);

      const existingEntry = statisticsDpt.find(
        (entry) => entry.layertype === layerType
      );

      if (existingEntry) {
        existingEntry.statsdpt = existingEntry.statsdpt.concat(statsbyDpt);
      } else {
        statisticsDpt.push({
          layertype: layerType,
          statsdpt: statsbyDpt,
        });
      }
    });
    return statisticsDpt;
  }

  private processStatsinPie(data: any[][]): statsinPie[] {
    const statsInPie: statsinPie = { dpt: [], total_Count: [] };

    data.slice(1).forEach((row) => {
      if (row[0] && row[1] !== undefined) {
        statsInPie.dpt.push(row[0]);
        statsInPie.total_Count.push(row[1]);
      }
    });

    return [statsInPie];
  }

  private processFeatureeStsts(data: any[][]): featureStats[] {
    // Remove the header row
    const rows = data.slice(1);

    // Initialize the resulting array
    const featureStats: {
      featuretype: string;
      locationcount: (number | string)[];
    }[] = [];

    // Process each row
    rows.forEach((row) => {
      if (row[0]) {
        const featuretype = row[0];
        const locationcount = row.slice(1);
        featureStats.push({ featuretype, locationcount });
      }
    });

    return featureStats;
  }
}
