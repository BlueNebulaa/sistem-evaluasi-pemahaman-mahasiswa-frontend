export type ThemeChoice = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "themis-theme";

/**
 * Skrip kecil yang dijalankan di <head> sebelum halaman tampil, supaya pilihan tema
 * tersimpan langsung berlaku tanpa kedipan warna.
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
