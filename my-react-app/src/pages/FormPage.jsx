import { useState } from 'react';
import { supabase } from '../config/supabase';

const FormPage = () => {
  const [formData, setFormData] = useState({
    pet_name: '',
    pet_type: '',
    age: '',
    special_needs: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.pet_name.trim()) {
      newErrors.pet_name = 'Pet name is required';
    }
    if (!formData.pet_type.trim()) {
      newErrors.pet_type = 'Pet type is required';
    }
    if (!formData.age || isNaN(formData.age)) {
      newErrors.age = 'Valid age is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { error } = await supabase
        .from('user_data')
        .insert([formData])
        .select();

      if (error) throw error;

      alert('Pet added successfully!');
      // Reset form
      setFormData({
        pet_name: '',
        pet_type: '',
        age: '',
        special_needs: '',
        status: 'active'
      });
      setErrors({});

    } catch (error) {
      console.error('Error inserting data:', error);
      alert('Error adding pet. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Pet</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label htmlFor="pet_name" className="form-label">Pet Name*</label>
          <input
            type="text"
            className={`form-control ${errors.pet_name ? 'is-invalid' : ''}`}
            id="pet_name"
            name="pet_name"
            value={formData.pet_name}
            onChange={handleChange}
          />
          {errors.pet_name && <div className="invalid-feedback">{errors.pet_name}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="pet_type" className="form-label">Pet Type*</label>
          <input
            type="text"
            className={`form-control ${errors.pet_type ? 'is-invalid' : ''}`}
            id="pet_type"
            name="pet_type"
            value={formData.pet_type}
            onChange={handleChange}
          />
          {errors.pet_type && <div className="invalid-feedback">{errors.pet_type}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="age" className="form-label">Age*</label>
          <input
            type="number"
            className={`form-control ${errors.age ? 'is-invalid' : ''}`}
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
          {errors.age && <div className="invalid-feedback">{errors.age}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="special_needs" className="form-label">Special Needs</label>
          <textarea
            className="form-control"
            id="special_needs"
            name="special_needs"
            value={formData.special_needs}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <button type="submit" className="btn btn-primary">Add Pet</button>
      </form>
    </div>
  );
};

export default FormPage;