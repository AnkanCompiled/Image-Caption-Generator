from fastapi import FastAPI
from pydantic import BaseModel
import torch
from transformers import BlipProcessor, BlipForConditionalGeneration

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

class ImageRequest(BaseModel):
    imageUrl: str

@app.post("/generate-caption")
async def generate_caption(request: ImageRequest):
    from PIL import Image
    import requests

    image = Image.open(requests.get(request.imageUrl, stream=True).raw)
    inputs = processor(image, return_tensors="pt")

    caption_ids = model.generate(**inputs)
    caption = processor.decode(caption_ids[0], skip_special_tokens=True)

    return {"caption": caption}

