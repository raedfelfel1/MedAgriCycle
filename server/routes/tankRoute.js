const express = require("express");
const router = express.Router();
const tankController = require("../controllers/tankController");

router.post("/", tankController.createTank);
router.get("/", tankController.getTanks);
router.put("/:id", tankController.updateTank);
router.delete("/:id", tankController.deleteTank);
router.get("/farm/:id",tankController.fetchTanksByFarm)
router.put("/:id/name", tankController.updateTankName);
router.get("/:tankId/products", tankController.getProductsByTank);
router.get("/:userId/",tankController.getTanksByUser)

module.exports = router;