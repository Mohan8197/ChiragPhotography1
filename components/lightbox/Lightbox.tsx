"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import type { LightboxItem } from "@/data/types";
import { gsap, useGSAP } from "@/lib/animations/gsap";
import { startScroll, stopScroll } from "@/lib/scroll";
import { pad, prefersReducedMotion } from "@/lib/utils";

interface Props {
  items: LightboxItem[];
  startIndex: number;
  onClose: () => void;
}

export default function Lightbox({ items, startIndex, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(startIndex);
  const direction = useRef<1 | -1>(1);
  const closing = useRef(false);
  const swipeStart = useRef<number | null>(null);
  const total = items.length;
  const item = items[index];

  const go = useCallback(
    (dir: 1 | -1) => {
      direction.current = dir;
      setIndex((i) => (i + dir + total) % total);
    },
    [total],
  );

  const close = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || closing.current) return;
    closing.current = true;
    const finish = () => {
      dialog.close();
      onClose();
    };
    if (prefersReducedMotion()) return finish();
    gsap.to(dialog, { clipPath: "inset(50% 0% 50% 0%)", duration: 0.7, ease: "expo.inOut", onComplete: finish });
  }, [onClose]);

  // Open
  useGSAP(() => {
    const dialog = dialogRef.current!;
    dialog.showModal();
    stopScroll();
    if (!prefersReducedMotion()) {
      gsap.fromTo(
        dialog,
        { clipPath: "inset(50% 0% 50% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut" },
      );
    }
    return () => startScroll();
  });

  // Each new frame slides in from the direction of travel
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-current]",
        { opacity: 0, x: direction.current * 48 },
        { opacity: 1, x: 0, duration: 0.9, ease: "expo.out" },
      );
    },
    { dependencies: [index], scope: stageRef },
  );

  // Arrow keys (Escape is handled by the dialog's cancel event)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const onPointerDown = (e: PointerEvent) => {
    swipeStart.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  const neighbours = total > 1 ? [items[(index + 1) % total], items[(index - 1 + total) % total]] : [];

  return (
    <dialog
      ref={dialogRef}
      aria-label="Image viewer"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-charcoal p-0 text-paper backdrop:bg-transparent"
    >
      <div className="flex h-full flex-col">
        <div className="container-x flex items-center justify-between py-5 md:py-6">
          <p className="label tabular-nums" aria-live="polite">
            {pad(index + 1)} / {pad(total)}
          </p>
          <p className="hidden font-serif text-xl italic md:block">{item.title}</p>
          <button type="button" onClick={close} className="label u-link" autoFocus>
            Close
          </button>
        </div>

        <div
          ref={stageRef}
          className="relative flex-1 touch-pan-y select-none"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipeStart.current = null)}
        >
          <div data-current key={item.photo.id} className="absolute inset-x-4 inset-y-0 md:inset-x-24">
            <Image
              src={item.photo.src}
              alt={item.photo.alt}
              fill
              sizes="(min-width: 768px) 85vw, 100vw"
              placeholder={item.photo.blurDataURL ?? "empty"}
              className="object-contain"
              loading="eager"
            />
          </div>
          {neighbours.map((n) => (
            <Image
              key={`pre-${n.photo.id}`}
              src={n.photo.src}
              alt=""
              width={n.photo.width}
              height={n.photo.height}
              sizes="(min-width: 768px) 85vw, 100vw"
              loading="eager"
              className="hidden"
            />
          ))}

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous image"
                className="label absolute inset-y-0 left-0 hidden w-24 items-center justify-center md:flex"
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next image"
                className="label absolute inset-y-0 right-0 hidden w-24 items-center justify-center md:flex"
              >
                <span aria-hidden="true">→</span>
              </button>
            </>
          )}
        </div>

        <div className="container-x flex items-center justify-between gap-6 py-5 md:py-6">
          <p className="text-sm text-stone">{item.meta}</p>
          {total > 1 && (
            <div className="flex gap-6 md:hidden">
              <button type="button" onClick={() => go(-1)} className="label" aria-label="Previous image">
                Previous
              </button>
              <button type="button" onClick={() => go(1)} className="label" aria-label="Next image">
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
