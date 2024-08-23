const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const imagekit = require("../config/imagekitConfig");

// Create Content
const createContent = async (req, res) => {
  const { title, description } = req.body;
  const file = req.file;

  try {
    let imageUrl = "";

    if (file) {
      const uploadResponse = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
      });

      imageUrl = uploadResponse.url;
    }

    // Save content with image URL
    const content = await prisma.content.create({
      data: {
        title,
        description,
        image: imageUrl,
      },
    });

    res.status(201).json(content);
  } catch (error) {
    res.status(500).json({ error: "Failed to create content" });
  }
};

// Update Content
const updateContent = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const file = req.file;

  try {
    let imageUrl = undefined;

    if (file) {
      // Upload image to ImageKit
      const uploadResponse = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
      });

      imageUrl = uploadResponse.url;
    }

    // Update content
    const content = await prisma.content.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        image: imageUrl,
      },
    });

    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ error: "Failed to update content" });
  }
};

// Get All Contents
const getAllContents = async (req, res) => {
  try {
    const contents = await prisma.content.findMany();
    res.status(200).json(contents);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to retrieve contents" });
  }
};

// Get Content by ID
const getContentById = async (req, res) => {
  const { id } = req.params;

  try {
    const content = await prisma.content.findUnique({
      where: { id: parseInt(id) },
    });

    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }

    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve content" });
  }
};

// Delete Content
const deleteContent = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.content.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete content" });
  }
};

module.exports = {
  createContent,
  getAllContents,
  getContentById,
  updateContent,
  deleteContent,
};
