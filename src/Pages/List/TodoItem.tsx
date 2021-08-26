/* eslint-disable no-nested-ternary */
import { useEffect, useState, useCallback, useRef } from 'react';
import styled from '@emotion/styled';
import { Itodo } from 'Pages/Delete/Delete';
import saveDataToLocalStorage from 'Utils/SaveDataToLocalStorage';

interface TodoItemProps {
  data: Itodo;
  wholeData: Itodo[];
  handleTodoItems: (newTodoItems: Itodo[]) => void;
}

function TodoItem({ data, wholeData, handleTodoItems }: TodoItemProps) {
  const [taskNameEditMode, setTaskNameEditMode] = useState<boolean>(false);
  const inputEl = useRef<HTMLInputElement>(null);

  const todoItemsStateEdit = (
    id: number,
    element: string,
    content: string | number
  ) => {
    const editedData = wholeData.map((item) =>
      item.id === id ? { ...item, [element]: content } : item
    );
    handleTodoItems(editedData);
    saveDataToLocalStorage('data', editedData);
  };

  const handleDelete = (id: number) => {
    const leftData = wholeData.filter((item) => item.id !== id);
    handleTodoItems(leftData);
  };

  const handleTaskNameEdit = (id: number) => {
    const newTaskName = inputEl.current?.value || '';
    if (newTaskName.length > 0) todoItemsStateEdit(id, 'taskName', newTaskName);
    setTaskNameEditMode(false);
  };

  const handleEnterPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number
  ) => {
    if (e.key === 'Enter') {
      handleTaskNameEdit(id);
    }
  };

  const handleStatusEditClick = (id: number) => {
    statusEdit(id, data);
  };

  const statusEdit = (id: number, currentStatus: Itodo) => {
    if (currentStatus.status === '완료') {
      todoItemsStateEdit(id, 'status', '시작 안함');
    } else if (currentStatus.status === '시작 안함') {
      todoItemsStateEdit(id, 'status', '진행중');
    } else {
      todoItemsStateEdit(id, 'status', '완료');
    }
  };

  const handleImportanceEditClick = (id: number) => {
    if (data.importance === '1') {
      todoItemsStateEdit(id, 'importance', '2');
    } else if (data.importance === '2') {
      todoItemsStateEdit(id, 'importance', '3');
    } else {
      todoItemsStateEdit(id, 'importance', '1');
    }
  };

  const saveData = () => {
    saveDataToLocalStorage('data', wholeData);
  };
  // const saveData = useCallback(() => {
  //   saveDataToLocalStorage('data', wholeData);
  // }, [wholeData]);

  // useEffect(() => {
  //   saveData();
  // }, [saveData]);

  return (
    <TodoItemDiv>
      <TodoItemInfoDiv>
        {data.importance === '3' ? (
          <Symbol
            color="green"
            onClick={() => handleImportanceEditClick(data.id)}
          />
        ) : data.importance === '1' ? (
          <Symbol
            color="red"
            onClick={() => handleImportanceEditClick(data.id)}
          />
        ) : (
          <Symbol
            color="yellow"
            onClick={() => handleImportanceEditClick(data.id)}
          />
        )}

        {data.status === '완료' ? (
          <StatusDiv
            color="green"
            onClick={() => handleStatusEditClick(data.id)}
          >
            <span>{data.status}</span>
          </StatusDiv>
        ) : data.status === '시작 안함' ? (
          <StatusDiv
            color="#c9c9c9"
            onClick={() => handleStatusEditClick(data.id)}
          >
            <span>{data.status}</span>
          </StatusDiv>
        ) : (
          <StatusDiv
            color="pink"
            onClick={() => handleStatusEditClick(data.id)}
          >
            <span>{data.status}</span>
          </StatusDiv>
        )}
      </TodoItemInfoDiv>
      <TodoItemInfoDiv>
        {taskNameEditMode ? (
          <input
            placeholder="To do what"
            onKeyPress={(e) => handleEnterPress(e, data.id)}
            ref={inputEl}
          />
        ) : (
          <div>
            <span>{data.taskName}</span>
          </div>
        )}
      </TodoItemInfoDiv>
      <TodoItemInfoDiv>
        <div>
          <span style={{ fontSize: '5px' }}>
            {data.dueDateRange[0]} ~ {data.dueDateRange[1]}
          </span>
        </div>
        <div style={{ display: 'flex', marginLeft: '65%' }}>
          {taskNameEditMode ? (
            <TrashImage onClick={() => handleTaskNameEdit(data.id)} />
          ) : (
            <SettingImage
              onClick={() => setTaskNameEditMode((prev) => !prev)}
            />
          )}
          <SettingImage />
          <TrashImage onClick={() => handleDelete(data.id)} />
        </div>
      </TodoItemInfoDiv>
    </TodoItemDiv>
  );
}

export default TodoItem;

const TodoItemDiv = styled.div`
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  margin: 20px;
`;

const TodoItemInfoDiv = styled.div`
  display: flex;
  padding: 10px;
`;

const SettingImage = styled.div`
  background-image: url('assets/img/setting.svg');
  background-size: cover;
  background-position: center;
  width: 20px;
  height: 20px;
  margin: 0px 5px;
  cursor: pointer;
`;

const TrashImage = styled.div`
  background-image: url('assets/img/trash.svg');
  background-size: cover;
  background-position: center;
  width: 20px;
  height: 20px;
  margin: 0px 5px;
  cursor: pointer;
`;

const Symbol = styled.div`
  width: 20px;
  height: 20px;
  background: ${(props) => props.color};
  border-radius: 50%;
`;

const StatusDiv = styled.div`
  padding: 0px 10px;
  height: 20px;
  background: ${(props) => props.color};
  border-radius: 10%;
  margin-left: 10px;
  color: #ffffff;
  font-size: 11px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
