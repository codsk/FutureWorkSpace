import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./hostDashboard.scss";
import AddPropertyDetailsForm from "./addPropertyDetailsForm";

function HostDashboard() {
  const [data, setData] = useState(null);
  const [carouselIndices, setCarouselIndices] = useState({}); // Track carousel index per property
  const ownerId = sessionStorage.getItem('id');
  const navigate = useNavigate();
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [propertyData, setPropertyData] = useState(null);

  const handleOpenPropertyModal = () => setShowPropertyModal(true);
  const handleClosePropertyModal = () => {setShowPropertyModal(false); setPropertyData(null);}

  function handleSaveSpace(formData,type) {
    const form = new FormData();

    const {
      name,
      description,
      address,
      contact,
      geo,
      existingImages = [],
      newImages = [],
      _id,
    } = formData;
    form.append('name', formData.name);
    form.append('address[street]', formData.address.street);
    form.append('address[city]', formData.address.city);
    form.append('address[state]', formData.address.state);
    form.append('address[pincode]', formData.address.pincode);
    form.append('contact[email]', formData.contact.email);
    form.append('contact[phone]', formData.contact.phone);
    form.append('description', formData.description);
    form.append('geo[lat]', formData.geo.lat);
    form.append('geo[lng]', formData.geo.lng);
    form.append('owner', ownerId);
    form.append("existingImages", JSON.stringify(existingImages));
    if (formData.images) {
      for (let i = 0; i < formData.images.length; i++) {
        form.append('images', formData.images[i]);
      }
    }
    const url = _id
    ? `http://localhost:5000/api/property/update/property/${_id}`
    : `http://localhost:5000/api/property/upload/propertyDetails/${ownerId}`;

  fetch(url, {
    method: _id ? "PUT" : "POST",
    body: form,
  })
    .then(res => res.json())
    .then(data => {
      _id ?
      alert("Property update successfully!") : alert("Property saved successfully!");
      fetchPlacesData();
      handleClosePropertyModal();
    })
    .catch(err => {
      console.error(err);
      _id ? 
      alert("Error updating property") : alert("Error saving property")
    });
  }

  const fetchPlacesData = async () => {
    const response = await fetch(
      `http://localhost:5000/api/property/get/propertyDetailsByOwnerId/${ownerId}`
    );
    const data = await response.json();

    if (data.properties) {
      const propertiesArray = Object.values(data.properties);
      setData(propertiesArray); 
      const initialCarouselIndices = propertiesArray.reduce((acc, place) => {
        acc[place._id] = 0; 
        return acc;
      }, {});
      setCarouselIndices(initialCarouselIndices);
    } else {
      console.error("No properties found in the response.");
    }
  };

  function managePlace(e) {
    navigate('/addSpaceDetails', { state: e });
  }

  function logout() {
    sessionStorage.clear();
    sessionStorage.setItem('isLogin', false);
    window.location.href = '/';
  }

  function handleEdit(place){
    setPropertyData(place);
    setShowPropertyModal(true);
  }

  function handleDelete(propertyId){
    const confirmDelete = window.confirm("Are you sure you want to delete this property?");
    if (confirmDelete) {
      fetch(`http://localhost:5000/api/property/delete/property/${propertyId}`, { 
        method: "DELETE"
      })
      .then(res => res.json())
      .then(data => {
        alert("Property deleted successfully!");
        fetchPlacesData();  
      })
      .catch(err => {
        console.error(err);
      });
    }
  }

  useEffect(() => {
    fetchPlacesData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (data && data.length > 0) {
        setCarouselIndices((prevIndices) => {
          return data.reduce((acc, place) => {
            if (place.image.length > 0) {
              acc[place._id] = (prevIndices[place._id] + 1) % place.image.length;
            }
            return acc;
          }, {});
        });
      }
    }, 3000); 

    return () => clearInterval(interval);
  }, [data]);

  const handleCarouselChange = (placeId, direction) => {
    setCarouselIndices((prevIndices) => {
      const currentIndex = prevIndices[placeId];
      const newIndex =
        (currentIndex + direction + data.find((place) => place._id === placeId).image.length) %
        data.find((place) => place._id === placeId).image.length;
      return { ...prevIndices, [placeId]: newIndex };
    });
  };

  return (
    <>
      <div className="hostDashboard">
        <div className="hostDashboard__header">
          <div className="hostDashboard__header--content">
            <h2 className="hostDashboard__header--content--title">Host Dashboard</h2>
            <div className="hostDashboard__header--content__buttons-wrapper">
              <button className="hostDashboard__header--content__buttons-wrapper--button" onClick={handleOpenPropertyModal}>Add Place</button>
              <button onClick={logout} className="hostDashboard__header--content__buttons-wrapper--button">Logout</button>
            </div>
          </div>
        </div>
        <div className="hostDashboard__content">
          <h4 className="hostDashboard__content--title">Manage Your Places</h4>
          <div className="hostDashboard__content__cards">
            {data?.map((place) => (
              <div className="hostDashboard__content__cards--card" key={place._id}>
                {place.image && place.image.length > 0 ? (
                  <>
                    <img
                      src={`http://localhost:5000/${place.image[carouselIndices[place._id]]?.path}`}
                      alt={place.name} 
                      className="hostDashboard__content__cards--card--property-image"
                    />
                    <div className="hostDashboard__content__cards--card__carousel-controls">
                      <button 
                        className="hostDashboard__content__cards--card__carousel-controls--carousel-button prev"
                        onClick={() => handleCarouselChange(place._id, -1)} // Decrease index (previous)
                      >
                        &#8592; 
                      </button>
                      <button 
                        className="hostDashboard__content__cards--card__carousel-controls--carousel-button next"
                        onClick={() => handleCarouselChange(place._id, 1)} // Increase index (next)
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
                <h2>Name: {place.name}</h2>
                <p>Address: {place.address.street}, {place.address.city}, {place.address.state}</p>
                <p>Avg Rating: {place.rating}</p>
                <div className='hostDashboard__content__cards--card--action-buttons'>
                  <button onClick={()=>handleEdit(place)}>Edit</button>
                  <button onClick={()=>handleDelete(place._id)}>Delete</button>
                </div>
                <button className='hostDashboard__content__cards--card--manage-button' onClick={() => managePlace(place._id)}>Manage Place</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Property Modal */}
      {showPropertyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">Add Property Details</span>
              <button className="modal-close" onClick={handleClosePropertyModal}>×</button>
            </div>
            <div className="modal-body">
              <AddPropertyDetailsForm onClose={handleClosePropertyModal} onSave={handleSaveSpace} propertyData={propertyData}/>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HostDashboard;
