import React, { useState } from 'react';
import { Modal, Button } from '../ui';
import { Upload, Image, CheckCircle2 } from 'lucide-react';

export const ImageUploadModal = ({
  isOpen,
  onClose,
  onUpload,
  exercise,
  isLoading = false,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile || !exercise) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    onUpload(exercise._id, formData);
  };

  if (!exercise) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Upload Image: ${exercise.name}`}
      subtitle="Select image file to upload to Cloudinary"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Preview Container */}
        <div className="w-full h-48 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
          {previewUrl || exercise.image?.url ? (
            <img
              src={previewUrl || exercise.image?.url}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500 space-y-2">
              <Image className="w-10 h-10" />
              <span className="text-xs">No image selected</span>
            </div>
          )}
        </div>

        {/* File Picker */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Select Image File
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-emerald-400 hover:file:bg-slate-700 cursor-pointer"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            isDisabled={!selectedFile}
            iconLeft={Upload}
          >
            Upload Image
          </Button>
        </div>
      </form>
    </Modal>
  );
};
