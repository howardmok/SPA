import { useReducer, createContext, useEffect } from "react";
import { Alert } from "@sweeten/oreo";
import { merge, cloneDeep, isEqual, get } from "lodash";

const initialState = {
  alert: {
    isVisible: false,
    shouldStayVisible: false,
    text: null,
    variant: null,
  },
  unreadMessageCounts: {},
  preventScroll: false,
};

export const AppState = createContext(initialState);
export const AppDispatch = createContext(() => {});

/**
 * This function is called by the reducer to show an alert.
 * @param {Object} state The current state of the AppProvider
 * @param {Object} payload The information stored on the payload
 * Payload format is { variant: "success" || "error", text: "alert text"}
 * Passing in payload/payload arguments is optional, with the default being an error alert.
 */
const showAlert = (state, payload) => {
  const defaultText = isEqual(payload.variant, "success")
    ? "Your request completed successfully!"
    : "There was an error processing your request. Please try again.";

  const obj = cloneDeep(state);
  return merge(obj, {
    alert: {
      isVisible: true,
      variant: get(payload, "variant", "error"),
      text: get(payload, "text", defaultText),
      shouldStayVisible: get(payload, "shouldStayVisible", false),
    },
  });
};

/**
 * This function is called by the reducer to hide an alert.
 * @param {Object} state The current state of the AppProvider
 */
const hideAlert = (state) => {
  const obj = cloneDeep(state);
  return merge(obj, {
    alert: {
      isVisible: false,
    },
  });
};

const updateUnreadMessageCounts = (state, unreadMessageCounts) => {
  const obj = cloneDeep(state);

  return { ...obj, unreadMessageCounts };
};

const preventScroll = (state) => {
  const obj = cloneDeep(state);
  return merge(obj, {
    preventScroll: true,
  });
};

const allowScroll = (state) => {
  const obj = cloneDeep(state);
  return merge(obj, {
    preventScroll: false,
  });
};

/**
 * Reducer that will handle state management
 * @param {Object} state The current state of the AppProvider
 * @param {Object} action The information being sent by the dispatch
 * Action format is { type: "action_type", payload: {...payloadInfo}}
 */
const appReducer = (state, action) => {
  switch (action.type) {
    case "alert:show": {
      return showAlert(
        state,
        action.payload
          ? {
              text: action.payload.text,
              variant: action.payload.variant,
              shouldStayVisible: action.payload.shouldStayVisible,
            }
          : {}
      );
    }
    case "alert:hide":
      return hideAlert(state);
    case "unreadMessageCounts":
      return updateUnreadMessageCounts(state, action.unreadMessageCounts);
    case "preventScroll:true":
      return preventScroll(state);
    case "preventScroll:false":
      return allowScroll(state);
    default:
      return state;
  }
};

/**
 * Main component which will handle state management
 * @param {Element} children Component that is being wrapped by the AppProvider
 */
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    if (!state.alert.shouldStayVisible) {
      const timer = setTimeout(() => dispatch({ type: "alert:hide" }), 5000);
      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [state.alert.isVisible]);

  useEffect(() => {
    window.onUsersnapLoad = (api) => {
      api.init();
    };
    const script = document.createElement("script");
    script.defer = 1;
    script.src =
      "https://widget.usersnap.com/global/load/a2c99c18-7a93-4513-8c6d-3d7acebd7ab8?onload=onUsersnapLoad";
    document.getElementsByTagName("head")[0].appendChild(script);
  }, []);

  return (
    <AppState.Provider value={state}>
      <AppDispatch.Provider value={dispatch}>
        {state.alert.isVisible && (
          <Alert
            variant={state.alert.variant}
            onClose={() =>
              dispatch({
                type: "alert:hide",
              })
            }
          >
            {state.alert.text}
          </Alert>
        )}
        {children}
      </AppDispatch.Provider>
    </AppState.Provider>
  );
};

export default AppProvider;
