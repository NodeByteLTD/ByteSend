import { unsubscribeContactFromLink } from "~/server/service/campaign-service";
import ReSubscribe from "./re-subscribe";

export const dynamic = "force-dynamic";

async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const id = params.id as string;
  const hash = params.hash as string;

  if (!id || !hash) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full space-y-4 p-8 rounded-2xl border border-border/40 bg-card/80">
          <h2 className="text-center text-2xl font-semibold">
            Unsubscribe
          </h2>
          <p className="text-center text-sm text-muted-foreground">
            Invalid unsubscribe link. Please check your URL and try again.
          </p>
        </div>
      </div>
    );
  }

  const contact = await unsubscribeContactFromLink(id, hash);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <ReSubscribe id={id} hash={hash} contact={contact} />

      <div className="fixed bottom-10 p-4">
        <p className="text-sm text-muted-foreground">
          Powered by{" "}
          <a href="https://bytesend.cloud" className="font-semibold text-primary hover:underline" target="_blank">
            ByteSend
          </a>
        </p>
      </div>
    </div>
  );
}

export default UnsubscribePage;
