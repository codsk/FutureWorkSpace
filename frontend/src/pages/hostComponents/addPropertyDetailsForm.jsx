import React, { useEffect, useState } from "react";
import './addPropertyDetailsForm.scss';

function AddPropertyDetailsForm({ onClose, onSave, propertyData }) {
  const [formData, setFormData] = useState({
    name: "",
    address: { street: "", city: "", state: "", pincode: "" },
    geo: { lat: "", lng: "" },
    contact: { email: "", phone: "" },
    description: "", _id: ""
  });

  const [existingImages, setExistingImages] = useState([]); // Images from DB
  const [newImages, setNewImages] = useState([]); // New uploads with preview

  useEffect(() => {
    if (propertyData) {
      setFormData({
        _id: propertyData._id || "",
        name: propertyData.name || "",
        address: propertyData.address || {},
        geo: propertyData.geo || {},
        contact: propertyData.contact || {},
        description: propertyData.description || "",
      });
      setExistingImages(propertyData.image || []);
    }
  }, [propertyData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else if (name.includes("geo.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        geo: { ...prev.geo, [field]: value },
      }));
    } else if (name.includes("contact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contact: { ...prev.contact, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previewFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewImages((prev) => [...prev, ...previewFiles]);
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalFormData = {
      ...formData,
      images: newImages.map((img) => img.file), // Files to upload
      existingImages, // Images to keep from DB
    };
    propertyData ? 
    onSave(finalFormData, 'update') : onSave(finalFormData, 'save')
  };

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <div className="property-form__row">
        <label className="property-form__label">
          Name:
          <input className="property-form__input" name="name" value={formData.name} onChange={handleInputChange} required />
        </label>
      </div>
      <div className="property-form__row">
        <label className="property-form__label">
          Street:
          <input className="property-form__input" name="address.street" value={formData.address.street} onChange={handleInputChange} required />
        </label>
        <label className="property-form__label">
          City:
          <input className="property-form__input" name="address.city" value={formData.address.city} onChange={handleInputChange} required />
        </label>
      </div>
      <div className="property-form__row">
        <label className="property-form__label">
          State:
          <input className="property-form__input" name="address.state" value={formData.address.state} onChange={handleInputChange} required />
        </label>
        <label className="property-form__label">
          Pincode:
          <input className="property-form__input" name="address.pincode" value={formData.address.pincode} onChange={handleInputChange} required />
        </label>
      </div>
      <div className="property-form__row">
        <label className="property-form__label">
          Latitude:
          <input className="property-form__input" name="geo.lat" value={formData.geo.lat} onChange={handleInputChange} required />
        </label>
        <label className="property-form__label">
          Longitude:
          <input className="property-form__input" name="geo.lng" value={formData.geo.lng} onChange={handleInputChange} required />
        </label>
      </div>
      <div className="property-form__row">
        <label className="property-form__label">
          Email:
          <input className="property-form__input" name="contact.email" value={formData.contact.email} onChange={handleInputChange} required />
        </label>
        <label className="property-form__label">
          Phone:
          <input className="property-form__input" name="contact.phone" value={formData.contact.phone} onChange={handleInputChange} required />
        </label>
      </div>
      <div className="property-form__row">
        <label className="property-form__label">
          Description:
          <input className='property-form__input' name='description' value={formData.description} onChange={handleInputChange} required/>
        </label>
      </div>
      <div className="property-form__row">
        <label className="property-form__label">
          Images:
          <input className='property-form__input' name='images' type='file' accept='image/*' multiple onChange={handleFileChange} />
        </label>
      </div>
      <div className="property-form__preview">
        <h4>Existing Images</h4>
        <div className="property-form__preview__container">
        {existingImages.map((img, index) => (
          <div key={index} className="property-form__preview__container--image-wrapper">
            <img src={`http://localhost:5000/${img.path}`} alt="Existing"  className="property-form__preview__container--image-wrapper__prev-img"/>
            <button type="button" onClick={() => removeExistingImage(index)} className="property-form__preview__container--image-wrapper__remove-btn">x</button>
          </div>
        ))}
        </div>
      </div>
      <div className="property-form__preview">
      <h4>New Images</h4>
        <div className="property-form__preview__container"> 
        {newImages.map((img, index) => (
          <div key={index} className="property-form__preview__container--image-wrapper">
            <img src={img.preview} alt="New Upload"  className="property-form__preview__container--image-wrapper__prev-img"/>
            <button type="button" onClick={() => removeNewImage(index)} className="property-form__preview__container--image-wrapper__remove-btn">x</button>
          </div>
        ))}
        </div>
        </div>
      <div className="property-form__actions">
        <button className="property-form__button property-form__button--clear" type="button" >Clear</button>
        <button className="property-form__button property-form__button--save" type="submit">Save</button>
      </div>
    </form>
  );
}

export default AddPropertyDetailsForm;
