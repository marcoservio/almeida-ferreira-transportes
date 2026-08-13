import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

const sizes = {
  sm: { w: 132, h: 41, className: "h-8 w-auto" },
  md: { w: 180, h: 56, className: "h-10 w-auto" },
  lg: { w: 260, h: 81, className: "h-14 w-auto" },
} as const;

export function Logo({
  size = "md",
  href = "/",
  priority = false,
  className,
}: {
  size?: keyof typeof sizes;
  /** Passe `null` para renderizar sem link (ex.: dentro de outro link). */
  href?: string | null;
  priority?: boolean;
  className?: string;
}) {
  const s = sizes[size];

  const image = (
    <Image
      src="/logo-almeida-ferreira.png"
      alt={siteConfig.name}
      width={s.w}
      height={s.h}
      priority={priority}
      className={cn(s.className, className)}
    />
  );

  if (href === null) return image;

  return (
    <Link href={href} aria-label={`${siteConfig.name} — página inicial`}>
      {image}
    </Link>
  );
}
