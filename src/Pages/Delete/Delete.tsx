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

  const findTodoItems = (id: number): number =>
    todoItems.findIndex((todoItem) => todoItem.id === id);

  const handleTodoItems = (targetId: number, currentId: number) => {
    setTodoItems((prevTodoItems) => {
      const targetIndex = findTodoItems(targetId);
      const currentIndex = findTodoItems(currentId);

      const newTodoItems = [...prevTodoItems];
      newTodoItems.splice(
        targetIndex,
        0,
        newTodoItems.splice(currentIndex, 1)[0]
      );

      return newTodoItems;
    });
  };

  /* ---- Drag & Drop --- */
  const handleDragStart = (e: DragEvent<HTMLDivElement>, id: number) => {
    dragItem.current = id;
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

  const handleDragEnter = (e: DragEvent<HTMLDivElement>, targetId: number) => {
    if (!dragging) {
      return;
    }
    const currentId = dragItem.current!;
    if (e.target !== dragNode.current) {
      handleTodoItems(targetId, currentId);
    }
  };

  const getDragItemStyle = (id: number): string | undefined => {
    if (dragging) {
      const currentId = dragItem.current!;
      if (currentId === id) {
        return 'drag-item';
      }
    }
    return undefined;
  };

  return (
    <ul style={{ padding: '40px' }}>
      {todoItems.map(({ id, taskName }) => (
        <div
          key={id}
          draggable
          onDragStart={(e) => handleDragStart(e, id)}
          onDragEnd={handleDragEnd}
          onDragEnter={(e) => handleDragEnter(e, id)}
          className={getDragItemStyle(id)}
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
