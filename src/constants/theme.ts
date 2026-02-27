export const THEMES = {
    light: {
        bg: "#f5f4f9",
        text: "#0d0d1a",
        muted: "#374151",        // was #6b7280 — much darker for contrast
        subtext: "#4b5563",      // was #9ca3af — darker
        border: "#d1cfe8",       // slightly richer border
        navBg: "#ffffff",
        tagBg: "#ede9f8",
        inputBg: "#faf9ff",
        cardBg: "#ffffff",
        // Accents
        accent: "#db2777",
        accent2: "#4f46e5",
        accent3: "#047857",      // darker emerald for contrast on light bg
        warn: "#b45309",         // darker amber
        danger: "#b91c1c",       // darker red
        // Sidebar (always deep dark)
        sidebarBg: "#0d0d1a",
        sidebarBorder: "#1a1a2e",
        sidebarText: "#c4c4d8",  // brighter sidebar text
        sidebarMuted: "#6a6a8a",
        sidebarActive: "#fff0f8",
        sidebarActiveText: "#0d0d1a",
        sidebarHover: "#1a1a2e",
        sidebarAccent: "#ec4899",
    },
    dark: {
        bg: "#0d0d1a",
        text: "#f1f0ff",
        muted: "#b0b8c8",        // was #94a3b8 — brighter for dark bg contrast
        subtext: "#8892a4",      // was #64748b — brighter
        border: "#1e293b",
        navBg: "#111128",
        tagBg: "#1a1a2e",
        inputBg: "#111128",
        cardBg: "#13132a",
        // Accents (brighter for dark bg readability)
        accent: "#f472b6",
        accent2: "#818cf8",
        accent3: "#34d399",
        warn: "#fbbf24",
        danger: "#f87171",
        // Sidebar (slightly different from content)
        sidebarBg: "#080813",
        sidebarBorder: "#1a1a2e",
        sidebarText: "#b0b0d0",  // bright enough to read
        sidebarMuted: "#5a5a7a",
        sidebarActive: "#1a1a3e",
        sidebarActiveText: "#f472b6",
        sidebarHover: "#13132a",
        sidebarAccent: "#f472b6",
    },
};
