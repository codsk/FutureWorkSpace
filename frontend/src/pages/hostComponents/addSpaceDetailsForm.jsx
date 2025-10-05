import React, { useState } from "react";
import "./addSpaceDetailsForm.scss";

const initialState = {
  spaceType: "",
  floor: "",
  roomNumber: "",
  capacity: "",
  amenities: [],
  pricePerSeat: {
    perHour: "",
    perDay: "",
    perWeek: "",
    perMonth: "",
    perThreeMonths: "",
    perSixMonths: "",
    perOneYear: ""
  },
  discountPercentage: {
    perHour: "",
    perDay: "",
    perWeek: "",
    perMonth: "",
    perThreeMonths: "",
    perSixMonths: "",
    perOneYear: ""
  },
  description: "",
  availableDays: [],
  availableTimes: { start: "", end: "" },
  availability: [],
  isActive: true
};

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const AddSpaceDetailsForm = ({ onClose, onSave, propertyData }) => {
  const [form, setForm] = useState(initialState);
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("pricePerSeat.")) {
      setForm({
        ...form,
        pricePerSeat: {
          ...form.pricePerSeat,
          [name.split(".")[1]]: value
        }
      });
    } else if (name.startsWith("discountPercentage.")) {
      setForm({
        ...form,
        discountPercentage: {
          ...form.discountPercentage,
          [name.split(".")[1]]: value
        }
      });
    } else if (name === "isActive") {
      setForm({ ...form, isActive: checked });
    } else if (name === "amenities") {
      setForm({ ...form, amenities: value.split(",").map(a => a.trim()) });
    } else if (name === "availableDays") {
      const days = [...form.availableDays];
      if (checked) {
        days.push(value);
      } else {
        const idx = days.indexOf(value);
        if (idx > -1) days.splice(idx, 1);
      }
      setForm({ ...form, availableDays: days });
    } else if (name === "availableTimes.start" || name === "availableTimes.end") {
      setForm({
        ...form,
        availableTimes: {
          ...form.availableTimes,
          [name.split(".")[1]]: value
        }
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleClear = () => setForm(initialState);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalFormData = {
      ...form,
      images: newImages.map((img)=>img.file),
      existingImages
    };
    console.log(finalFormData)
    propertyData ?  onSave(finalFormData, 'updata') : onSave(finalFormData, 'save')
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previewFiles = files.map((file)=>({
      file,
      preview: URL.createObjectURL(file)
    }));
    setNewImages((prev)=> [...prev, ...previewFiles]);
  }

  const removeExistingImage = (index)=> {
    setExistingImages((prev)=> prev.filter((_,i) => i !== index))
  }

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <form className="add-space-form" onSubmit={handleSubmit}>
      <div className="add-space-form__row">
        <label className="add-space-form__label">
          Space Type:
          <input className="add-space-form__input" name="spaceType" value={form.spaceType} onChange={handleChange} required />
        </label>
        <label className="add-space-form__label">
          Floor:
          <input className="add-space-form__input" name="floor" value={form.floor} onChange={handleChange} required />
        </label>
        <label className="add-space-form__label">
          Room Number:
          <input className="add-space-form__input" name="roomNumber" value={form.roomNumber} onChange={handleChange} required />
        </label>
        <label className="add-space-form__label">
          Capacity:
          <input className="add-space-form__input" name="capacity" type="number" value={form.capacity} onChange={handleChange} required />
        </label>
      </div>
      <div className="add-space-form__row">
        <label className="add-space-form__label" >
          Amenities (comma separated):
          <input className="add-space-form__input" name="amenities" value={form.amenities.join(", ")} onChange={handleChange} />
        </label>
      </div>
      <fieldset className="add-space-form__fieldset">
        <legend className="add-space-form__legend">Price Per Seat</legend>
        <div className="add-space-form__row">
          {Object.keys(form.pricePerSeat).map(key => (
            <label className="add-space-form__label" key={key}>
              {key}:
              <input
                className="add-space-form__input"
                name={`pricePerSeat.${key}`}
                type="number"
                value={form.pricePerSeat[key]}
                onChange={handleChange}
              />
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="add-space-form__fieldset">
        <legend className="add-space-form__legend">Discount Percentage</legend>
        <div className="add-space-form__row">
          {Object.keys(form.discountPercentage).map(key => (
            <label className="add-space-form__label" key={key}>
              {key}:
              <input
                className="add-space-form__input"
                name={`discountPercentage.${key}`}
                type="number"
                value={form.discountPercentage[key]}
                onChange={handleChange}
              />
            </label>
          ))}
        </div>
      </fieldset>
      <label className="add-space-form__label">
        Description:
        <textarea className="add-space-form__textarea" name="description" value={form.description} onChange={handleChange} required />
      </label>
      <fieldset className="add-space-form__fieldset">
        <legend className="add-space-form__legend">Available Days</legend>
        <div className="add-space-form__row">
          {daysOfWeek.map(day => (
            <label className="add-space-form__checkbox-label" key={day}>
              <input
                className="add-space-form__checkbox"
                type="checkbox"
                name="availableDays"
                value={day}
                checked={form.availableDays.includes(day)}
                onChange={handleChange}
              />
              {day}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="add-space-form__row">
        <label className="add-space-form__label">
          Available Time Start:
          <input
            className="add-space-form__input"
            name="availableTimes.start"
            type="time"
            value={form.availableTimes.start}
            onChange={handleChange}
          />
        </label>
        <label className="add-space-form__label">
          Available Time End:
          <input
            className="add-space-form__input"
            name="availableTimes.end"
            type="time"
            value={form.availableTimes.end}
            onChange={handleChange}
          />
        </label>
        <label className="add-space-form__label" style={{alignItems: "center", flexDirection: "row", gap: "0.5rem"}}>
          Is Active:
          <input
            className="add-space-form__checkbox"
            name="isActive"
            type="checkbox"
            checked={form.isActive}
            onChange={handleChange}
          />
        </label>
      </div>
      <label className="add-space-form__label">
        Images:
        <input className="add-space-form__images" name="images" type="file" accept="image/*" multiple onChange={handleFileChange} required />
      </label>
      <label className="add-space-form__label">
        Existing Images:
        <div>
          {existingImages.map((img, index) => (
          <div key={index} className="property-form__preview__container--image-wrapper">
            <img src={`http://localhost:5000/${img.path}`} alt="Existing"  className="property-form__preview__container--image-wrapper__prev-img"/>
            <button type="button" onClick={() => removeExistingImage(index)} className="property-form__preview__container--image-wrapper__remove-btn">x</button>
          </div>
        ))}
        </div>
      </label>
      <label className="add-space-form__label">
        Newly Added Images:
        <div>
          {newImages.map((img, index) => (
            <div>
              <img src={img.preview} alt="New Upload" />
              <button type="button" onClick={()=>removeNewImage(index)}>X</button>
            </div>
          ))
          }
        </div>
      </label>
      <div style={{ marginTop: "1rem" }}>
        <button className="add-space-form__button add-space-form__button--clear" type="button" onClick={handleClear}>Clear</button>
        <button className="add-space-form__button add-space-form__button--save" type="submit" style={{ marginLeft: "1rem" }}>Save</button>
      </div>
    </form>
  );
};

export default AddSpaceDetailsForm;