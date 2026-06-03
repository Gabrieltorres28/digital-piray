"use client";

import { useEffect, useMemo, useState } from "react";

type TypewriterDialogProps = {
  messages: string[];
  speed?: number;
};

export function TypewriterDialog({ messages, speed = 28 }: TypewriterDialogProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [visibleChars, setVisibleChars] = useState(0);
  const currentMessage = messages[messageIndex] ?? "";
  const isComplete = visibleChars >= currentMessage.length;
  const hasNext = messageIndex < messages.length - 1;

  useEffect(() => {
    setVisibleChars(0);
  }, [messageIndex]);

  useEffect(() => {
    if (isComplete) {
      return;
    }

    const timer = window.setTimeout(() => {
      setVisibleChars((value) => Math.min(value + 1, currentMessage.length));
    }, speed);

    return () => window.clearTimeout(timer);
  }, [currentMessage.length, isComplete, speed, visibleChars]);

  const visibleText = useMemo(() => currentMessage.slice(0, visibleChars), [currentMessage, visibleChars]);

  function handleAdvance() {
    if (!isComplete) {
      setVisibleChars(currentMessage.length);
      return;
    }

    if (hasNext) {
      setMessageIndex((value) => value + 1);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAdvance}
      className="w-full touch-manipulation rounded-md border-2 border-white/80 bg-[#101418]/92 p-3 text-left text-white shadow-[0_18px_48px_rgba(0,0,0,0.55)] outline outline-1 outline-black/70 backdrop-blur transition hover:bg-[#141a1f]/95 focus:outline-none focus:ring-2 focus:ring-cyan-100/80 sm:p-4"
      aria-label="Cuadro de diálogo narrativo"
    >
      <p className="min-h-[4.8rem] text-[15px] font-semibold leading-6 text-white sm:min-h-[4rem] sm:text-lg sm:leading-7">
        {visibleText}
        {!isComplete ? <span className="typewriter-caret" aria-hidden="true"> </span> : null}
      </p>
      <div className="mt-2 flex items-center justify-between gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-100/80">
        <span>{messageIndex + 1}/{messages.length}</span>
        <span>{isComplete ? (hasNext ? "Tocar para continuar" : "Historia completa") : "Tocar para completar"}</span>
      </div>
    </button>
  );
}
