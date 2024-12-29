export interface GetRestaurantInfo {
  data: {
    heroImgUrl: string;
    locationId: number;
    name: string;
    averageRating: number;
    userReviewCount: number;
    currentOpenStatusCategory: string;
    currentOpenStatusText: string;
    establishmentTypeAndCuisineTags: string[];
    priceTag: string;
    hasMenu: boolean;
    menuUrl: null | string;
    reviewSnippets: ReviewSnippets;
    awardInfo: null;
    isStoryboardPublished: boolean;
  };
}
export interface RestaurantInfo {
  data: {
    heroImgUrl: string;
    locationId: number;
    name: string;
    averageRating: number;
    userReviewCount: number;
    currentOpenStatusCategory: string;
    currentOpenStatusText: string;
    establishmentTypeAndCuisineTags: string[];
    isStoryboardPublished: boolean;
  };
}

export interface ReviewSnippets {
  reviewSnippetsList: {
    reviewText: string;
    reviewUrl: string;
  }[];
}

export interface GeoLocationResponse {
  address: {
    road?: string;
    suburb?: string;
    city?: string;
  };
}
