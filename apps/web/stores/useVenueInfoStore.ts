import { ApiInstance, RestaurantInfo, handleError } from '@/services';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSelector } from 'reselect';

interface VenueInfoState {
  rehydrated: boolean;
  setRehydrated: () => void;

  productList: RestaurantInfo[];
  productDetail: { [key: string]: RestaurantInfo };
  getProductList: () => void;

  currentVenue: RestaurantInfo | null;
  setCurrentVenue: (locationId: string) => void;

  // positionList: PositionData[];
  // portfolioDetail: PortfolioDetailSummary | undefined;
  // portfolioStats: PortfolioStats | undefined;
  // portfolioFee: PortfolioFee;
  getPortfolioDetail: () => Promise<void>;
  clearUserData: () => void;

  favProduct: { [key: string]: boolean };
  setFavProduct: (productId: string) => void;
}

export const useVenueInfoStore = create<VenueInfoState>()(
  persist(
    (set, get) => ({
      rehydrated: false,
      setRehydrated: () => set({ rehydrated: true }),

      productList: [],
      productDetail: {},
      getProductList: async () => {
        const res = await ApiInstance.getProductList();
        const { result, error } = handleError(res, true);
        if (error) return;
        const productDetailObject =
          result?.products?.reduce((acc: any, item: any) => {
            acc[item.product_id] = item;
            return acc;
          }, {}) || {};
      },

      currentVenue: null,
      setCurrentVenue: (productId: string) => {
        const { currentVenue, productDetail } = get();
        if (!productId) return;
        if (currentVenue?.locationId === productId) return;
        const findProduct = productDetail?.[productId];
        if (!findProduct) return;
        set({
          currentVenue: findProduct,
        });
      },

      positionList: [],
      portfolioDetail: undefined,
      portfolioStats: undefined,
      portfolioFee: { maker_fee: 0, taker_fee: 0 },
      getPortfolioDetail: async () => {
        if (!ApiInstance.checkHaveAuth()) return;
        const res = await ApiInstance.getPortfolioDetail();
        const { result, error } = handleError(res, true);
        if (error) return;
        const { summary, positions, stats } = result || {};

        if (
          anyToFloat(summary?.total_initial_margin) >
          anyToFloat(summary?.total_account_value)
        )
          NotiController.showWarning('marginUsage100');
        else NotiController.closeWarning('marginUsage100');

        if (summary?.in_liquidation)
          NotiController.showWarning('inLiquidation');
        else NotiController.closeWarning('inLiquidation');

        set({
          portfolioDetail: summary,
          portfolioStats: stats,
          positionList:
            positions?.sort(
              (a, b) =>
                anyToFloat(b.net_size) * anyToFloat(b.mark_price) -
                anyToFloat(a.net_size) * anyToFloat(a.mark_price)
            ) || [],
          portfolioFee: {
            maker_fee: result?.maker_fee || 0,
            taker_fee: result?.taker_fee || 0,
          },
        });
      },

      clearUserData: () => {
        set({
          positionList: [],
          portfolioDetail: undefined,
          portfolioStats: undefined,
          portfolioFee: { maker_fee: 0, taker_fee: 0 },
        });
      },

      favProduct: {},
      setFavProduct: (productId: string) =>
        set((state) => ({
          favProduct: {
            ...state.favProduct,
            [productId]: !state.favProduct[productId],
          },
        })),
    }),
    {
      version: 8,
      name: 'currentTradingInfo-storage',
      skipHydration: true,
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          // console.log('an error happened during hydration', error);
        } else {
          if (state) state.setRehydrated();
          const { productList } = state || {};
          if (productList?.length) TradingSymbolList.setList(productList);
        }
      },
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !['oraclePrices'].includes(key)
          )
        ), // omit oraclePrices
    }
  ),
  Object.is
);

export const selectCurrentPosition = createSelector(
  [
    (state: CurrentTradingInfoState) => state.positionList,
    (state: CurrentTradingInfoState) => state.currentTrade,
  ],
  (positionList, currentTrade) => {
    const findPosition = positionList?.find(
      (item) => item.product_id === currentTrade?.product_id
    );
    return findPosition;
  }
);
