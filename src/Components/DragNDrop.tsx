import React, { DragEvent, useContext } from 'react';
import styled from '@emotion/styled';
import DragContext from 'store/drag';

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

  const getDragItemStyle = (currentIndex: number): boolean => {
    if (dragItemIndex === currentIndex) {
      return true;
    }
    return false;
  };

  return (
    <DragItem
      draggable
      onDragStart={(e) => handleDragStart(e, itemIndex)}
      onDragEnd={handleDragEnd}
      onDragEnter={(e) => handleDragEnter(e, itemIndex)}
      dragging={dragging && getDragItemStyle(itemIndex)}
    >
      {children}
    </DragItem>
  );
};

export default DragNDrop;

const DragItem = styled.div<{ dragging: boolean }>`
  ${({ dragging }) =>
    dragging &&
    `
    margin-bottom: 15px;
    border: 2px dashed #0099fd;
    & > * {
      opacity: 0;
      pointer-events: none;
      margin: 0;
    }
  `}
`;
