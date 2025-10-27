const connectDB = require("../../../../config/database/mongodb");
const Project = require("../../../../modules/project/model/project.model");
const Unit = require("../../../../modules/unit/model/unit.model");

export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', 'https://becsingatlan.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json({ error: "Invalid project ID" });

  try {
    await connectDB();

    if (req.method === "GET") {
      const project = await Project.findById(id).populate("units");
      if (!project) return res.status(404).json({ error: "Project not found" });
      return res.status(200).json(project.units);
    }

    if (req.method === "PATCH") {
      const updates = req.body;
      if (!Array.isArray(updates)) return res.status(400).json({ error: "Body must be an array" });

      const results = [];
      for (const update of updates) {
        const { _id, ...data } = update;
        if (!_id) continue;
        const updatedUnit = await Unit.findByIdAndUpdate(_id, data, { new: true });
        if (updatedUnit) results.push(updatedUnit);
      }
      return res.status(200).json({ updated: results.length, units: results });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Failed units operation:", err);
    res.status(500).json({ error: "Failed units operation" });
  }
}
