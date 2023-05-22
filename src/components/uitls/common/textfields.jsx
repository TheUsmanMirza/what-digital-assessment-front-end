import React from "react"

export const InputField = ({ value, label, name, placeholder, type, onChange }) => (
    <div className="form-group col-lg-12 pb-3">
      {label && <label htmlFor="input-field" className="control-label">{label}</label>}
      <input
        className="form-control"
        type={type}
        value={value}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
