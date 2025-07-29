import { create } from 'zustand'

export interface ParsedColumn {
    column: string
    description: string
}

export interface TableColumn extends ParsedColumn {
    is_number?: boolean
    is_sortable?: boolean
    is_percent?: boolean
    is_image?: boolean
}

export interface ResumeColumn {
    column: string
    is_number?: boolean
    is_percent?: boolean
    is_amount?: boolean
    is_image?: boolean
}

export interface ResumeRow {
    description: string
    columns: ResumeColumn[]
}

export interface ReportComponent {
    id: string
    type: 'resume' | 'table'
    title: string
    schema: 'project' | 'stoiii' | 'stoiii_config'
    datasource: string
    count_datasource?: string
    last_date_datasource?: string
    column_titles?: string[]
    rows?: ResumeRow[]
    columns?: TableColumn[]
    parsedColumns?: ParsedColumn[]
}

interface ComponentsStore {
    components: ReportComponent[]
    addComponent: (component: ReportComponent) => void
    updateComponent: (id: string, updated: Partial<ReportComponent>) => void
    removeComponent: (id: string) => void
    setParsedColumns: (id: string, columns: ParsedColumn[]) => void
    clear: () => void
    loadFromJSON: (data: { components?: ReportComponent[] }) => void
}

export const useComponentsStore = create<ComponentsStore>((set) => ({
    components: [],

    addComponent: (component) =>
        set((state) => ({
            components: [...state.components, component],
        })),

    updateComponent: (id, updated) =>
        set((state) => ({
            components: state.components.map((c) =>
                c.id === id ? { ...c, ...updated } : c
            ),
        })),

    removeComponent: (id) =>
        set((state) => ({
            components: state.components.filter((c) => c.id !== id),
        })),

    setParsedColumns: (id, columns) =>
        set((state) => ({
            components: state.components.map((c) =>
                c.id === id ? { ...c, parsedColumns: columns } : c
            ),
        })),

    clear: () => set({ components: [] }),

    loadFromJSON: (data) =>
        set({
            components: data.components || [],
        }),
}))
