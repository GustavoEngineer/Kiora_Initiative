/**
 * Kiora Initiative - Theme Configuration
 * Inspired by tactical/military game aesthetics
 */

export const theme = {
    // Color Palette
    colors: {
        // Primary Colors - Cyan/Blue accents
        primary: {
            main: '#00D9FF',        // Vibrant cyan blue (main accent)
            light: '#5CE1FF',       // Light cyan
            dark: '#00A8CC',        // Dark cyan
            glow: '#33E0FF',        // Cyan glow effect
        },

        // Secondary Colors - Blue highlights
        secondary: {
            main: '#0099FF',        // Bright blue
            light: '#66BBFF',       // Light blue
            dark: '#0077CC',        // Dark blue
        },

        // Background Colors - Dark theme
        background: {
            primary: '#0A0A0A',     // Nearly black background
            secondary: '#1A1A1A',   // Lighter black for panels
            tertiary: '#252525',    // Card backgrounds
            overlay: 'rgba(0, 0, 0, 0.85)', // Modal/overlay background
            glass: 'rgba(26, 26, 26, 0.7)',  // Glassmorphism effect
        },

        // Text Colors
        text: {
            primary: '#FFFFFF',     // White - main text
            secondary: '#B0B0B0',   // Light gray - secondary text
            tertiary: '#808080',    // Medium gray - tertiary/disabled text
            accent: '#00D9FF',      // Orange - highlighted text
            muted: '#606060',       // Dark gray - muted text
        },

        // Border Colors
        border: {
            primary: '#00D9FF',     // Orange borders for highlighted elements
            secondary: '#404040',   // Gray borders for standard elements
            subtle: '#2A2A2A',      // Very subtle borders
            glow: 'rgba(0, 217, 255, 0.5)', // Orange glow for borders
        },

        // Status Colors
        status: {
            success: '#4CAF50',     // Green
            warning: '#FFC107',     // Yellow/Orange
            error: '#F44336',       // Red
            info: '#2196F3',        // Blue
        },

        // UI Elements
        ui: {
            buttonPrimary: '#00D9FF',
            buttonSecondary: '#2A2A2A',
            buttonHover: '#5CE1FF',
            inputBg: '#1A1A1A',
            inputBorder: '#404040',
            inputFocus: '#00D9FF',
            progressBar: '#00D9FF',
            progressBg: '#2A2A2A',
        }
    },

    // Typography
    typography: {
        fontFamily: {
            primary: "'Rajdhani', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            secondary: "'Orbitron', 'Roboto Mono', monospace",
            mono: "'JetBrains Mono', 'Courier New', monospace",
        },

        fontSize: {
            xs: '0.75rem',      // 12px
            sm: '0.875rem',     // 14px
            base: '1rem',       // 16px
            lg: '1.125rem',     // 18px
            xl: '1.25rem',      // 20px
            '2xl': '1.5rem',    // 24px
            '3xl': '1.875rem',  // 30px
            '4xl': '2.25rem',   // 36px
            '5xl': '3rem',      // 48px
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
            wide: '0.05em',
            wider: '0.1em',
        }
    },

    // Spacing Scale
    spacing: {
        0: '0',
        1: '0.25rem',   // 4px
        2: '0.5rem',    // 8px
        3: '0.75rem',   // 12px
        4: '1rem',      // 16px
        5: '1.25rem',   // 20px
        6: '1.5rem',    // 24px
        8: '2rem',      // 32px
        10: '2.5rem',   // 40px
        12: '3rem',     // 48px
        16: '4rem',     // 64px
        20: '5rem',     // 80px
        24: '6rem',     // 96px
    },

    // Border Radius
    borderRadius: {
        none: '0',
        sm: '0.125rem',   // 2px
        base: '0.25rem',  // 4px
        md: '0.375rem',   // 6px
        lg: '0.5rem',     // 8px
        xl: '0.75rem',    // 12px
        '2xl': '1rem',    // 16px
        full: '9999px',   // Fully rounded
    },

    // Shadows
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
        base: '0 1px 3px 0 rgba(0, 0, 0, 0.7), 0 1px 2px 0 rgba(0, 0, 0, 0.6)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.8), 0 2px 4px -1px rgba(0, 0, 0, 0.6)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.9), 0 4px 6px -2px rgba(0, 0, 0, 0.7)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.9), 0 10px 10px -5px rgba(0, 0, 0, 0.8)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.95)',
        glow: '0 0 20px rgba(0, 217, 255, 0.4)',
        glowStrong: '0 0 30px rgba(0, 217, 255, 0.6)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.6)',
    },

    // Transitions
    transitions: {
        fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
        base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
        medium: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
        slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
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

    // Breakpoints (for responsive design)
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
            primary: 'linear-gradient(135deg, #00D9FF 0%, #0099FF 100%)',
            dark: 'linear-gradient(180deg, #1A1A1A 0%, #0A0A0A 100%)',
            overlay: 'linear-gradient(180deg, rgba(10, 10, 10, 0) 0%, rgba(10, 10, 10, 0.9) 100%)',
            glow: 'radial-gradient(circle, rgba(0, 217, 255, 0.2) 0%, rgba(0, 217, 255, 0) 70%)',
            progressBar: 'linear-gradient(90deg, #00A8CC 0%, #00D9FF 50%, #5CE1FF 100%)',
        },

        backdrop: {
            blur: 'blur(10px)',
            blurStrong: 'blur(20px)',
        }
    }
};

export default theme;
