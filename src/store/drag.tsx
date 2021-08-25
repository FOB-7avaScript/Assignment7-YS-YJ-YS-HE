import React, {
  createContext,
  useState,
  useRef,
  Dispatch,
  SetStateAction
} from 'react';

interface IDragContext {
  state: {
    dragging: boolean;
    dragItemIndex: number | null;
  };
  actions: {
    setDragging: Dispatch<SetStateAction<boolean>>;
    handleDragItemIndex: (index: number | null) => void;
  };
}

const defaultValue: IDragContext = {
  state: {
    dragging: false,
    dragItemIndex: null
  },
  actions: {
    setDragging: () => {},
    handleDragItemIndex: () => {}
  }
};

const DragContext = createContext(defaultValue);

interface UserProviderProps {
  children: React.ReactNode;
}

const DragProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [dragging, setDragging] = useState(false);
  const dragItem = useRef<number | null>(null);

  const handleDragItemIndex = (index: number | null) => {
    dragItem.current = index;
  };

  const value: IDragContext = {
    state: { dragging, dragItemIndex: dragItem.current },
    actions: { setDragging, handleDragItemIndex }
  };
  return <DragContext.Provider value={value}>{children}</DragContext.Provider>;
};

const DragConsumer = DragContext.Consumer;

export { DragProvider, DragConsumer };
export default DragContext;
