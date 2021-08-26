import { useState } from 'react';
import { DateRange, OnDateRangeChangeProps, Range } from 'react-date-range';
import { ko } from 'date-fns/locale';

import getDefaultDueDateRange from 'Utils/RangePicker';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface DatePickerProps {
  dueDateRange: Date[] | null;
  onChange: ({ value }: { value: Date[] }) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ dueDateRange, onChange }) => {
  const [dateRange, setDateRange] = useState<Range[]>([
    getDefaultDueDateRange({ dueDateRange })
  ]);

  const handleDateRangeChange = (range: OnDateRangeChangeProps) => {
    const { startDate, endDate } = range.selection;

    setDateRange([range.selection]);

    if (startDate && endDate) {
      onChange({ value: [startDate, endDate] });
    }
  };

  return (
    <DateRange
      ranges={dateRange}
      onChange={handleDateRangeChange}
      moveRangeOnFirstSelection={false}
      locale={ko}
      minDate={new Date()}
      dateDisplayFormat="yyyy / MM / dd"
    />
  );
};

export default DatePicker;
