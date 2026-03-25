// Component-related types
import { ParsedColumn } from './common';

export interface TableColumn extends ParsedColumn {
    is_number?: boolean;
    is_sortable?: boolean;
    is_percent?: boolean;
    is_image?: boolean;
}

export interface ResumeColumn {
    column: string;
    is_number?: boolean;
    is_percent?: boolean;
    is_amount?: boolean;
    is_image?: boolean;
}

export interface ResumeRow {
    description: string;
    columns: ResumeColumn[];
}

export interface ReportComponent {
    id: string;
    type: 'resume' | 'table' | 'basic_card' | 'progress_bar' | 'basic_tree' | 'graph_bar' | 'graph_pie' | 'graph_doughnut' | 'graph_line' | 'graph_mixed';
    title: string;
    schema: string;
    datasource: string;
    count_datasource?: string;
    last_date_datasource?: string;
    column_titles?: string[];
    rows?: ResumeRow[];
    columns?: TableColumn[];
    parsedColumns?: ParsedColumn[];
    descriptions?: string[];
    tree?: any;
    treeColumns?: any[];
    random_colors?: string;
    datasource_alert?: string;
    alert?: {
        schema?: string;
        type?: string;
        message?: string;
    };
}