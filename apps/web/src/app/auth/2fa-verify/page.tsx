import { Suspense } from "react";
import { TwoFactorVerifyContent } from "./content";

export default function TwoFactorVerifyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center" />}>
            <TwoFactorVerifyContent />
        </Suspense>
    );
}
