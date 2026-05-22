export interface DataItem {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    department: string;
    lastLogin: string;
    value: number;
}

export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
    key: keyof DataItem;
    order: SortOrder;
}

export interface FilterConfig {
    key: keyof DataItem;
    value: string;
}

export interface ColumnDefinition {
    key: keyof DataItem;
    label: string;
    visible: boolean;
    width?: number;
    aggType?: 'sum' | 'avg' | 'count';
    formatter?: (val: any) => any;
    align?: 'left' | 'center' | 'right';
    dataType?: string;
}

export interface ApiResponse {
    data: DataItem[];
    total: number;
    page: number;
    pageSize: number;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'quantum-grid': any;
            'quantum-grid-column': any;
        }
    }
}
