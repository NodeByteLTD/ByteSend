import { useTheme } from "@bytesend/ui";
import Image from "next/image";

export const FullScreenLoading = () => {
  const { resolvedTheme } = useTheme();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 animate-pulse">
        <Image
          src={"/logo-squircle.png"}
          alt="ByteSend"
          width={36}
          height={36}
          className="mx-auto rounded-lg"
        />
      </div>
      <p className="text-xs text-muted-foreground/60">Loading...</p>
    </div>
  );
};
