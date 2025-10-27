const connectDB = require("../../../config/database/mongodb");
const Project = require("../../../modules/project/model/project.model");

export default async function handler(req, res) {
  const { projectId } = req.query;

  if (!projectId || typeof projectId !== "string") {
    return res.status(400).json({ error: "Invalid project ID" });
  }

  try {
    await connectDB();

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json(project);
  } catch (err) {
    console.error("Failed to fetch project by ID:", err);
    res.status(500).json({ error: "Failed to fetch project by ID" });
  }
}