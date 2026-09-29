
import { create } from "zustand";
import { authSlice } from "./slices/authSlice";
import { ChatSlice } from "./slices/ChatSlice";

export const useStore=create((set,get)=>({
    ...authSlice(set,get),
    ...ChatSlice(set,get),
}))