// farmIdStore.js
let farmId = null;

function setFarmId(id) {
  farmId = id;
}

function getFarmId() {
  return farmId;
}

module.exports = { setFarmId, getFarmId };
