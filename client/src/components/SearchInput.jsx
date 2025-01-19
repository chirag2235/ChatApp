import React from "react";

export default function SearchInput({ onSearch }) {
  const handleChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search contacts"
      onChange={handleChange}
      style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
    />
  );
}
