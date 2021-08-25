import { useEffect, useState, useCallback } from 'react';
import { DragProvider } from 'store/drag';
import getDataFromLocalStorage from 'Utils/GetDataFromLocalStorage';
import saveDataToLocalStorage from 'Utils/SaveDataToLocalStorage';
import DragNDrop from 'Components/DragNDrop';
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

  const handleTodoItems = (dropIndex: number, dragIndex: number) => {
    setTodoItems((prevTodoItems) => {
      const newTodoItems = [...prevTodoItems];
      const [currentItem] = newTodoItems.splice(dragIndex, 1);
      newTodoItems.splice(dropIndex, 0, currentItem);
      return newTodoItems;
    });
  };

  return (
    <DragProvider>
      <ul style={{ padding: '40px' }}>
        {todoItems.map(({ id, taskName }, index) => (
          <DragNDrop
            key={id}
            itemIndex={index}
            handleTodoItems={handleTodoItems}
          >
            <li className="todo-item">
              <div>{id}</div>
              <div>{taskName}</div>
              <input type="button" onClick={() => handleDeleteClick(id)} />
            </li>
          </DragNDrop>
        ))}
      </ul>
    </DragProvider>
  );
}
