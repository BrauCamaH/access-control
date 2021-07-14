import * as React from "react";

const AccessDispatchContext = React.createContext({});
const AccessStateContext = React.createContext({});

function accessReducer(state = { staff: null, access: [] }, action) {
  switch (action.type) {
    case "SET_STAFF":
      return { ...state, staff: action.payload };
    case "SET_ACCESS":
      return { ...state, access: [...action.payload] };
    case "UPDATE_ACCESS":
      return {
        ...state,
        access: [
          ...state.access.filter((a) => a.id !== action.payload.id),
          action.payload,
        ],
      };
    default:
      return state;
  }
}

function AccessProvider({ children }) {
  const [state, dispatch] = React.useReducer(accessReducer, []);

  return (
    <AccessStateContext.Provider value={state}>
      <AccessDispatchContext.Provider value={dispatch}>
        {children}
      </AccessDispatchContext.Provider>
    </AccessStateContext.Provider>
  );
}

function useAccessState() {
  const context = React.useContext(AccessStateContext);
  if (context === undefined) {
    throw new Error("useAccessState must be used within a StaffProvider");
  }

  return context;
}

function useAccessDispatch() {
  const context = React.useContext(AccessDispatchContext);
  if (context === undefined) {
    throw new Error("useAccessDispatch must be used within a StaffProvider");
  }

  return context;
}

export { AccessProvider, useAccessState, useAccessDispatch };
