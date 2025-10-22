const connectDB = require("../../../../config/database/mongodb");
const Project = require("../../../../modules/project/model/project.model");
const Unit = require("../../../../modules/unit/model/unit.model");

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid project ID" });
  }

  try {
    await connectDB();

    const project = await Project.findById(id).populate("units");

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json(project.units);
  } catch (err) {
    console.error("Failed to fetch units for project:", err);
    res.status(500).json({ error: "Failed to fetch units for project" });
  }
}


