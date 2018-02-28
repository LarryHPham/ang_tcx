import { Component, Input} from '@angular/core';
import { Router } from "@angular/router";
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

//interfaces
import { ModuleHeaderData } from '../../components/module-header/module-header.component';
import { CircleImageData } from "../../components/images/image-data";
import { CircleImage } from "../../components/images/circle-image/circle-image";
import { NoDataBox } from '../../components/error/data-box/data-box.component';
import { BarChartComponent } from '../../components/bar-chart/bar-chart.component';


declare var jQuery:any;

//interfaces
export interface DailyUpdateData {
  hasError: boolean;
  type: string;
  wrapperStyle: any;
  lastUpdateDate: string;
  chart: DailyUpdateChart;
  fullBackgroundImageUrl: string;
  seasonStats: Array<{name: string, value: string, icon: string}>;
  postGameArticle?: PostGameArticleData;
}

export interface DailyUpdateChart {
  categories: Array<string>;
  dataSeries: Array<{name: string, values: Array<any>}>;
}

export interface DataSeries {
  name: string;
  key: string;
}

export interface APIDailyUpdateData {
  lastUpdated: string;
  backgroundImage: string;
  pitcher: boolean;
  seasonStats: Array<any>;
  recentGames: APIGameData;
}

export interface APIGameData {
  pointsFor?: string;
  opponentTeamName?: string;
  pointsAgainst?: string;
  eventId?: string;
  teamId?: string;
  gameStat1?: string;
  gameStat2?: string;
}

export interface PostGameArticleData {
  eventId: string;
  teamId: string;
  url?: Object;
  pubDate: string;
  headline: string;
  text: Array<any>;
  img: string;
}

@Component({
    selector: 'daily-update-module',
    templateUrl: './app/fe-core/modules/daily-update/daily-update.module.html'
})

export class DailyUpdateModule {
  @Input() profileName: string;
  @Input() data: DailyUpdateData;
  @Input() imageConfig: CircleImageData;

  public chartOptions: any;

  public backgroundImage: SafeStyle;

  public noDataMessage: string = 'Sorry, there is no daily update available for [Profile Name]';

  public headerInfo: ModuleHeaderData = {
    moduleTitle: "Daily Update",
    hasIcon: false,
    iconClass: "",
    moduleIdentifier: " - "+this.profileName,
  };

  public comparisonCount: number;


  constructor(private _sanitizer: DomSanitizer){}

  ngOnChanges(event) {
    this.headerInfo.moduleIdentifier = " - "+this.profileName;
    this.noDataMessage = "Sorry, there is no daily update available for " + this.profileName;
    if ( this.data ) {
      this.drawChart();
      this.backgroundImage = this._sanitizer.bypassSecurityTrustStyle("url(" + this.data.fullBackgroundImageUrl + ")");
    }

    if ( this.data && this.data.chart && this.data.chart.dataSeries && this.data.chart.dataSeries.length > 0) {
      var series = this.data.chart.dataSeries[0];
      this.comparisonCount = series.values ? series.values.length : 0;
    }
    else {
      this.comparisonCount = 0;
    }
    if(event.data && event.data['currentValue'] != null && event.data['currentValue'].postGameArticle != null && event.data['currentValue'].postGameArticle.img != null){
      // setting of value below supports both old and new way (HRL & TDL)
      var img = event.data['currentValue'].postGameArticle.img.image != null ? event.data['currentValue'].postGameArticle.img.image : event.data['currentValue'].postGameArticle.img;
      this.imageConfig.mainImage.imageUrl = img != null ? img : null;
    }
  }

  drawChart(){
    var yAxisMin = 0;
    var categories = [];
    var series = [];

    if ( this.data && this.data.chart ) {
      var chart = this.data.chart;
      categories = chart.categories;
      if ( chart.dataSeries ) {
        series = chart.dataSeries.map(item => {
          return {
            pointWidth: 30,
            name: item.name,
            data: item.values,
            dataLabels: {
              style: {
                color: '#999999',
                textShadow: false
              }
            }
          };
        });
      }
    }

    this.chartOptions = {
      chart: {
        type: 'column',
        height: 144,
        marginTop: 10,
        spacingTop: 0,
        spacingBottom: 0,
        style: {
          fontFamily: '\'Lato\', sans-serif'
        }
      },
      title: {
        text: ''
      },
      legend: {
        enabled: false
      },
      xAxis: {
        categories: categories,
        tickWidth: 0,
        labels: {
          style: {
            color: "#999999",
            fontSize: "12px"
          }
        },
      },
      yAxis: {
        min: yAxisMin,
        max: null,
        tickInterval: 2,
        opposite: true,
        title: {
          text: null
        },
        labels: {
          style: {
            color: "#999999",
            textShadow: false
          }
        },
        gridLineColor: "rgba(225, 225, 225, 0.5)"
      },
      plotOptions: {
        column: {
          pointPadding: 0,
          borderWidth: 0,
          groupPadding: .09,
          minPointLength: 3,
          dataLabels: {
            enabled: true,
            textShadow: false,
            inside: false,
            allowOverlap: true,
            crop: false,
            overflow: 'none',
            backgroundColor: undefined,
            y: 0,
            style: {
              textShadow: false
            }
          },
          enableMouseTracking: false
        }
      },
      colors: [
        '#999999',
        '#2d3e50'
      ],
      series: series,
      credits: {
        enabled: false
      }
    };
  };
}
