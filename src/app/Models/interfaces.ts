export interface KPI {
  dptname: string;
  nofeatureclasses: number;
  datacompleteness: string;
  accuracy: string;
  data?: any;
}
export interface TransformedKPI {
  dptName: string;
  data: (string | number)[];
  logo: string
}

export interface statsDpt {
  [x: string]: any;
  layertype: string;
  statsDpt: Array<any>;
}

export interface statsinPie {
  dpt: string[];
  total_Count: number[];
}

export interface featureStats {
  grand?: any;
  featuretype: string;
  locationcount: (number | string)[];
  logo?: any;
}
