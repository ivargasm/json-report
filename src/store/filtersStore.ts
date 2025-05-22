import { create } from 'zustand'

export interface GenericFilter {
    selectId: string
    schema: 'project' | 'stoiii' | 'stoiii_config'
    datasource: string
    count_datasource: string
}

export interface DefaultValue {
    value: string
    description: string
}

export interface FiltersStore {
    filters: string[]
    generic_filters: GenericFilter[]
    filters_properties: Record<string, { default_value: DefaultValue }>
    addFilter: (filter: string) => void
    removeFilter: (filter: string) => void
    updateGenericFilter: (filter: GenericFilter) => void
    updateDefaultValue: (selectId: string, value: DefaultValue) => void
    reset: () => void
}

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

}))
