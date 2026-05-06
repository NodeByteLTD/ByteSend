import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { env } from "~/env";

export const metadata: Metadata = {
  title: "Privacy Policy – ByteSend",
  description: "Privacy policy for ByteSend, operated by NodeByte LTD.",
};

export default function PrivacyPage() {
  if (!env.NEXT_PUBLIC_IS_CLOUD) notFound();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-wider text-primary mb-3">Legal</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            This Privacy Policy explains how NodeByte LTD (&quot;we&quot;,
            &quot;us&quot;) collects, uses, and shares information when you visit
            or interact with bytesend.cloud and the ByteSend application (bytesend.cloud).
          </p>
        </div>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-medium">Who We Are</h2>
          <p className="text-muted-foreground">
            NodeByte LTD operates bytesend.cloud. The application is hosted
            in-house on infrastructure provided by NodeByte Hosting. If you have questions about this policy or your data,
            contact us at{" "}
            <a href="mailto:hey@nodebyte.co.uk" className="underline decoration-dotted">
              hey@nodebyte.co.uk
            </a>
            .
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-medium">What We Collect</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <span className="text-foreground">Usage and device data:</span> We
              use Simple Analytics to understand overall traffic and usage
              patterns. Simple Analytics is privacy-friendly and does not use
              cookies for tracking.
            </li>
            <li>
              <span className="text-foreground">Server and security logs:</span>{" "}
              Our hosting provider (NodeByte Hosting) may process IP addresses and basic
              request metadata transiently for security and debugging.
            </li>
            <li>
              <span className="text-foreground">Account data:</span> If you sign
              up for ByteSend, we process your account information (name, email,
              OAuth identity) and send transactional account emails.
            </li>
          </ul>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-medium">How We Use Information</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Operate, secure, and maintain the platform.</li>
            <li>Understand aggregated usage to improve the product.</li>
            <li>Deliver transactional emails related to your account.</li>
            <li>Comply with legal obligations and enforce our terms.</li>
          </ul>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-medium">Legal Bases</h2>
          <p className="text-muted-foreground">
            Where applicable (e.g. in the EEA/UK), we rely on legitimate
            interests to operate and secure our services and to measure
            aggregated usage, and on contract performance where relevant.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-medium">Sharing and Processors</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <span className="text-foreground">Hosting:</span> NodeByte Hosting (a division of NodeByte LTD) for
              serving content, networking, and security.
            </li>
            <li>
              <span className="text-foreground">Analytics:</span> Simple
              Analytics for aggregated, privacy-friendly usage metrics.
            </li>
            <li>
              <span className="text-foreground">Email delivery:</span> Amazon
              SES for transactional account emails.
            </li>
          </ul>
          <p className="text-muted-foreground">
            We do not sell your personal information.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-medium">Retention</h2>
          <p className="text-muted-foreground">
            We retain information only for as long as necessary to fulfill the
            purposes described in this policy, including security and legal
            compliance.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-medium">International Transfers</h2>
          <p className="text-muted-foreground">
            Our providers may process data in locations outside your country of
            residence. Where required, we implement appropriate safeguards.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-medium">Your Rights</h2>
          <p className="text-muted-foreground">
            Depending on your location, you may have rights to access, correct,
            delete, or export your information. To exercise these rights,
            contact us at{" "}
            <a href="mailto:hey@nodebyte.co.uk" className="underline decoration-dotted">
              hey@nodebyte.co.uk
            </a>
            .
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-medium">Children</h2>
          <p className="text-muted-foreground">
            Our services are not directed to children, and we do not knowingly
            collect personal information from children.
          </p>
        </section>

        <section className="space-y-3 mb-10">
          <h2 className="text-xl font-medium">Changes</h2>
          <p className="text-muted-foreground">
            We may update this policy from time to time. The &quot;Last
            updated&quot; date below reflects the most recent changes.
          </p>
        </section>

        <p className="text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </main>
  );
}
