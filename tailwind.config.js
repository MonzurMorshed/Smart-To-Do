/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          bg: "#F3F4F6",          
          card: "#FFFFFF",        
          text: "#1F2937",        
          muted: "#6B7280",       
          primary: "#4F46E5",     
          primaryHover: "#4338CA",
          inputBorder: "#E5E7EB", 
          inputFocus: "#E0E7FF",  
        },
        dark: {
          bg: "#111827",          
          card: "#1F2937",        
          text: "#F9FAFB",        
          muted: "#9CA3AF",       
          primary: "#6366F1",     
          primaryHover: "#4F46E5",
          inputBorder: "#374151", 
          inputFocus: "#818CF8",  
        },
      },
    },
  },
  plugins: [],
}
