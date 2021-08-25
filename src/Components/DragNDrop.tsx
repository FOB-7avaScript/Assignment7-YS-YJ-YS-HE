import React, { DragEvent, useRef } from 'react';
import './DragNDrop.css';

interface DragNDropProps {
  itemIndex: number;
  dragging: boolean;
  toggleDragging(): void;
  dragItemIndex: number;
  handleDragItem(dragIndex?: number): void;
  handleTodoItems(dropIndex: number, dragIndex: number): void;
  children: React.ReactNode;
}

const DragNDrop: React.FC<DragNDropProps> = ({
  itemIndex,
  dragging,
  toggleDragging,
  dragItemIndex,
  handleDragItem,
  handleTodoItems,
  children
}) => {
  const dragNode = useRef<EventTarget>();

  const handleDragStart = (e: DragEvent<HTMLDivElement>, dragIndex: number) => {
    handleDragItem(dragIndex);
    dragNode.current = e.target;

    setTimeout(() => {
      toggleDragging();
    }, 0);
  };

  const handleDragEnd = () => {
    handleDragItem();
    dragNode.current = undefined;
    toggleDragging();
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    if (!dragging) {
      return;
    }

    if (e.target !== dragNode.current) {
      handleTodoItems(dropIndex, dragItemIndex);
    }
  };

  const getDragItemStyle = (currentIndex: number): string | undefined => {
    if (dragging) {
      if (dragItemIndex === currentIndex) {
        return 'drag-item';
      }
    }
    return undefined;
  };

  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, itemIndex)}
      onDragEnd={handleDragEnd}
      onDragEnter={(e) => handleDragEnter(e, itemIndex)}
      className={getDragItemStyle(itemIndex)}
    >
      {children}
    </div>
  );
};

export default DragNDrop;
