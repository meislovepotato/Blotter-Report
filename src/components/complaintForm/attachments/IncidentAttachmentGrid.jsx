"use client";

import {
  CloseRounded,
  AddRounded,
  PlayArrowRounded,
} from "@mui/icons-material";

const IncidentAttachmentGrid = ({
  attachments,
  onPreview,
  onRemove,
  onAdd,
  showAddButton = true,
  removable = true,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2 auto-rows-auto sm:grid-cols-5">
      {attachments.map((fileObj, index) => (
        <div
          key={index}
          className="relative w-full aspect-square rounded-md border-2 border-text/20"
        >
          <div
            onClick={() => onPreview(fileObj.data)}
            className="w-full h-full bg-center bg-cover cursor-pointer flex items-center justify-center relative"
            style={{
              backgroundImage: fileObj.isVideo
                ? "none"
                : `url(${fileObj.data})`,
              backgroundColor: fileObj.isVideo ? "#000" : undefined,
            }}
          >
            {fileObj.isVideo && (
              <>
                <video
                  src={fileObj.data}
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
                <PlayArrowRounded className="absolute text-background text-2xl" />
              </>
            )}
          </div>

          {removable && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute -top-3 -right-3 bg-background rounded-full p-1 cursor-pointer shadow"
            >
              <CloseRounded />
            </button>
          )}
        </div>
      ))}

      {showAddButton && (
        <label className="w-full aspect-square border-2 border-dashed border-secondary flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-100">
          <AddRounded />
          <input type="file" accept="image/*,video/*" hidden onChange={onAdd} />
        </label>
      )}
    </div>
  );
};

export default IncidentAttachmentGrid;
