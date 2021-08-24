import React, { useEffect, useState, useCallback } from 'react';
import getDataFromLocalStorage from 'Utils/GetDataFromLocalStorage';
import saveDataToLocalStorage from 'Utils/SaveDataToLocalStorage';

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

    const data = JSON.parse(getDataFromLocalStorage('data'));
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

  return (
    <div>
      {todoItems.map((item) => (
        <div key={item.id}>
          <div>{item.id}</div>
          <div>{item.taskName}</div>
          <input type="button" onClick={() => handleDeleteClick(item.id)} />
        </div>
      ))}
    </div>
  );
}
