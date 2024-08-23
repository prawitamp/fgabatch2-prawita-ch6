const express = require("express");
const upload = require("../middleware/multerConfig");
const {
  createContent,
  getAllContents,
  getContentById,
  updateContent,
  deleteContent,
} = require("../controllers/contentController");

const router = express.Router();

// Routes
router.post("/", upload.single("image"), createContent);
router.get("/", getAllContents);
router.get("/:id", getContentById);
router.put("/:id", upload.single("image"), updateContent);
router.delete("/:id", deleteContent);

module.exports = router;
