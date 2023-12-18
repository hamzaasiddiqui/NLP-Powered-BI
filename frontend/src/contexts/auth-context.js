import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { logInWithEmailAndPassword, logout, auth , registerWithEmailAndPassword, db} from "./../firebase";
import {
  getDoc,
  doc,
} from "firebase/firestore";

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated = auth.user;
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      const id = isAuthenticated.id.trim();
      
      const DocRef = doc(db, "users", id);
      const docs = await getDoc(DocRef);
      
      const userData = docs.data();

      const user = {
        id: id,
        avatar: userData.avatar,
        name: userData.name,
        email: userData.email
      };
     

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user
      });
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );


  const signIn = async (email, password) => {
    try {
      await logInWithEmailAndPassword(email, password);
      window.sessionStorage.setItem('authenticated', 'true');
    } catch (err) {
      console.error(err);
      throw new Error('Please check your email and password');
    }

    const isAuthenticated = auth.currentUser
    const id = isAuthenticated.uid.trim();
    const DocRef = doc(db, "users", id);
    const docs = await getDoc(DocRef);
    
    const userData = docs.data();
    const user = {
      id: id,
      avatar: userData.avatar,
      name: userData.name,
      email: userData.email
    };
    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user
    });
  };

  const signUp = async (email, name, password) => {
    try{
      await registerWithEmailAndPassword(name, email, password);
      await signIn(email, password);
    }catch(err){
      console.log(err);
      throw new Error('Please check your email and password');
    }
  };

  const signOut = () => {
    logout();
    window.sessionStorage.setItem('authenticated', 'false');
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
