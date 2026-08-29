import { useState } from "react";

import { PrivacyContext } from "./PrivacyContext.js";

const STORAGE_KEY = "financial-tracker-hide-amounts";

export function PrivacyProvider({ children }) {
    const [hidden, setHidden] = useState(() => {
        return (
            localStorage.getItem(STORAGE_KEY) === "true"
        );
    });

    function toggleHidden() {
        setHidden((current) => {
            const next = !current;

            localStorage.setItem(
                STORAGE_KEY,
                String(next)
            );

            return next;
        });
    }

    return (
        <PrivacyContext.Provider
            value={{ hidden, toggleHidden }}
        >
            {children}
        </PrivacyContext.Provider>
    );
}
