"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@bytesend/ui/src/button";
import { FaRegCircleDot } from "react-icons/fa6";

type LangItem = {
  key: string;
  label: string;
  kind: string;
};

export function LangToggle({
  containerId,
  languages,
  defaultLang,
}: {
  containerId: string;
  languages: LangItem[];
  defaultLang: string;
}) {
  const [active, setActive] = useState(defaultLang);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const slots = Array.from(
      container.querySelectorAll<HTMLElement>("[data-lang-slot]")
    );
    for (const el of slots) {
      const key = el.getAttribute("data-lang-slot");
      if (key === active) {
        el.classList.remove("hidden");
        el.classList.add("block");
      } else {
        el.classList.add("hidden");
        el.classList.remove("block");
      }
    }
  }, [active, containerId]);

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/30 p-1 shadow-sm">
      {languages.map((l) => (
        <Button
          key={l.key}
          size="sm"
          variant="outline"
          className={
            "h-8 rounded-full border-transparent px-3.5 text-xs font-medium transition-all " +
            (active === l.key
              ? "border-border bg-background text-foreground shadow-sm"
              : "bg-transparent text-muted-foreground hover:bg-background/70 hover:text-foreground")
          }
          aria-pressed={active === l.key}
          onClick={() => setActive(l.key)}
        >
          <span className="inline-flex items-center gap-1.5">
            <LangIcon kind={l.kind} className="h-3.5 w-3.5" /> {l.label}
          </span>
        </Button>
      ))}
    </div>
  );
}

function LangIcon({ kind, className = "h-4 w-4" }: { kind: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <FaRegCircleDot aria-hidden="true" className={className} role="img" />;
  }

  const iconMap: Record<string, { src: string; alt: string }> = {
    ts: { src: "/typescript.svg", alt: "TypeScript logo" },
    py: { src: "/python.svg", alt: "Python logo" },
    go: { src: "/go.svg", alt: "Go logo" },
    php: { src: "/php.svg", alt: "PHP logo" },
    rs: { src: "/rust.svg", alt: "Rust logo" },
    rb: { src: "/ruby.svg", alt: "Ruby logo" },
  };

  const icon = iconMap[kind];
  if (icon) {
    return (
      <Image
        src={icon.src}
        alt={icon.alt}
        width={16}
        height={16}
        className={className}
        priority={false}
        onError={() => setFailed(true)}
      />
    );
  }

  return <FaRegCircleDot aria-hidden="true" className={className} role="img" />;
}

export default LangToggle;
