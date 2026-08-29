import { useContext } from "react";

import { PrivacyContext } from "../context/PrivacyContext.js";

export function usePrivacy() {
    const context = useContext(PrivacyContext);

    if (!context) {
        throw new Error(
            "usePrivacy must be used within PrivacyProvider"
        );
    }

    return context;
}
