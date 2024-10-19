import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSpot } from '../../store/spots'; // Import your createSpot action
import { addImageToSpot } from '../../store/spots'; // Import your addImageToSpot action
import { useNavigate } from 'react-router-dom';
import './CreateSpotForm.css';

const CreateSpotForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use useNavigate hook
  const [formData, setFormData] = useState({
    country: '',
    address: '',
    city: '',
    state: '',
    name: '',
    description: '',
    price: '',
    previewImage: '',
    images: ['', '', '', ''], // Array for additional image URLs
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'images') {
      const index = e.target.dataset.index;
      const newImages = [...formData.images];
      newImages[index] = value;
      setFormData({ ...formData, images: newImages });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!formData.country) validationErrors.country = "Country is required";
    if (!formData.address) validationErrors.address = "Street Address is required";
    if (!formData.city) validationErrors.city = "City is required";
    if (!formData.state) validationErrors.state = "State is required";
    if (!formData.name) validationErrors.name = "Name of your spot is required";
    if (!formData.price) validationErrors.price = "Price per night is required";
    if (formData.description.length < 30) validationErrors.description = "Description needs 30 or more characters";
    if (!formData.previewImage) validationErrors.previewImage = "Preview Image URL is required";

   
    
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Dispatch the action to create a new spot
    const newSpot = await dispatch(createSpot({
      ownerId: 1, // Replace with the actual owner ID from your auth context
      country: formData.country,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      lat: 30,
      lng: 30
    }));

    if (newSpot) {
      // Add the preview image first
      await dispatch(addImageToSpot(newSpot.id, { url: formData.previewImage, preview: true }));
      
      // Add additional images
      for (let imageUrl of formData.images) {
        if (imageUrl) {
          await dispatch(addImageToSpot(newSpot.id, { url: imageUrl, preview: false }));
        }
      }
      
      // Navigate to the new spot's detail page after successful creation
      navigate(`/spots/${newSpot.id}`);
    }
  };

  return (
    <form className="create-spot-form" onSubmit={handleSubmit}>
      <h2>Create a New Spot</h2>
      
      <div>
        <h3>Where's your place located?</h3>
        <p>Guests will only get your exact address once they booked a reservation.</p>
        <label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder='Country'
          />
          {errors.country && <span className="error">{errors.country}</span>}
        </label>
        <label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder='Street Address'
          />
          {errors.address && <span className="error">{errors.address}</span>}
        </label>
        <label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder='City'
          />
          {errors.city && <span className="error">{errors.city}</span>}
        </label>
        <label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder='State'
          />
          {errors.state && <span className="error">{errors.state}</span>}
        </label>
      </div>

      <div>
        <h3>Describe your place to guests</h3>
        <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Please write at least 30 characters"
        />
        {errors.description && <span className="error">{errors.description}</span>}
      </div>

      <div>
        <h3>Create a title for your spot</h3>
        <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name of your spot"
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div>
        <h3>Set a base price for your spot</h3>
        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price per night (USD)"
        />
        {errors.price && <span className="error">{errors.price}</span>}
      </div>

      <div>
        <h3>Liven up your spot with photos</h3>
        <p>Submit a link to at least one photo to publish your spot.</p>
        <label>
          <input
            type="text"
            name="previewImage"
            value={formData.previewImage}
            onChange={handleChange}
            placeholder='Preview Image URL'
          />
          {errors.previewImage && <span className="error">{errors.previewImage}</span>}
        </label>
        {formData.images.map((image, index) => (
          <label key={index}>
            <input
              type="text"
              name="images"
              data-index={index}
              value={image}
              onChange={handleChange}
              placeholder='Image URL'
            />
            
          </label>
        ))}
      </div>

      <button type="submit">
        Create Spot
      </button>
    </form>
  );
};

export default CreateSpotForm;
