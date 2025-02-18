import React, { useState, useRef } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import s from "./ImageCropper.module.css";

const ImageCropper: React.FC = () => {
  const [src, setSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
  const [completedCrop, setCompletedCrop] = useState<any>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onImageLoaded = (image: HTMLImageElement) => {
    imgRef.current = image;
  };

  const onCropComplete = (crop: any) => {
    setCompletedCrop(crop);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = async () => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const crop = completedCrop;

    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(
        imgRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
    }

    // Получить изображение в формате Data URL
    return canvas.toDataURL("image/jpeg");
  };

  console.log(src);

  return (
    <div className={s.root}>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        name="upload"
      />
      {src && (
        <div>
          <ReactCrop crop={crop} onComplete={onCropComplete} onChange={setCrop}>
            {
              <img
                ref={imgRef}
                src={src}
                alt="cropper image"
                style={{ width: "100%", maxWidth: "800px" }}
              />
            }
          </ReactCrop>
          <button onClick={getCroppedImg} className={s.button}>
            Сохранить
          </button>
          <canvas ref={canvasRef} />
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
