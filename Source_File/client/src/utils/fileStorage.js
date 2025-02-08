const fs = require("fs").promises;
const path = "C:/CollabVerse/data.json"; // ✅ File Location

// ✅ Save Data to File
const saveData = async (data) => {
  try {
    await fs.writeFile(path, JSON.stringify(data, null, 2));
    return { success: true, message: "Data saved successfully" };
  } catch (error) {
    console.error("Error saving data:", error);
    return { success: false, message: "Failed to save data" };
  }
};

// ✅ Read Data from File
const getData = async () => {
  try {
    // ✅ Check if File Exists
    const exists = await fs.access(path).then(() => true).catch(() => false);
    if (!exists) {
      return null;
    }

    // ✅ Read File
    const data = await fs.readFile(path, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
    return null;
  }
};

// ✅ Delete Data File
const clearData = async () => {
  try {
    // ✅ Check if File Exists
    const exists = await fs.access(path).then(() => true).catch(() => false);
    if (exists) {
      await fs.unlink(path);
    }
    return { success: true, message: "Data cleared successfully" };
  } catch (error) {
    console.error("Error clearing data:", error);
    return { success: false, message: "Failed to clear data" };
  }
};

module.exports = { saveData, getData, clearData };
