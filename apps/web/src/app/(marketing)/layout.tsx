import { SessionWrapper } from "~/components/marketing/SessionWrapper";
import { TopNav } from "~/components/marketing/TopNav";
import { SiteFooter } from "~/components/marketing/SiteFooter";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionWrapper>
      <TopNav />
      {children}
      <SiteFooter />
    </SessionWrapper>
  );
}
