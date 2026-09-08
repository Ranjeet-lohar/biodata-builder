"use client";

import { useRef, useState } from "react";
import {
  ImagePlus,
  X,
  Upload,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function PhotoUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (dataUrl: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function openFilePicker() {
    setError("");
    inputRef.current?.click();
  }

  function handleFile(file: File | null) {
    if (!file) return;

    setError("");

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setIsLoading(true);

    const reader = new FileReader();

    reader.onload = () => {
      onChange(reader.result as string);
      setIsLoading(false);
    };

    reader.onerror = () => {
      setError("Unable to read this image. Please try another file.");
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    handleFile(event.target.files?.[0] ?? null);

    // Allow selecting the same file again
    event.target.value = "";
  }

  function handleDragOver(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!isLoading) {
      setIsDragging(true);
    }
  }

  function handleDragLeave(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(false);

    if (isLoading) return;

    const file = event.dataTransfer.files?.[0] ?? null;
    handleFile(file);
  }

  function removePhoto() {
    setError("");
    onChange("");
  }

  return (
    <div className="flex items-start gap-4">
      {/* Photo Preview / Drop Zone */}
      <button
        type="button"
        onClick={openFilePicker}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={isLoading}
        aria-label={value ? "Change profile photo" : "Upload profile photo"}
        className={`
          group relative
          w-24 h-28
          rounded-lg
          border-2 border-dashed
          overflow-hidden
          flex items-center justify-center
          shrink-0
          cursor-pointer
          transition-all duration-200
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-stone-500
          focus-visible:ring-offset-2
          disabled:cursor-wait
          ${
            isDragging
              ? "border-stone-600 bg-stone-100 scale-[1.02]"
              : "border-stone-300 bg-stone-50 hover:border-stone-500 hover:bg-stone-100"
          }
        `}
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-stone-500 animate-spin" />
            <span className="text-[10px] text-stone-500">
              Loading...
            </span>
          </div>
        ) : value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Profile photo preview"
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/45 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <Upload className="w-5 h-5 text-white" />
              <span className="text-[10px] font-medium text-white">Change</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            {isDragging ? (
              <>
                <Upload className="w-6 h-6 text-stone-600" />
                <span className="text-[10px] font-medium text-stone-600">Drop here</span>
              </>
            ) : (
              <>
                <ImagePlus className="w-6 h-6 text-stone-300 group-hover:text-stone-500 transition-colors" />
                <span className="text-[10px] text-stone-400">Add photo</span>
              </>
            )}
          </div>
        )}
      </button>

      {/* Controls */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={openFilePicker}
          disabled={isLoading}
          className="
            btn-primary
            w-fit
            inline-flex
            items-center
            gap-1.5
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-stone-500
            focus-visible:ring-offset-2
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        >
          <Upload className="w-3.5 h-3.5" />
          {value ? "Change photo" : "Upload photo"}
        </button>

        {value && (
          <button
            type="button"
            onClick={removePhoto}
            disabled={isLoading}
            className="
              btn-outline
              w-fit
              !py-2
              !px-5.5
              min-w-[142px]
              text-xs
              inline-flex
              items-center
              gap-1.5
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-stone-500
              focus-visible:ring-offset-2
              disabled:opacity-60
            "
          >
            <X className="w-3 h-3" />
            Remove
          </button>
        )}

        {/* File hint */}
        <span className="text-[10px] text-stone-400">
          JPG, PNG, WEBP · Max 5MB
        </span>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-1.5 max-w-48">
            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
            <span className="text-[10px] leading-4 text-red-500">
              {error}
            </span>
          </div>
        )}

        <input
          ref={inputRef}
          name="profile-photo"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}
