"use client";

import { Modal } from "@mui/material";
import { CloseRounded } from "@mui/icons-material";

const AttachmentPreviewModal = ({ open, onClose, src }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="fixed top-1/2 left-1/2 max-w-[90vw] max-h-[80vh] transform -translate-x-1/2 -translate-y-1/2 bg-back p-4 shadow-xl rounded-lg">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 bg-background p-1 rounded-full z-50 cursor-pointer"
        >
          <CloseRounded />
        </button>
        {src?.startsWith("data:image") ? (
          <img
            src={src}
            alt="Preview"
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        ) : (
          <video
            src={src}
            controls
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        )}
      </div>
    </Modal>
  );
};

export default AttachmentPreviewModal;
