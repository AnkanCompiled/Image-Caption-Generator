import { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import blackSparkSVG from "./assets/blackSpark.svg";
import whiteSparkSVG from "./assets/whiteSpark.svg";
import noImageJPG from "./assets/noImage.jpg";

function App() {
  const [image, setImage] = useState(noImageJPG);
  const [caption, setCaption] = useState("");
  const [infoText, setInfoText] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const validExtensions = ["jpg", "jpeg", "png"];
      const file = acceptedFiles[0];

      if (file) {
        const fileExtension = file.name.split(".").pop().toLowerCase();
        if (!validExtensions.includes(fileExtension)) {
          alert("Invalid file type! Only JPG, JPEG, and PNG are allowed.");
          return;
        }
        setImage(file);
      }
    },
  });

  const handleUpload = async () => {
    if (!image) return alert("Please upload an image");

    setCaption("");
    setInfoText("Analyzing image...");

    const formData = new FormData();
    formData.append("file", image);

    const response = await axios.post("http://localhost:3001/upload", formData);
    const { imageUrl } = response.data;

    setInfoText("Generating caption...");

    const captionRes = await axios.post("http://localhost:3002/generate-caption", { imageUrl });
    setCaption(captionRes.data.caption);

    setInfoText("");
  };

  return (
    <div className="flex flex-col gap-4 h-screen">
      <div className="bg-blue-300 text-white text-3xl font-bold p-4 shadow-lg">BLIP</div>
      <div className="flex justify-center">
        <div {...getRootProps()} className="cursor-pointer flex flex-col items-center justify-center w-[90vw] h-[20vh] rounded-md border-2 border-dashed border-gray-400 hover:border-blue-400 duration-150 ease-out">
          <input {...getInputProps()} />
          <p className="text-2xl text-center text-gray-700">Drag & drop an image</p>
          <p className="text-lg text-center text-gray-700">or click to {image ? "change" : "select"}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4  bg-blue-200 p-4 mx-8 rounded-md">
        <div className="flex justify-center items-center">
          <img src={image == noImageJPG ? noImageJPG : URL.createObjectURL(image)} alt="Preview" className="h-[40vh] max-w-[405w] rounded-lg border-4 border-white" />
        </div>


        <div className="flex flex-col gap-4 min-h-36 items-center justify-center bg-gray-100 rounded-lg shadow-md">
          {caption && <div className="flex justify-center gap-2 bg-white p-4 mx-10 rounded-md text-center shadow-xl">
            <p className="text-2xl"> {caption}</p>
          </div>
          }
          {infoText && (
            <div className="flex justify-center gap-2 bg-white p-4 mx-10 rounded-md text-center shadow-xl">
              <img src={blackSparkSVG} className="animate-spin w-6 h-6" />
              <p className="text-lg">{infoText}</p>
            </div>
          )}
          <button disabled={image == noImageJPG || infoText} onClick={handleUpload} className={`flex gap-2 w-max bg-blue-400 p-4 rounded-md text-lg font-semibold text-white shadow-xl disabled:opacity-20 disabled:cursor-not-allowed`}><img src={whiteSparkSVG} />Generate Caption</button>
        </div>

      </div>
      <div className="flex justify-center">

      </div>


    </div>
  );
}

export default App;
