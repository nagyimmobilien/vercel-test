const connectDB = require("../../../../../config/database/mongodb");
const Unit = require("../../../../../modules/unit/model/unit.model");

export default async function handler(req, res) {
  const { unitId } = req.query;

  if (!unitId || typeof unitId !== "string") {
    return res.status(400).json({ error: "Invalid project ID" });
  }

  try {
    await connectDB();

    const unit = await Unit.findById(unitId);

    if (!unit) {
      return res.status(404).json({ error: "Unit not found" });
    }

    res.status(200).json(unit);
  } catch (err) {
    console.error("Failed to fetch unit by ID:", err);
    res.status(500).json({ error: "Failed to fetch unit by ID" });
  }
}