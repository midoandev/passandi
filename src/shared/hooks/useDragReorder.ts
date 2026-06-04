import { useRef, useState } from "react";
const ITEM_HEIGHT = 66; // tinggi tiap row + gap

type Item = { id: string;[key: string]: any };

export function useDragReorder<T extends Item>(
  items: T[],
  onReorder: (newOrder: T[]) => void,
) {
  const [data, setData] = useState<T[]>(items);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const positions = useRef<Record<string, number>>({});
  const currentOrder = useRef<T[]>(items);

  // Sync saat items dari luar berubah
  if (JSON.stringify(items.map(i => i.id)) !==
    JSON.stringify(currentOrder.current.map(i => i.id))) {
    currentOrder.current = items;
    setData(items);
  }

  const getPosition = (index: number) => index * ITEM_HEIGHT;

  const updateOrder = (fromId: string, toIndex: number) => {
    const current = [...currentOrder.current];
    const fromIndex = current.findIndex((i) => i.id === fromId);
    if (fromIndex === -1 || fromIndex === toIndex) return;

    const moved = current.splice(fromIndex, 1)[0];
    current.splice(toIndex, 0, moved);
    currentOrder.current = current;
    setData([...current]);
    onReorder(current);
  };

  return {
    data,
    draggingId,
    setDraggingId,
    getPosition,
    updateOrder,
    ITEM_HEIGHT,
  };
}