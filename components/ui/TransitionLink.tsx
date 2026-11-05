"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useNavigate } from "@/components/providers/TransitionProvider";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** next/link that plays the curtain transition (modifier-clicks still open new tabs). */
export function TransitionLink({ href, onClick, ...rest }: Props) {
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (rest.target && rest.target !== "_self") return;
    e.preventDefault();
    navigate(href);
  };

  return <Link href={href} onClick={handleClick} {...rest} />;
}
