import { useCallback, useRef, useState } from 'react';
import type { PointerEvent, TouchEvent, WheelEvent } from 'react';
import type { ProgressionPoint, ProgressionTreeViewportState } from './types';

const DEFAULT_INITIAL_PAN: ProgressionPoint = { x: 0, y: 0 };

export type UseProgressionTreeViewportOptions = {
  minZoom: number;
  maxZoom: number;
  initialPan?: ProgressionPoint;
  initialZoom?: number;
  editorPanelSelector?: string;
};

export function useProgressionTreeViewport({
  minZoom,
  maxZoom,
  initialPan,
  initialZoom = 1,
  editorPanelSelector,
}: UseProgressionTreeViewportOptions): ProgressionTreeViewportState {
  const resolvedInitialPan = initialPan ?? DEFAULT_INITIAL_PAN;
  const [pan, setPan] = useState(resolvedInitialPan);
  const [zoom, setZoom] = useState(initialZoom);
  const isPanning = useRef(false);
  const hasDragged = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const touchStart = useRef<{ x: number; y: number; dist?: number }>({ x: 0, y: 0 });

  const clampZoom = useCallback((value: number) => Math.max(minZoom, Math.min(maxZoom, value)), [maxZoom, minZoom]);

  const movePointer = useCallback((clientX: number, clientY: number) => {
    if (!isPanning.current) return;
    const dx = clientX - lastPointer.current.x;
    const dy = clientY - lastPointer.current.y;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      hasDragged.current = true;
    }
    lastPointer.current = { x: clientX, y: clientY };
    setPan((current) => ({ x: current.x + dx, y: current.y + dy }));
  }, []);

  const endPointer = useCallback(() => {
    isPanning.current = false;
  }, []);

  const reset = useCallback((nextPan: ProgressionPoint = resolvedInitialPan, nextZoom: number = initialZoom) => {
    setPan(nextPan);
    setZoom(clampZoom(nextZoom));
    isPanning.current = false;
    hasDragged.current = false;
    touchStart.current.dist = undefined;
  }, [clampZoom, initialZoom, resolvedInitialPan]);

  const onPointerDown = useCallback((event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    if (editorPanelSelector && (event.target as HTMLElement).closest(editorPanelSelector)) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    isPanning.current = true;
    hasDragged.current = false;
    lastPointer.current = { x: event.clientX, y: event.clientY };
  }, [editorPanelSelector]);

  const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    movePointer(event.clientX, event.clientY);
  }, [movePointer]);

  const onPointerUp = useCallback((event: PointerEvent<HTMLElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    endPointer();
  }, [endPointer]);

  const onWheel = useCallback((event: WheelEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const delta = -event.deltaY * 0.001;
    setZoom((current) => clampZoom(current + delta));
  }, [clampZoom]);

  const onTouchStart = useCallback((event: TouchEvent<HTMLElement>) => {
    if (event.touches.length === 1) {
      isPanning.current = true;
      hasDragged.current = false;
      touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      lastPointer.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    } else if (event.touches.length === 2) {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      touchStart.current.dist = Math.sqrt(dx * dx + dy * dy);
    }
  }, []);

  const onTouchMove = useCallback((event: TouchEvent<HTMLElement>) => {
    if (event.touches.length === 1 && isPanning.current) {
      movePointer(event.touches[0].clientX, event.touches[0].clientY);
    } else if (event.touches.length === 2 && touchStart.current.dist) {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const scale = dist / touchStart.current.dist;
      touchStart.current.dist = dist;
      setZoom((current) => clampZoom(current * scale));
    }
  }, [clampZoom, movePointer]);

  const onTouchEnd = useCallback(() => {
    isPanning.current = false;
    touchStart.current.dist = undefined;
  }, []);

  return {
    pan,
    setPan,
    zoom,
    setZoom,
    isPanning,
    hasDragged,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onWheel,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
    reset,
  };
}
