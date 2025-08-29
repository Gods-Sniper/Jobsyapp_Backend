const express = require("express");
const router = express.Router();
const categoryController = require("../Controllers/category_controller");

// CREATE
router.post("/", categoryController.createCategory);

// READ
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);

// UPDATE
router.put("/:id", categoryController.updateCategory);

// DELETE
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
