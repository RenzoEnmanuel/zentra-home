import axios from "axios";
import { CLAVE_SESION } from "../context/sesionStorage";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api",
  timeout: 8000,
  headers: { Accept: "application/json" },
});

// Si hay sesión, cada petición lleva el token (Laravel Sanctum usa "Bearer")
http.interceptors.request.use((config) => {
  try {
    const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION));
    if (sesion?.token) config.headers.Authorization = `Bearer ${sesion.token}`;
  } catch {
    // Sesión ilegible: se envía la petición sin token
  }
  return config;
});