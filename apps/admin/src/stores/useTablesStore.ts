import { persist } from 'zustand/middleware';
import { RestaurantTableProps, supaApiInstance } from '@/services';
import { create } from 'zustand';
import { get } from 'http';
import { toastHelper } from '@/components';
import { useUserStore } from './useUserStore';

interface TablesProps {
  rehydrated: boolean;
  setRehydrated: () => void;

  tables: RestaurantTableProps[];
  setTables: (tables: RestaurantTableProps[]) => void;
  getTables: () => void;
  clearTables: () => void;
}

export const useTablesStore = create<TablesProps>()(
  persist(
    (set, get) => ({
      rehydrated: false,
      setRehydrated: () => set({ rehydrated: true }),

      tables: [],
      setTables: (tables: RestaurantTableProps[]) => set({ tables }),
      getTables: async () => {
        const portfolioDetail = useUserStore.getState().portfolioDetail;
        if (!portfolioDetail) return;
        const { data, error } = await supaApiInstance.getRestaurantTables(
          portfolioDetail.id
        );
        if (error) {
          toastHelper.error(error.message);
        } else {
          set({ tables: data || [] });
        }
      },
      clearTables: () => set({ tables: [] }),
    }),
    {
      name: 'tables',
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          // console.log('an error happened during hydration', error);
        } else {
          state?.setRehydrated();
        }
      },
    }
  )
);
