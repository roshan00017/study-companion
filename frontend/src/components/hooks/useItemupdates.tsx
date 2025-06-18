import { useEffect } from "react";

type ItemType = "note" | "task" | "flashcard";

export const useItemUpdates = (
  itemType: ItemType,
  onItemCreated: (item: any) => void
) => {
  useEffect(() => {
    const handleItemCreated = (event: CustomEvent) => {
      onItemCreated(event.detail);
    };

    window.addEventListener(
      `${itemType}Created`,
      handleItemCreated as EventListener
    );

    return () => {
      window.removeEventListener(
        `${itemType}Created`,
        handleItemCreated as EventListener
      );
    };
  }, [itemType, onItemCreated]);
};
