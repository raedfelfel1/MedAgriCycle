// state.js
let farmId = null;
module.exports = {
  setFarmId: (id) => { farmId = id; },
  getFarmId: () => farmId
};
