import { v4 } from "uuid";
const initialState = [];
let copyState = null;
let index = 0;

const collectorReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "ADD_COLLECTOR":
      console.log("Add Collector Payload", payload);
      return [
        ...state,
        {
          id: v4(),
          name: payload.name,
          selected: false,
          collection: [],
        },
      ];

    case "DELETE_COLLECTOR":
      console.log("Delete Collector Payload", payload);
      copyState = [...state];
      index = copyState.findIndex((x) => x.id === payload.id);
      copyState.splice(index, 1);
      return [...copyState];

    case "SELECT_COLLECTOR":
      console.log("SELECT_COLLECTOR Payload", payload);

      const newState = state.map((collector) => {
        if (collector.id === payload.id) {
          return { ...collector, selected: true };
        } else {
          return { ...collector, selected: false };
        }
      });
      return newState;

    case "UNSELECT_COLLECTOR":
      const newState1 = state.map((collector) => {
        if (collector.id === payload.id) {
          return { ...collector, selected: false };
        } else {
          return collector;
        }
      });
      return newState1;

    case "ADD_CHARACTER":
      return state.map((collector) => {
        if (collector.selected === true) {
          return {
            ...collector,
            collection: [
              ...collector.collection,
              { id: payload.id, name: payload.name, image: payload.image },
            ],
          };
        }
        return collector;
      });

    case "GIVE_UP_CHARACTER":
      return state.map((collector) => {
        if (collector.selected === true) {
          let copyCollector = [...collector.collection];
          index = copyCollector.findIndex((element) => element.id === payload.id);
          copyCollector.splice(index, 1);

          return {
            ...collector,
            collection: [...copyCollector],
          };
        }
        return collector;
      });

    default:
      return state;
  }
};

export default collectorReducer;
