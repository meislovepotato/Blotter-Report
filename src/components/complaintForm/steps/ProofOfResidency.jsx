"use client";

import { useRef } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { OutlineButton } from "@/components";

const FileUpload = ({ id, label, file, preview, onChange }) => {
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onChange(file, reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-2 w-full flex-1 overflow-hidden">
      <p className="text-[10px] text-text">Upload {label}</p>

      <OutlineButton
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full"
      >
        UPLOAD
      </OutlineButton>

      <input
        type="file"
        id={id}
        hidden
        ref={inputRef}
        accept="image/*"
        onChange={handleFile}
      />

      {preview && (
        <div className="flex-1 h-full overflow-hidden">
          <img
            src={preview}
            alt={`${label} Preview`}
            className="w-full max-h-70 object-cover object-top rounded-md border sm:max-h-72"
          />
        </div>
      )}
    </div>
  );
};

const ProofOfResidency = ({ formData, setFormData }) => {
  const handleProofChange = (e) => {
    const proofType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      proofType,
      // Clear non-relevant files
      attachmentIDFront: proofType === "ID" ? prev.attachmentIDFront : null,
      previewAttachmentIDFront:
        proofType === "ID" ? prev.previewAttachmentIDFront : null,
      attachmentIDBack: proofType === "ID" ? prev.attachmentIDBack : null,
      previewAttachmentIDBack:
        proofType === "ID" ? prev.previewAttachmentIDBack : null,
      attachmentUtility:
        proofType === "UTILITY_BILL" ? prev.attachmentUtility : null,
      previewAttachmentUtility:
        proofType === "UTILITY_BILL" ? prev.previewAttachmentUtility : null,
    }));
  };

  const updateFile = (field, file, preview) => {
    setFormData((prev) => ({
      ...prev,
      [field]: file,
      [`preview${field[0].toUpperCase()}${field.slice(1)}`]: preview,
    }));
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <FormControl fullWidth size="small">
        <InputLabel id="proof-type-label">Proof Type</InputLabel>
        <Select
          labelId="proof-type-label"
          id="proof-type"
          value={formData.proofType}
          label="Proof Type"
          onChange={handleProofChange}
        >
          <MenuItem value="ID">Valid ID</MenuItem>
          <MenuItem value="UTILITY_BILL">Utility Bill</MenuItem>
        </Select>
      </FormControl>

      {formData.proofType === "ID" && (
        <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
          <FileUpload
            id="attachmentIDFront"
            label="ID Front"
            file={formData.attachmentIDFront}
            preview={formData.previewAttachmentIDFront}
            onChange={(file, preview) =>
              updateFile("attachmentIDFront", file, preview)
            }
          />
          <FileUpload
            id="attachmentIDBack"
            label="ID Back"
            file={formData.attachmentIDBack}
            preview={formData.previewAttachmentIDBack}
            onChange={(file, preview) =>
              updateFile("attachmentIDBack", file, preview)
            }
          />
        </div>
      )}

      {formData.proofType === "UTILITY_BILL" && (
        <div className="flex-1 overflow-hidden">
          <FileUpload
            id="attachmentUtility"
            label="Utility Bill"
            file={formData.attachmentUtility}
            preview={formData.previewAttachmentUtility}
            onChange={(file, preview) =>
              updateFile("attachmentUtility", file, preview)
            }
          />
        </div>
      )}
    </div>
  );
};

export default ProofOfResidency;
