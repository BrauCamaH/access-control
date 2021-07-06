import React, { createContext, useContext, useReducer, useEffect } from "react";
import { auth } from "../firebase";
import Spinner from "../components/LoadingBackdrop";

const UserStateContext = createContext(undefined);
const UserDispatchContext = createContext(undefined);

const initialState = { user: undefined, loading: false };

const userReducer = (state, action) => {
  switch (action.type) {
    case "set-loading":
      return { ...state, loading: action.payload };
    case "set-user":
      return { ...state, user: { ...action.payload } };
    case "sign-out":
      return null;
    default: {
      return state;
    }
  }
};

const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    const unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (!userAuth) {
        dispatch({ type: "sign-out" });
      } else {
        dispatch({ type: "set-loading", payload: true });

        console.log(userAuth);
        dispatch({
          type: "set-user",
          payload: { uid: userAuth.id },
        });

        dispatch({ type: "set-loading", payload: false });
      }
    });
    return () => {
      unsubscribeFromAuth();
    };
  }, []);

  if (state?.loading) {
    return <Spinner />;
  }

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};

const useUserState = () => {
  const context = useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }

  return context;
};

const useUserDispatch = () => {
  const context = useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }

  return context;
};

const useUser = () => {
  return [useUserState(), useUserDispatch()];
};

export { UserProvider, useUserState, useUserDispatch, useUser };
