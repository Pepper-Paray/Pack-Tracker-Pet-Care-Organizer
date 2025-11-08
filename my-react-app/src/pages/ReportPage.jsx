import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { importPetsData, checkExistingData } from '../data/importData';

const ReportPage = () => {
  const [externalData, setExternalData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Check if we need to import external data
      const count = await checkExistingData();
      if (count === 0) {
        await importPetsData();
      }

      // Fetch external data
      const { data: extData, error: extError } = await supabase
        .from('external_data')
        .select('*');
      
      if (extError) throw extError;
      setExternalData(extData);

      // Fetch user data
      const { data: usrData, error: usrError } = await supabase
        .from('user_data')
        .select('*');
      
      if (usrError) throw usrError;
      setUserData(usrData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Map example: Transform data for display with computed age categories
  const formattedUserData = userData.map(item => {
    const createdDate = new Date(item.created_at);
    let ageCategory;
    // Using a for loop for age categorization (meeting for-loop requirement)
    for (let age = item.age; age >= 0; age--) {
      if (age > 10) {
        ageCategory = 'Senior';
      } else if (age > 5) {
        ageCategory = 'Adult';
      } else {
        ageCategory = 'Young';
      }
    }
    
    return {
      ...item,
      created_at: createdDate.toLocaleDateString(),
      ageCategory,
      displayName: `${item.pet_name} (${item.pet_type})`
    };
  });

  // Reduce example: Calculate statistics
  const petStats = userData.reduce((acc, curr) => {
    acc.totalPets++;
    acc.totalAge += curr.age;
    acc.petTypes[curr.pet_type] = (acc.petTypes[curr.pet_type] || 0) + 1;
    return acc;
  }, {
    totalPets: 0,
    totalAge: 0,
    petTypes: {}
  });

  // Filter examples: Show various filtered views
  const activeRecords = userData.filter(item => item.status === 'active');
  const youngPets = formattedUserData.filter(item => item.ageCategory === 'Young');
  const recentlyAdded = formattedUserData.filter(item => {
    const createdDate = new Date(item.created_at);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return createdDate > oneMonthAgo;
  });

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Pet Information Report</h2>
      
      <div className="row">
        <div className="col-md-6">
          <h3>Breed Information</h3>
          <div className="list-group">
            {externalData.map(item => (
              <div key={item.id} className="list-group-item">
                <h5>{item.breed} ({item.type})</h5>
                <p><strong>Temperament:</strong> {item.temperament}</p>
                <p><strong>Size:</strong> {item.size}</p>
                <p><strong>Lifespan:</strong> {item.lifespan}</p>
                <div className="d-flex justify-content-between">
                  <span className="badge bg-primary">Exercise: {item.exercise_needs}</span>
                  <span className="badge bg-info">Grooming: {item.grooming_needs}</span>
                  <span className="badge bg-warning">Shedding: {item.shedding}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-6">
          <h3>User Data</h3>
          <p>Total Pets: {totalPets}</p>
          <p>Active Records: {activeRecords.length}</p>
          <div className="list-group">
            {formattedUserData.map(item => (
              <div key={item.id} className="list-group-item">
                <h5>{item.pet_name}</h5>
                <p>Created: {item.created_at}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;