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
  const { session } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/blotter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, userId: session?.user?.id }),
    });

    if (response.ok) alert("Blotter submitted!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Type:</label>
      <input
        type="text"
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
      />

      <label>Description:</label>
      <textarea
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      ></textarea>

      <label>Address:</label>
      <input
        type="text"
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
      />

      <label>Full Name:</label>
      <input
        type="text"
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
      />

      <label>ID Picture:</label>
      <input
        type="text"
        onChange={(e) =>
          setFormData({ ...formData, idPicture: e.target.value })
        }
      />

      <button type="submit">Submit</button>
    </form>
  );
}
