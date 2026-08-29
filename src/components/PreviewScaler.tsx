"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

const PAGE_WIDTH = 794;

export default function PreviewScaler({
  children,
  zoom = 1,
}: {
  children: ReactNode;
  /** Extra user-controlled zoom multiplier on top of the auto-fit scale. */
  zoom?: number;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentHeight, setContentHeight] = useState(1123);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function recalc() {
      if (!outerRef.current) return;
      const width = outerRef.current.clientWidth;
      setContainerWidth(width);
      setFitScale(Math.min(width / PAGE_WIDTH, 1));
      if (innerRef.current) {
        setContentHeight(innerRef.current.scrollHeight);
      }
    }
    recalc();
    const ro = new ResizeObserver(recalc);
    if (outerRef.current) ro.observe(outerRef.current);
    if (innerRef.current) ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, [children]);

  const scale = fitScale * zoom;
  const scaledWidth = PAGE_WIDTH * scale;

  return (
    <div ref={outerRef} className="w-full overflow-x-auto">
      <div
        style={{
          height: contentHeight * scale,
          width: "100%",
          minWidth: scaledWidth > containerWidth ? scaledWidth : undefined,
        }}
        className="mx-auto"
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: PAGE_WIDTH,
          }}
        >
          <div ref={innerRef}>{children}</div>
        </div>
      </div>
    </div>
  );
}
