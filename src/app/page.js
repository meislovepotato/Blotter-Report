"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function BlotterForm() {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    address: "",
    fullName: "",
    idPicture: "",
  });
  const { data: session } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/blotter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId: session?.user?.id }),
      });

      if (response.ok) {
        alert("Blotter submitted!");
        setFormData({
          type: "",
          description: "",
          address: "",
          fullName: "",
          idPicture: "",
        });
      } else {
        const errorData = await response.json();
        alert(`Failed to submit blotter: ${errorData.error}`);
      }
    } catch (error) {
      alert(`Failed to submit blotter: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Type:</label>
        <input
          type="text"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        ></textarea>
      </div>
      <div>
        <label>Address:</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>
      <div>
        <label>Full Name:</label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />
      </div>
      <div>
        <label>ID Picture:</label>
        <input
          type="text"
          value={formData.idPicture}
          onChange={(e) =>
            setFormData({ ...formData, idPicture: e.target.value })
          }
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}