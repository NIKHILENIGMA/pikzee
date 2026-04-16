import { create } from "zustand";
// import { createUiSlice, type UiSlice } from "./slices/ui.slice";
import { createDraftSlice, type DraftSlice } from "./slices/editor.slice";

// Combine all slices to create the complete store
export type Store = DraftSlice;


/**
 * Main store hook that combines all slices (UI state management)
 * @returns {DraftSlice} The combined store with all draft-related state and actions
 */
export const useStore = create<Store>()((...args) => ({
    ...createDraftSlice(...args)
}))
