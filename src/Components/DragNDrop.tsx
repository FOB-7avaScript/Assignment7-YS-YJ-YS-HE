import React, { DragEvent, useContext } from 'react';
import DragContext from 'store/drag';
import './DragNDrop.css';

interface DragNDropProps {
  itemIndex: number;
  handleTodoItems(dropIndex: number, dragIndex: number): void;
  children: React.ReactNode;
}

const DragNDrop: React.FC<DragNDropProps> = ({
  itemIndex,
  handleTodoItems,
  children
}) => {
  const {
    state: { dragging, dragItemIndex },
    actions: { setDragging, handleDragItemIndex }
  } = useContext(DragContext);
  let dragNode: EventTarget | null = null;

  const handleDragStart = (e: DragEvent<HTMLDivElement>, dragIndex: number) => {
    handleDragItemIndex(dragIndex);
    dragNode = e.target;

    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnd = () => {
    handleDragItemIndex(null);
    dragNode = null;
    setDragging(false);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    if (!dragging) {
      return;
    }

    if (e.target !== dragNode && dragItemIndex !== null) {
      handleDragItemIndex(dropIndex);
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
