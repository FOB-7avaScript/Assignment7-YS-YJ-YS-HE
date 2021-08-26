import { FC, useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import useTodo from 'hooks/useTodo';
import dateFormat from 'Utils/Date';
import DatePicker from './DatePicker';

const TodoForm: FC = () => {
  const { todo, handleInputChange, handleDateRangeChange } = useTodo();
  const { taskName, dueDateRange } = todo;

  const [rangePickerOpen, setRangePickerOpen] = useState(false);

  const handleRangePickerVisibleToggle = () => {
    setRangePickerOpen((prev: boolean) => !prev);
  };

  return (
    <form>
      <h2>{dateFormat({ targetDate: new Date() })}</h2>
      <p>
        <input name="taskName" value={taskName} onChange={handleInputChange} />
        <button type="button" onClick={handleRangePickerVisibleToggle}>
          <FaCalendarAlt />
        </button>
      </p>
      {rangePickerOpen && (
        <DatePicker
          dueDateRange={dueDateRange}
          onChange={handleDateRangeChange}
        />
      )}
      <button type="submit">추가</button>
    </form>
  );
};

export default TodoForm;
