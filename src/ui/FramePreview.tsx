import type { ReactNode } from "react";
import type { FrameId, ProtectionId } from "@/domain/types";

export function FramePreview({
  title,
  innerW,
  innerH,
  matCm,
  frameId,
  protection,
  pxPerCm,
  plaque = true,
  children,
}: {
  title: string;
  innerW: number;
  innerH: number;
  matCm: number;
  frameId: FrameId;
  protection: ProtectionId;
  pxPerCm: number;
  plaque?: boolean;
  children: ReactNode;
}) {
  const lip = Math.max(10, 2.05 * pxPerCm);
  const mat = matCm * pxPerCm;
  const width = innerW * pxPerCm + mat * 2 + lip * 2;
  return (
    <figure className="frame-figure" style={{ width }}>
      <div className="frame" data-frame={frameId} data-protection={protection} style={{ padding: lip }}>
        <div className="mat" style={{ padding: mat }}>
          <div className="art-window" style={{ width: innerW * pxPerCm, height: innerH * pxPerCm }}>
            {children}
            <span className="glaze" aria-hidden="true" />
          </div>
        </div>
      </div>
      {plaque ? (
        <figcaption className="plaque">
          <span>{title}</span>
          <small>
            {innerW}×{innerH} cm
          </small>
        </figcaption>
      ) : null}
    </figure>
  );
}
