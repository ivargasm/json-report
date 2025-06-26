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

interface ComponentStore {
    table: ReportComponent
    resume?: ReportComponent
    setComponent: (comp: ReportComponent) => void
    setParsedColumns: (type: 'table' | 'resume', columns: ParsedColumn[]) => void
    reset: () => void
    clearTable: () => void
    clearResume: () => void
    loadFromJSON: (data: { components?: ReportComponent[] }) => void
}

export const useComponentsStore = create<ComponentStore>((set) => ({
    table: {
        id: '',
        type: 'table',
        title: '',
        schema: 'project',
        datasource: '',
        count_datasource: '',
        columns: [],
        parsedColumns: [],
    },

    resume: undefined,

    setComponent: (comp) =>
        set((state) => {
            if (comp.type === 'table') return { ...state, table: comp }
            if (comp.type === 'resume') return { ...state, resume: comp }
            return state
        }),

    setParsedColumns: (type, columns) =>
        set((state) => {
            if (type === 'table') {
                return {
                    ...state,
                    table: {
                        ...state.table,
                        parsedColumns: columns,
                    },
                }
            }
            if (type === 'resume') {
                // Si ya existe resume, lo actualizamos; si no, lo creamos
                const baseResume: ReportComponent = {
                    id: state.resume?.id || 'resume',
                    type: 'resume',
                    title: state.resume?.title || '',
                    schema: state.resume?.schema || 'project',
                    datasource: state.resume?.datasource || '',
                    last_date_datasource:
                        state.resume?.last_date_datasource || '',
                    parsedColumns: columns,
                    rows: state.resume?.rows || [],
                    column_titles: state.resume?.column_titles || [],
                }
                return {
                    ...state,
                    resume: baseResume,
                }
            }
            return state
        }),
    reset: () => set(() => ({
        table: {
            id: '',
            type: 'table',
            title: '',
            schema: 'project',
            datasource: '',
            count_datasource: '',
            columns: [],
            parsedColumns: [],
        },
        resume: undefined,
    })),

    clearResume: () =>
        set(() => ({
            resume: undefined,
        })),

    clearTable: () =>
        set(() => ({
            table: {
                id: '',
                type: 'table',
                title: '',
                schema: 'project',
                datasource: '',
                count_datasource: '',
                columns: [],
                parsedColumns: [],
            },
        })),

    loadFromJSON: (data: { components?: ReportComponent[] }) => {
        const resume = data.components?.find((c: any) => c.type === 'resume')
        const table = data.components?.find((c: any) => c.type === 'table')
        set(() => ({
            resume,
            table,
        }))
    }




}))
