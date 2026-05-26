/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
    "./shared/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warna brand Passandi
        brand: {
          navy: "#1E3A5F", // Deep Blue utama
          blue: "#2563EB", // Blue aksi
          light: "#EFF6FF", // Background biru muda
          gold: "#F59E0B", // Kuning favorit
          danger: "#EF4444", // Merah hapus/wipe
        },
      },
    },
  },
  plugins: [],
};
