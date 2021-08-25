import { useEffect, useState, useCallback, DragEvent, useRef } from 'react';
import getDataFromLocalStorage from 'Utils/GetDataFromLocalStorage';
import saveDataToLocalStorage from 'Utils/SaveDataToLocalStorage';
import './Delete.css';

export type Itodo = {
  id: number;
  taskName: string;
  isComplete: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  dueDateRange: string[];
  importance: string;
};

const initialTodos: Itodo[] = [];

export default function Delete() {
  const [todoItems, setTodoItems] = useState(initialTodos);
  const [dragging, setDragging] = useState(false);
  const dragItem = useRef<number>();
  const dragNode = useRef<EventTarget>();

  useEffect((): void => {
    fetch('/Data/Data.json')
      .then((res) => res.json())
      .then((data) => saveDataToLocalStorage('data', data));

    const data = getDataFromLocalStorage('data');
    setTodoItems(data);
  }, []);

  const handleDeleteClick = (id: number) => {
    setTodoItems((prev) => prev.filter((item) => item.id !== id));
  };

  const saveData = useCallback(() => {
    saveDataToLocalStorage('data', todoItems);
  }, [todoItems]);

  useEffect(() => {
    saveData();
  }, [saveData]);

  /* ---- Drag & Drop --- */
  const handleTodoItems = (dropIndex: number, dragIndex: number) => {
    setTodoItems((prevTodoItems) => {
      const newTodoItems = [...prevTodoItems];
      const [currentItem] = newTodoItems.splice(dragIndex, 1);
      newTodoItems.splice(dropIndex, 0, currentItem);
      dragItem.current = dropIndex;
      return newTodoItems;
    });
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, dragIndex: number) => {
    dragItem.current = dragIndex;
    dragNode.current = e.target;

    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnd = () => {
    dragItem.current = undefined;
    dragNode.current = undefined;
    setDragging(false);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    if (!dragging) {
      return;
    }
    const dragIndex = dragItem.current!;
    if (e.target !== dragNode.current) {
      console.log(dropIndex, dragIndex);
      handleTodoItems(dropIndex, dragIndex);
    }
  };

  const getDragItemStyle = (currentIndex: number): string | undefined => {
    if (dragging) {
      const dragIndex = dragItem.current!;
      if (dragIndex === currentIndex) {
        return 'drag-item';
      }
    }
    return undefined;
  };

  return (
    <ul style={{ padding: '40px' }}>
      {todoItems.map(({ id, taskName }, index) => (
        <div
          key={id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnd={handleDragEnd}
          onDragEnter={(e) => handleDragEnter(e, index)}
          className={getDragItemStyle(index)}
        >
          <li className="todo-item">
            <div>{id}</div>
            <div>{taskName}</div>
            <input type="button" onClick={() => handleDeleteClick(id)} />
          </li>
        </div>
      ))}
    </ul>
  );
}
