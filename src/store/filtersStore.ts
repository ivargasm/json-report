import { create } from 'zustand';
import type { FiltersStore } from '../types';

export const useFiltersStore = create<FiltersStore>((set) => ({
    filters: [],
    generic_filters: [],
    filters_properties: {},

    addFilter: (filter) =>
        set((state) => {
            if (state.filters.includes(filter)) return state
            return { filters: [...state.filters, filter] }
        }),

    removeFilter: (filter) =>
        set((state) => ({
            filters: state.filters.filter((f) => f !== filter),
            generic_filters: state.generic_filters.filter((g) => g.selectId !== filter),
            filters_properties: Object.fromEntries(
                Object.entries(state.filters_properties).filter(([key]) => key !== filter)
            ),
        })),

    updateGenericFilter: (filter) =>
        set((state) => {
            const existing = state.generic_filters.find((f) => f.selectId === filter.selectId)
            if (existing) {
                return {
                    generic_filters: state.generic_filters.map((f) =>
                        f.selectId === filter.selectId ? filter : f
                    ),
                }
            } else {
                return {
                    generic_filters: [...state.generic_filters, filter],
                }
            }
        }),

    updateDefaultValue: (selectId, default_value) =>
        set((state) => ({
            filters_properties: {
                ...state.filters_properties,
                [selectId]: { default_value },
            },
        })),
    reset: () => set(() => ({
        filters: [],
        generic_filters: [],
        filters_properties: {},
    })),

    clearFilters: () =>
        set(() => ({
            filters: [],
            generic_filters: [],
            filters_properties: {},
        })),

    loadFromJSON: (data) =>
        set(() => ({
            filters: data.filters ?? [],
            generic_filters: data.generic_filters ?? [],
            filters_properties: data.filters_properties ?? {},
        })),


}))
