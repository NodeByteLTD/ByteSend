import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service – ByteSend",
  description: "Terms governing use of ByteSend, operated by NodeByte LTD.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-sidebar-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight mb-6">
          Terms of Service
        </h1>
        <p className="text-muted-foreground mb-6">
          These Terms of Service (&quot;Terms&quot;) govern your access to and
          use of bytesend.cloud and the ByteSend application, operated by
          NodeByte LTD. By accessing or using our platform, you agree to be
          bound by these Terms.
        </p>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-medium">Eligibility &amp; Accounts</h2>
          <p className="text-muted-foreground">
            You may use the platform only if you can form a binding contract
            with NodeByte LTD and are not barred from doing so under any
            applicable laws. You are responsible for maintaining the security of
            your account credentials and for all activity under your account.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-medium">Acceptable Use</h2>
          <p className="text-muted-foreground">
            You agree not to misuse the platform. Prohibited conduct includes,
            without limitation:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Violating any applicable laws or regulations.</li>
            <li>Infringing the rights of others or violating their privacy.</li>
            <li>Attempting to interfere with or disrupt the services.</li>
            <li>
              Uploading or transmitting malicious code, spam, or prohibited
              content.
            </li>
          </ul>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-medium">Anti-Spam Enforcement</h2>
          <p className="text-muted-foreground">
            To protect our community and deliverability, we may suspend or block
            access for any user who sends unsolicited marketing emails or
            similar promotional messages. Enforcement actions may include
            immediate account suspension or termination.
          </p>
          <p className="text-muted-foreground">
            Marketing communications sent via ByteSend must employ double
            opt-in verification. Accounts that bypass double opt-in or misuse
            our transactional mail API for promotional campaigns may be
            suspended or terminated without notice.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-medium">Intellectual Property</h2>
          <p className="text-muted-foreground">
            Content on the platform, including trademarks, logos, text, and
            graphics, is owned by or licensed to NodeByte LTD and protected by
            intellectual property laws. You may not use our marks without our
            prior written permission.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-medium">Third-Party Links</h2>
          <p className="text-muted-foreground">
            The platform may contain links to third-party websites or services
            we do not control. We are not responsible for their content or
            practices.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-medium">Disclaimer</h2>
          <p className="text-muted-foreground">
            The platform is provided on an &quot;as is&quot; and &quot;as
            available&quot; basis without warranties of any kind, express or
            implied.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-medium">Limitation of Liability</h2>
          <p className="text-muted-foreground">
            To the fullest extent permitted by law, NodeByte LTD shall not be
            liable for any indirect, incidental, special, consequential or
            punitive damages, or any loss of profits or revenues.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-medium">Indemnification</h2>
          <p className="text-muted-foreground">
            You agree to indemnify and hold harmless NodeByte LTD from any
            claims, damages, liabilities, and expenses arising out of your use
            of the platform or your violation of these Terms.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-medium">Changes &amp; Availability</h2>
          <p className="text-muted-foreground">
            We may modify these Terms and update the platform at any time.
            Changes are effective when posted. We may suspend or discontinue the
            platform in whole or in part.
          </p>
        </section>

        <section className="space-y-3 mb-8">
          <h2 className="text-xl font-medium">Governing Law</h2>
          <p className="text-muted-foreground">
            These Terms are governed by applicable laws without regard to
            conflict-of-law principles.
          </p>
        </section>

        <section className="space-y-3 mb-10">
          <h2 className="text-xl font-medium">Contact</h2>
          <p className="text-muted-foreground">
            Questions about these Terms? Contact us at{" "}
            <a
              href="mailto:hey@nodebyte.co.uk"
              className="underline decoration-dotted"
            >
              hey@nodebyte.co.uk
            </a>
            .
          </p>
        </section>

        <p className="text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </main>
  );
}
