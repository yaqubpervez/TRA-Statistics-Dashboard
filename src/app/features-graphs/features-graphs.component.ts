import { Component, OnInit } from "@angular/core";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { getChartLabelPlugin, PLUGIN_ID } from "chart.js-plugin-labels-dv";
import { ExcelService } from "src/app/Services/excel.service";
import { statsDpt, statsinPie } from "../Models/interfaces";

@Component({
  selector: "features-graphs",
  templateUrl: "./features-graphs.component.html",
  styleUrls: ["./features-graphs.component.scss"],
})
export class FeaturesGraphsComponent implements OnInit {
  chart: Chart = null;
  legendColor: Array<any>;
  barGraphColor: Array<any>;
  statsbyDpt: statsDpt[] = [];
  statsinPie: statsinPie[] = [];
  constructor(private excelService: ExcelService) {
    this.barGraphColor = ["#f5b285", "#ffd966", "#9dc3e7", "#a9d18d"];
    this.legendColor = ["#f5b285", "#ffd966", "#9dc3e7", "#a9d18d"];
  }

  ngOnInit(): void {
    Chart.register(...registerables);
    // Chart.register(ChartDataLabels);
    // Chart.register(getChartLabelPlugin());
    this.loadExcelData();
  }

  ngAfterViewInit() {
    // this.stackBarChart();
  }

  loadExcelData() {
    const filePath = "assets/ADC_dashboard.xlsx";

    this.excelService
      .fetchFile(filePath)
      .then((result) => {
        // console.log(result)
        if (result) {
          this.statsbyDpt = result.statsbyDpt;
          this.statsinPie = result.statsInPie;
          console.log("stats in component:", this.statsbyDpt);
          console.log("stats in Pie:", this.statsinPie);
          this.pieChart();
          this.stackBarChart();
        }
      })
      .catch((error) => {
        console.error("Error processing file:", error);
      });
  }

  getFontSize() {
    if (window.innerWidth < 900) {
      return 9;
    } else if (window.innerWidth >= 900 && window.innerWidth < 1100) {
      return 10;
    } else if (window.innerWidth >= 1100 && window.innerWidth < 1400) {
      return 11;
    } else if (window.innerWidth >= 1400 && window.innerWidth < 1600) {
      return 12;
    } else if (window.innerWidth >= 1600 && window.innerWidth < 2000) {
      return 14;
    } else {
      return 15;
    }
  }

  pieChart() {
    let data: any;
    data = {
      labels: this.statsinPie[0].dpt,
      datasets: [
        {
          label: "Total Count",
          data: this.statsinPie[0].total_Count,
          backgroundColor: [
            "#FAA93A",
            "#889BE0",
            "#7F37FD",
            "#37CCC5",

            "#4B955F",

            "#DB6689",
          ],
          borderColor: [
            "#FAA93A",
            "#889BE0",
            "#7F37FD",
            "#37CCC5",

            "#4B955F",

            "#DB6689",
          ],
          hoverOffset: 4,
        },
      ],
    };

    const pieLabelLine = {
      id: "pieLabelLine",
      afterDraw(chart, args, options) {
        const {
          ctx,
          chartArea: { top, bottom, left, right, width, height },
        } = chart;
        chart.data.datasets.forEach((dataset, i) => {
          chart.getDatasetMeta(i).data.forEach((datapoint, index) => {
            console.log(dataset);
            const { x, y } = datapoint.tooltipPosition();
            // ctx.fillStyle = dataset.borderColor[index];
            // ctx.fillRect(x, y, 50, 10);
            const halfwidth = width / 2;
            const halfhight = height / 2;

            const xLine = x >= halfwidth ? x + 60 : x - 60;
            const yLine = y >= halfhight ? y + 60 : y - 60;
            const extraLine = x >= halfwidth ? 15 : -15;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(xLine, yLine);
            ctx.lineTo(xLine + extraLine, yLine);
            ctx.strokeStyle = dataset.borderColor[index];
            ctx.stroke();

            // text
            const textWidth = ctx.measureText(chart.data.labels[index].width);
            ctx.font = "12px Arial";

            // control the position
            const textPosition = x >= halfwidth ? "left" : "right";
            const plusFivePx = x >= halfwidth ? 5 : -5;
            ctx.textAlign = textPosition;
            ctx.textBaseline = "middle";
            ctx.fillStyle = dataset.borderColor[index];
            ctx.fillText(
              dataset.data[index],
              xLine + extraLine + plusFivePx,
              yLine
            );
          });
        });
      },
    };

    const customDataLabels = {
      id: "customDataLabels",
      afterDatasetsDraw(chart, args, pluginOption) {
        const {
          ctx,
          data,
          chartArea: { top, bottom, left, right, width, height },
        } = chart;
        ctx.save();

        // const halfwidth = width / 2
        // const halfhight = height / 2

        data.datasets[0].data.forEach((datapoint, index) => {
          const { x, y } = chart
            .getDatasetMeta(0)
            .data[index].tooltipPosition();
          // ctx.font = 'bold 12px sans-serif';
          // ctx.fillStyle = data.datasets[0].borderColor[index];
          ctx.fillStyle = "#00000";
          ctx.textAlign = "center";
          ctx.Baseline = "middle";

          if (datapoint >= 60000) {
            // if (window.innerWidth < 900)
            //   {

            //   ctx.font = 'bold 9px Manrope'
            //   }

            //    else if (window.innerWidth >= 900 && window.innerWidth < 1100)
            //   {

            //   } else if (window.innerWidth >= 1100 && window.innerWidth < 1400)
            //   {

            //   } else if (window.innerWidth >= 1400 && window.innerWidth < 1600)
            //   {

            //   } else if (window.innerWidth >= 1600 && window.innerWidth < 2000)

            //   {

            //   } else {

            //   }
            // ctx.font = 'bold 12px Manrope'
            ctx.fillStyle = "#fff";
            ctx.fillText(datapoint.toLocaleString(), x, y);
          } else {
            const halfwidth = width / 2 + left;
            const halfhight = height / 2 + top;
            let xLine: any;
            let yLine: any;
            let extraLine: any;
            let extraLineY: any;

            if (window.innerWidth < 800) {
              xLine = x >= halfwidth ? x + 50 : x - 50;
              yLine = y >= halfhight ? y + 12 : y - 12;
              extraLine = x >= halfwidth ? 1 : -1;
              extraLineY = y >= halfhight ? 30 : -30;
              const textWidth = ctx.measureText(chart.data.labels[index].width);
              ctx.font = "bold 9px Manrope";
            } else if (window.innerWidth >= 800 && window.innerWidth < 1000) {
              xLine = x >= halfwidth ? x + 55 : x - 55;
              yLine = y >= halfhight ? y + 12 : y - 12;
              extraLine = x >= halfwidth ? 1 : -1;
              extraLineY = y >= halfhight ? 30 : -30;
              const textWidth = ctx.measureText(chart.data.labels[index].width);
              ctx.font = "bold 9px Manrope";
            } else if (window.innerWidth >= 1000 && window.innerWidth < 1100) {
              xLine = x >= halfwidth ? x + 75 : x - 75;
              yLine = y >= halfhight ? y + 17 : y - 17;
              extraLine = x >= halfwidth ? 1 : -1;
              extraLineY = y >= halfhight ? 50 : -50;
              const textWidth = ctx.measureText(chart.data.labels[index].width);
              ctx.font = "bold 10px Manrope";
            } else if (window.innerWidth >= 1100 && window.innerWidth < 1200) {
              xLine = x >= halfwidth ? x + 85 : x - 85;
              yLine = y >= halfhight ? y + 18 : y - 18;
              extraLine = x >= halfwidth ? 1 : -1;
              extraLineY = y >= halfhight ? 50 : -50;
              const textWidth = ctx.measureText(chart.data.labels[index].width);
              ctx.font = "bold 12px Manrope";
            } else if (window.innerWidth >= 1200 && window.innerWidth < 1300) {
              xLine = x >= halfwidth ? x + 50 : x - 50;
              yLine = y >= halfhight ? y + 11 : y - 11;
              extraLine = x >= halfwidth ? 1 : -1;
              extraLineY = y >= halfhight ? 40 : -40;
              const textWidth = ctx.measureText(chart.data.labels[index].width);
              ctx.font = "bold 9px Manrope";
            } else if (window.innerWidth >= 1300 && window.innerWidth < 1500) {
              xLine = x >= halfwidth ? x + 66 : x - 66;
              yLine = y >= halfhight ? y + 15 : y - 15;
              extraLine = x >= halfwidth ? 1 : -1;
              extraLineY = y >= halfhight ? 40 : -40;
              const textWidth = ctx.measureText(chart.data.labels[index].width);
              ctx.font = "bold 11px Manrope";
            } else if (window.innerWidth >= 1500 && window.innerWidth < 1700) {
              xLine = x >= halfwidth ? x + 73 : x - 73;
              yLine = y >= halfhight ? y + 16 : y - 16;
              extraLine = x >= halfwidth ? 1 : -1;
              extraLineY = y >= halfhight ? 50 : -50;
              const textWidth = ctx.measureText(chart.data.labels[index].width);
              ctx.font = "bold 12px Manrope";
            } else if (window.innerWidth >= 1700 && window.innerWidth < 1800) {
              xLine = x >= halfwidth ? x + 84 : x - 84;
              yLine = y >= halfhight ? y + 18 : y - 18;
              extraLine = x >= halfwidth ? 1 : -1;
              extraLineY = y >= halfhight ? 50 : -50;
            } else if (window.innerWidth >= 1800 && window.innerWidth < 1900) {
              xLine = x >= halfwidth ? x + 90 : x - 90;
              yLine = y >= halfhight ? y + 19 : y - 19;
              extraLine = x >= halfwidth ? 1 : -1;
              extraLineY = y >= halfhight ? 50 : -50;
              const textWidth = ctx.measureText(chart.data.labels[index].width);
              ctx.font = "bold 13px Manrope";
            } else if (window.innerWidth >= 1900 && window.innerWidth < 2100) {
              xLine = x >= halfwidth ? x + 98 : x - 98;
              yLine = y >= halfhight ? y + 21 : y - 21;
              extraLine = x >= halfwidth ? 1 : -1;
              extraLineY = y >= halfhight ? 50 : -50;
              const textWidth = ctx.measureText(chart.data.labels[index].width);
              ctx.font = "bold 14px Manrope";
            } else if (window.innerWidth >= 2100 && window.innerWidth < 2300) {
              xLine = x >= halfwidth ? x + 105 : x - 105;
              yLine = y >= halfhight ? y + 23 : y - 23;
              extraLine = x >= halfwidth ? 1 : -1;
              extraLineY = y >= halfhight ? 50 : -50;
              const textWidth = ctx.measureText(chart.data.labels[index].width);
              ctx.font = "bold 15px Manrope";
            } else {
              xLine = x >= halfwidth ? x + 70 : x - 70;
              yLine = y >= halfhight ? y + 18 : y - 18;
              extraLine = x >= halfwidth ? 1 : -1;
              extraLineY = y >= halfhight ? 50 : -50;
            }

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(xLine, yLine);
            ctx.lineTo(xLine + extraLine, yLine + extraLineY);
            ctx.strokeStyle = data.datasets[0].borderColor[index];
            ctx.stroke();

            // text
            // const textWidth = ctx.measureText(chart.data.labels[index].width)
            // ctx.font = 'bold 12px Manrope'

            // control the position
            const textPosition = x >= halfwidth ? "left" : "right";
            const plusFivePx = x >= halfwidth ? 15 : -15;
            // const plusFivePY = y >= halfhight ? 5 : -5;
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.fillStyle = "#000000";

            ctx.fillText(
              data.datasets[0].data[index],
              xLine + extraLine + -9,
              yLine + extraLineY + 8
            );
          }
        });
      },
    };

    const config: any = {
      type: "pie",
      data: data,
      options: {
        locale: 'en-EN',
        responsive: true,
        scales: {

        },
        plugins: {
          legend: {
            position: "bottom",

            labels: {
              boxWidth: 12,
              font: {
                size: this.getFontSize,
              },
            },
          },
          tooltip: {
            yAlign: "bottom",
            displayColors: false,
            backgroundColor: (tooltipItem: any) => {
              if (tooltipItem) {
                console.log(tooltipItem);
                return tooltipItem.tooltip.labelColors[0].backgroundColor;
              }
            },
          },
          labels: {
            // render: 'value',
            position: "outside",
            textMargin: 4,

            render: (ctx: any) => {
              // console.log('hello', ctx.value);
              if (ctx.value < 60000) {
                return ctx.value;
              }
            },
          },

          datalabels: {
            // display: true,
            // align: (context: any) => {
            //   // If value is below the limit, align the label outside
            //   return context.dataset.data[context.dataIndex] < 25 ? '' : 'end';
            // },
            formatter: (value: any) => {
              
              if (value < 60000) {
                return "";
              } else {
                return value;
              }
            },
            color: "white",
            font: {
              weight: "bold",
              size: 13,
            },
            // offset: (context: any) => {
            //   // Provide additional offset for labels outside
            //   return context.dataset.data[context.dataIndex] < 3 ? 20 : 0;
            // }
            // rotation: 90
          },
        },
      },
      plugins: [customDataLabels],
      // ChartDataLabels,
    };

    this.chart = new Chart("MyChart", config);
  }

  stackBarChart() {
    const barData: Array<any> = [];
    this.statsbyDpt.forEach((el, index) => {
      let obj = {
        label: el.layertype,
        data: el["statsdpt"],
        backgroundColor: this.barGraphColor[index],
      };
      barData.push(obj);
      console.log("check", barData);
    });

    const data = {
      labels: [
         "PRK",
         "RFM",
        "ROW",
         "TRF",
         "RDS",
         "ITS",
         "Total",
      ],
      datasets: barData,
    };

    console.log("check", data);

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: "black",
            font: {
              size: this.getFontSize,
              family: "Manrope",
              weight: 800,
            },
          },
          grid: {
            display: false,
          },
        },

        y: {
          stacked: true,
          ticks: {
            color: "black",
            font: {
              size: this.getFontSize,
              family: "Manrope",
              weight: 700,
            },
          },
          grid: {
            drawTicks: false,
            display: true,
          },
        },
      },

      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          yAlign: "bottom",
          displayColors: false,
          backgroundColor: (tooltipItem: any) => {
            if (tooltipItem.tooltipItems[0]) {
              console.log(tooltipItem.tooltipItems[0]);
              return tooltipItem.tooltipItems[0].dataset.backgroundColor;
            }
          },
        },
        // callbacks: {
        //   label: (tooltipItem: any): any => {
        //     let labelKey = tooltipItem.dataset.label
        //     let label = tooltipItem.dataset.data[tooltipItem.dataIndex];
        //     return labelKey + ': ' + label;
        //   },
        // },
      },
    };

    const config: any = {
      type: "bar",
      data: data,
      options: options,
    };

    this.chart = new Chart("S-Chart", config);
  }

  ngOnDestroy(): void {
    this.chart.destroy();
  }
}

// {
//   label: "Dataset 1",
//   data: [65, 59, 80, 81, 56, 55, 40],
//   backgroundColor: "#a9d18d",
// },
// {
//   label: "Dataset 2",
//   data: [111, 150, 40, 19, 86, 65, 90],
//   backgroundColor: "#9dc3e7",
// },

// {
//   label: "Dataset 3",
//   data: [123, 100, 170, 90, 190, 95, 140],
//   backgroundColor: "#ffd966",
// },
// {
//   label: "Dataset 3",
//   data: [234, 362, 165, 90, 133, 48, 150],
//   backgroundColor: "#f5b285",
// },
