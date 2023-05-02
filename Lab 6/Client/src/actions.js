const addCollector = (name) => ({
  type: "ADD_COLLECTOR",
  payload: {
    name: name,
    selected: false,
  },
});

const deleteCollector = (id) => ({
  type: "DELETE_COLLECTOR",
  payload: {
    id: id,
  },
});

const selectCollector = (id) => ({
  type: "SELECT_COLLECTOR",
  payload: {
    id: id,
  },
});

const unselectCollector = (id) => ({
  type: "UNSELECT_COLLECTOR",
  payload: {
    id: id,
  },
});

const addCharacter = (val) => ({
  type: "ADD_CHARACTER",
  payload: {
    name: val.name,
    id: val.id,
  },
});

const givUpChar = (id) => ({
  type: "GIVE_UP_CHARACTER",
  payload: { id: id },
});

module.exports = {
  addCollector,
  deleteCollector,
  selectCollector,
  unselectCollector,
  addCharacter,
  givUpChar,
};
