const express = require("express");
const router = express.Router();
const { getDatabaseInstance } = require("../../database/start");

const getCurrenOrgtDb = async (req) => {
  const { org_id, org_name } = req;
  return await getDatabaseInstance(org_id + "_" + org_name + ".sqlite");
};

const getMaintDb = async () => {
  return await getDatabaseInstance("./Group4_PartPay.sqlite");
};

router.get("/", async (req, res) => {
  const { role, user_id } = req;
  const org_db = await getCurrenOrgtDb(req);
  const db = await getMaintDb();

  try {
    const userQuery = `SELECT users.id, users.name, users.email, users.address, users.phone, user_orgs.role
      FROM users
      JOIN user_orgs ON users.id = user_orgs.user_id
      WHERE users.id = ? AND user_orgs.role = ?`;
    const [user] = await db.all(userQuery, [user_id, role]);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (role === "ptemployee") {
      const ptEmployeeQuery = `SELECT * FROM parttimeemployee WHERE uid = ?`;
      const [ptEmployee] = await org_db.all(ptEmployeeQuery, [user_id]);

      if (!ptEmployee) {
        res.status(404).json({ message: "Part-time employee details not found" });
        return;
      }

      const fullProfile = { ...user, details: ptEmployee };
      res.json({ ...fullProfile });
    } else {
      res.json({ ...user });
    }
  } catch (error) {
    console.error("Failed to retrieve profile:", error);
    res.status(500).json({ message: "Error retrieving user profile" });
  }
});

router.put("/", async (req, res) => {
  const { role, user_id } = req;
  const { name, address, phone, routing_number, account_number } = req.body;

  const db = await getMaintDb();
  const org_db = await getCurrenOrgtDb(req);

  try {
    const updateQuery = "UPDATE users SET name = ?, address = ?, phone = ? WHERE id = ?";

    const result = await db.run(updateQuery, [name, address, phone, user_id]);

    if (role === "ptemployee") {
      const ptEmployeeUpdateQuery = `UPDATE parttimeemployee SET routing_number = ?, account_number = ? WHERE uid = ?`;
      const ptResult = await org_db.run(ptEmployeeUpdateQuery, [routing_number, account_number, user_id]);
      if (result.changes > 0 && ptResult.changes > 0) {
        res.json({ message: "Profile updated successfully." });
      } else {
        res.status(404).json({ message: "User not found." });
      }
    } else {
      if (result.changes > 0) {
        res.json({ message: "Profile updated successfully." });
      } else {
        res.status(404).json({ message: "User not found." });
      }
    }
  } catch (error) {
    console.error("Failed to update profile:", error);
    res.status(500).json({ message: "Error updating user profile." });
  }
});

module.exports = router;
