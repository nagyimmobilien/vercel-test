const connectDB = require("../../config/database/mongodb");
const District = require("../../modules/district/model/district.model")

export default async function handler(req, res) {
  const { id } = req.query; 
  const number = parseInt(id, 10);

  try {
    await connectDB();

    const district = await District.findOne({ number: number });

    if (!district) {
      return res.status(404).json({ error: "District not found" });
    }

    res.status(200).json(district);
  } catch (err) {
    console.error("Failed to fetch district by number", err);
    res.status(500).json({ error: "Failed to fetch district by number" });
  }
}