import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@bytesend/ui/src/button";
import { PricingCalculator } from "~/components/marketing/PricingCalculator";
import { CallToAction } from "~/components/marketing/CallToAction";
import { ComparisonTable } from "~/components/marketing/Comparison";
import { TrustStrip } from "~/components/marketing/TrustStrip";
import { Pricing } from "~/components/marketing/PricingSection";
import { DevSection } from "~/components/marketing/DevSection";
import { Features } from "~/components/marketing/Features";
import { Hero } from "~/components/marketing/Hero";

import { env } from "~/env";

export const dynamic = "force-static";

export default function Page() {
  if (!env.NEXT_PUBLIC_IS_CLOUD) redirect("/login");

  return (
    <main className="min-h-screen text-foreground bg-background">
      <Hero />
      <TrustStrip />
      <Features />
      <DevSection />
      <Pricing />
      <ComparisonTable />
      <CallToAction />
    </main>
  );
}