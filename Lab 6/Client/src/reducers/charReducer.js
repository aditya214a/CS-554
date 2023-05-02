const initialState = [];
let copyState = null;
let index = 0;

const charReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "XYZ":
      console.log("payload", payload);
      copyState = [...state];
      return [...state, payload];

    default:
      return state;
  }
};

export default charReducer;
