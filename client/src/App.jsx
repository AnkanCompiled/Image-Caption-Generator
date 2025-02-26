import { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

function App() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setImage(acceptedFiles[0]);
    },
  });

  const handleUpload = async () => {
    if (!image) return alert("Please upload an image");

    const formData = new FormData();
    formData.append("file", image);

    const response = await axios.post("http://localhost:5001/upload", formData);
    const { imageUrl } = response.data;

    const captionRes = await axios.post("http://localhost:5002/generate-caption", { imageUrl });
    setCaption(captionRes.data.caption);
  };

  return (
    <div className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag & drop an image, or click to select</p>
      </div>
      {image && <img src={URL.createObjectURL(image)} alt="Preview" width="200" />}
      <button onClick={handleUpload}>Generate Caption</button>
      {caption && <p>Caption: {caption}</p>}
    </div>
  );
}

export default App;
