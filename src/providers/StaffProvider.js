import * as React from "react";

const StaffDispatchContext = React.createContext({});
const StaffStateContext = React.createContext({});

function staffReducer(state = [], action) {
  switch (action.type) {
    case "ADD_STAFF":
      return [...state, action.payload];
    case "SET_STAFF":
      return [...action.payload];
    default:
      return state;
  }
}

function StaffProvider({ children }) {
  const [state, dispatch] = React.useReducer(staffReducer, []);

  return (
    <StaffStateContext.Provider value={state}>
      <StaffDispatchContext.Provider value={dispatch}>
        {children}
      </StaffDispatchContext.Provider>
    </StaffStateContext.Provider>
  );
}

function useStaffState() {
  const context = React.useContext(StaffStateContext);
  if (context === undefined) {
    throw new Error("useStaffState must be used within a StaffProvider");
  }

  return context;
}

function useStaffDispatch() {
  const context = React.useContext(StaffDispatchContext);
  if (context === undefined) {
    throw new Error("useStaffDispatch must be used within a StaffProvider");
  }

  return context;
}

export { StaffProvider, useStaffState, useStaffDispatch };
