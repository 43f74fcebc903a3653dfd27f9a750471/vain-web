import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
    theme: {
        tokens: {
            colors: {
                vain: {
                    100: { value: "#2A2A34" },
                    200: { value: "#2C282D" },
                    300: { value: "#2B2B35" },
                    400: { value: "#2A2E37" },
                    500: { value: "#2B232E" },
                    600: { value: "#2B212C" },
                    700: { value: "#6b6b6b" },
                    pink: { value: "#A08FA4" },
                    primary: { value: "#E3E3ED" },
                    border: { value: "#333339" },
                    "card-border": { value: "#3A3A42" },
                    secondary: { value: "#8A8A9A" },
                    dim: { value: "#1c1c1c" },
                    discord: { value: "#7B88E8" },
                },
            },
        },
    },
});