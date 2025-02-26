const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const PORT = 3001;
const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  console.log("hello");
  const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => console.log(`Upload Service running on port ${PORT}`));
