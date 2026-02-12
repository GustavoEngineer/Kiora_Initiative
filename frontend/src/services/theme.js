/**
 * Kiora Initiative - Theme Configuration
 * Inspired by tactical/military game aesthetics
 */

export const theme = {
    // Color Palette
    colors: {
        // Minimalist Palette
        primary: {
            main: '#171717',        // Neutral Black
            light: '#404040',       // Dark Gray
            dark: '#000000',        // Pure Black
            glow: 'rgba(0, 0, 0, 0.1)', // Subtle shadow
        },

        // Secondary Colors
        secondary: {
            main: '#737373',        // Neutral Gray
            light: '#a3a3a3',       // Light Gray
            dark: '#52525b',        // Darker Gray
        },

        // Background Colors - Light theme
        background: {
            primary: '#ffffff',     // Pure white
            secondary: '#f9f9f9',   // Off-white for panels
            tertiary: '#f3f3f3',    // Light gray for cards
            overlay: 'rgba(255, 255, 255, 0.85)', // Modal/overlay background
            glass: 'rgba(255, 255, 255, 0.7)',  // Glassmorphism effect
        },

        // Text Colors
        text: {
            primary: '#171717',     // Almost black
            secondary: '#737373',   // Neutral gray
            tertiary: '#a3a3a3',    // Light gray
            accent: '#000000',      // Black accent
            muted: '#d4d4d4',       // Muted text
        },

        // Border Colors
        border: {
            primary: '#e5e5e5',     // Light gray
            secondary: '#d4d4d4',   // Medium gray
            subtle: '#f3f3f3',      // Very subtle
            glow: 'rgba(0, 0, 0, 0.05)',
        },

        // Status Colors - Muted/Pastel
        status: {
            success: '#22c55e',     // Green
            warning: '#f59e0b',     // Amber
            error: '#ef4444',       // Red
            info: '#3b82f6',        // Blue
        },

        // UI Elements
        ui: {
            buttonPrimary: '#171717',
            buttonSecondary: '#f3f3f3',
            buttonHover: '#404040',
            inputBg: '#ffffff',
            inputBorder: '#e5e5e5',
            inputFocus: '#171717',
            progressBar: '#171717',
            progressBg: '#e5e5e5',
        }
    },

    // Typography - Clean Sans
    typography: {
        fontFamily: {
            primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            secondary: "'Inter', sans-serif",
            mono: "'JetBrains Mono', monospace",
        },

        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
        },

        fontWeight: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
        },

        lineHeight: {
            tight: 1.2,
            normal: 1.5,
            relaxed: 1.75,
        },

        letterSpacing: {
            tight: '-0.02em',
            normal: '0',
            wide: '0.02em',
            wider: '0.05em',
        }
    },

    // Spacing Scale
    spacing: {
        0: '0',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
    },

    // Border Radius
    borderRadius: {
        none: '0',
        sm: '2px',
        base: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        full: '9999px',
    },

    // Shadows - Soft
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.05)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        glow: '0 0 15px rgba(0, 0, 0, 0.05)',
        glowStrong: '0 0 20px rgba(0, 0, 0, 0.1)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
    },

    // Transitions
    transitions: {
        fast: '150ms ease',
        base: '200ms ease',
        medium: '300ms ease',
        slow: '500ms ease',
    },

    // Z-index Scale
    zIndex: {
        hide: -1,
        base: 0,
        dropdown: 1000,
        sticky: 1100,
        fixed: 1200,
        modal: 1300,
        popover: 1400,
        tooltip: 1500,
    },

    // Breakpoints
    breakpoints: {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },

    // Effects
    effects: {
        blur: {
            sm: 'blur(4px)',
            base: 'blur(8px)',
            md: 'blur(12px)',
            lg: 'blur(16px)',
            xl: 'blur(24px)',
        },

        gradients: {
            primary: 'linear-gradient(135deg, #f3f3f3 0%, #ffffff 100%)',
            dark: 'linear-gradient(180deg, #171717 0%, #000000 100%)',
            overlay: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 100%)',
            glow: 'radial-gradient(circle, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 70%)',
            progressBar: 'linear-gradient(90deg, #404040 0%, #171717 50%, #404040 100%)',
        },

        backdrop: {
            blur: 'blur(10px)',
            blurStrong: 'blur(20px)',
        }
    }
};

export default theme;
