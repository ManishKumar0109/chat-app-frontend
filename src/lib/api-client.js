
import axios from "axios";
import { HOST } from "@/utils/constants";

export const api=axios.create({
    baseURL:HOST,
    withCredentials:true
})

