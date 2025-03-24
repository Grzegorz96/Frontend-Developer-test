import { create } from "zustand";
import { type Tag } from "../types";

interface FormulaStore {
    formula: string;
    tags: Tag[];
    setFormula: (newFormula: string) => void;
    addTag: (tag: Tag) => void;
    removeTag: (tagId: string) => void;
}

export const useFormulaStore = create<FormulaStore>((set) => ({
    formula: "",
    tags: [],
    setFormula: (newFormula) => set({ formula: newFormula }),
    addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
    removeTag: (tagId) =>
        set((state) => ({ tags: state.tags.filter((t) => t.id !== tagId) })),
}));
