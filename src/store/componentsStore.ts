import { create } from 'zustand';
import type { ComponentsStore } from '../types';

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
