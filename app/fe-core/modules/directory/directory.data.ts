import { Link, NavigationData } from '../../../global/global-interface';

export interface PagingData {
  rangeText: string;
  totalItems: number;
  description: string;
}

export interface DirectoryItems {
  totalItems: number;
  items: Array<DirectoryProfileItem>
}

export interface DirectoryProfileItem {
  lastUpdated: string;
  dayOfWeek: string;
  mainDescription: Array<Link>;
  subDescription: Array<string>;
}

export interface DirectoryModuleData {
  pageName: string;
  pageParams: any;
  breadcrumbList: Array<Link>;
  directoryListTitle: string;
  hasListings: boolean;
  noResultsMessage: string;
  listingItems: DirectoryItems;
  listingsLimit: number;
  navigationData: NavigationData;
  pagingDescription: string;
}
