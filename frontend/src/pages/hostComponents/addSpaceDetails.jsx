import { useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import "./addSpaceDetails.scss";
import AddSpaceDetailsForm from "./addSpaceDetailsForm";
const AddSpaceDetails = () => {
  const location = useLocation();
  const propertyId = location.state;
  const [spaces,setSpaces] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [propertyData, setPropertyData] = useState(null);
  const [carouselIndices, setCarouselIndices] = useState({});

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {setShowModal(false); setPropertyData(null);}

  const getSpacesData = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/space/getSpaces/${propertyId}`);
    const data = await response.json();
    debugger;
    // Support both shapes: older mongoose document (with _doc.spaces)
    // and plain object returned via .lean() (spaces.spaces).
    if (data.spaces) {
      const spacesArray = Array.isArray(data.spaces.spaces)
        ? data.spaces.spaces
        : (data.spaces._doc && Array.isArray(data.spaces._doc.spaces) ? data.spaces._doc.spaces : null);

      if (Array.isArray(spacesArray)) {
        setSpaces(spacesArray);
        // initialize carousel indices for each space so rendering has a safe index
        const initialIndices = spacesArray.reduce((acc, sp) => {
          acc[sp._id] = 0;
          return acc;
        }, {});
        setCarouselIndices(initialIndices);
      } else {
        console.log('No valid spaces array found in the response.', data);
      }
    } else {
      console.log('No spaces key in response', data);
    }
  } catch (error) {
    console.error('Error fetching spaces:', error);
  }
};


  const handleSaveSpace = (formData) => {
    const form = new FormData();
    const {
    spaceType,
    floor,
    roomNumber,
    capacity,
    amenities = [],
    pricePerSeat = {},
    discountPercentage = {},
    images = [],
    description,
    availableDays = [],
    availableTimes = {},
    availability = [],
    isActive
  } = formData;
  form.append("spaceType", formData.spaceType);
  form.append("floor", formData.floor);
  form.append("roomNumber", formData.roomNumber);
  form.append("capacity", formData.capacity);
  form.append("description", formData.description);
  form.append("isActive", formData.isActive);

  // Append pricePerSeat
  Object.keys(formData.pricePerSeat).forEach(key => {
    form.append(`pricePerSeat[${key}]`, formData.pricePerSeat[key]);
  });

  // Append discountPercentage
  Object.keys(formData.discountPercentage).forEach(key => {
    form.append(`discountPercentage[${key}]`, formData.discountPercentage[key]);
  });

  // Append amenities (array of strings)
  formData.amenities.forEach((amenity, index) => {
    form.append(`amenities[${index}]`, amenity);
  });

  // Append availableDays (array of strings)
  formData.availableDays.forEach((day, index) => {
    form.append(`availableDays[${index}]`, day);
  });

  // Append availableTimes
  if (formData.availableTimes.start) form.append("availableTimes[start]", formData.availableTimes.start);
  if (formData.availableTimes.end) form.append("availableTimes[end]", formData.availableTimes.end);

  // Append availability (array of ObjectIds or strings)
  formData.availability.forEach((id, index) => {
    form.append(`availability[${index}]`, id);
  });

  // Append images (new file uploads)
  formData.images.forEach((image, index) => {
    form.append("images", image);  // Backend must accept `images` as an array
  });
  console.log(formData);
  console.log(form);
    fetch(`http://localhost:5000/api/space/addSpace/${propertyId}`, {
      method: "POST",
      body: form,
      // Do NOT set the Content-Type header for multipart/form-data —
      // let the browser set the boundary automatically.
    })
    .then(res => res.json())
    .then(data => {
      alert("Space added successfully!");
      getSpacesData();
      setShowModal(false);
    })
    .catch(err => {
      console.error(err);
    });
  };

  function navigateToDashboard(){
    window.location.href = '/hostDashboard';
  }

  function handleEdit(space){
    setPropertyData(space);
    setShowModal(true);
  }

  useEffect(()=>{
    getSpacesData();
  },[]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (spaces && spaces.length > 0) {
        setCarouselIndices((prevIndices) => {
          return spaces.reduce((acc, space) => {
            if (space.images.length > 0) {
              acc[space._id] = (prevIndices[space._id] + 1) % space.images.length;
            }
            return acc;
          }, {});
        });
      }
    }, 3000); 

    return () => clearInterval(interval);
  }, [spaces]);

  const handleCarouselChange = (spaceId, direction) => {
    setCarouselIndices((prevIndices) => {
      const currentIndex = prevIndices[spaceId];
      const newIndex =
        (currentIndex + direction + spaces.find((place) => place._id === spaceId).images.length) %
        spaces.find((space) => space._id === spaceId).images.length;
      return { ...prevIndices, [spaceId]: newIndex };
    });
  };  

  return(
    <>
      <div className='space'>
        <div className="space__header">
          <h1>Manage your spaces</h1>
          <div className="space__header__button">
            <button onClick={navigateToDashboard}>Dashboard</button>
            <button className="space__header__button--btn"   onClick={handleOpenModal}>Add New Space</button>
          </div>
        </div>
        <div className="space__content">
          <div className="space__content__cards">
            {spaces?.map(space => (
              <div key={space._id} className="space-card">
                {space.images && space.images.length > 0 ? (
                  <>
                    <img
                      src={`http://localhost:5000/${space.images[(carouselIndices[space._id] ?? 0)]?.path}`}
                      alt={space.name}
                      className="hostDashboard__content__cards--card--property-image"
                    />
                    <div className="hostDashboard__content__cards--card__carousel-controls">
                      <button 
                        className="hostDashboard__content__cards--card__carousel-controls--carousel-button prev"
                        onClick={() => handleCarouselChange(space._id, -1)} // Decrease index (previous)
                      >
                        &#8592; 
                      </button>
                      <button 
                        className="hostDashboard__content__cards--card__carousel-controls--carousel-button next"
                        onClick={() => handleCarouselChange(space._id, 1)} // Increase index (next)
                      >
                        &#8594; 
                      </button>
                    </div>
                  </>
                ) : (
                  <img 
                    src="https://via.placeholder.com/200"
                    alt="No image available"
                    className="hostDashboard__content__cards--card--property-image" 
                  />
                )}
                <h3>{space.spaceType} - {space.roomNumber}</h3>
                <p><strong>Floor:</strong> {space.floor}</p>
                <p><strong>Capacity:</strong> {space.capacity}</p>
                <p><strong>Description:</strong> {space.description}</p>
                <p><strong>Amenities:</strong> {space.amenities.join(', ')}</p>
                <p><strong>Available Days:</strong> {space.availableDays.join(', ')}</p>
                <p><strong>Available Times:</strong> {space.availableTimes.start} - {space.availableTimes.end}</p>
                <p><strong>Price Per Seat:</strong> Hour: {space.pricePerSeat.perHour}, Day: {space.pricePerSeat.perDay}, Week: {space.pricePerSeat.perWeek}</p>
                <p><strong>Discount:</strong> Day: {space.discountPercentage.perDay}%, Week: {space.discountPercentage.perWeek}%</p>
                <p><strong>Active:</strong> {space.isActive ? 'Yes' : 'No'}</p>
                <div className="space-card__actions">
                  <button className="edit-button" onClick={()=>handleEdit(space)}>Edit</button>
                  <button className="delete-button">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">Add Space Details</span>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              <AddSpaceDetailsForm onClose={handleCloseModal} onSave={handleSaveSpace} propertyData={propertyData}/>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddSpaceDetails;