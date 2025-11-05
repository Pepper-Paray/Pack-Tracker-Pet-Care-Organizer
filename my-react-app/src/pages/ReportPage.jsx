import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const ReportPage = () => {
  const [externalData, setExternalData] = useState([]);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
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
    }
  };

  // Map example: Transform data for display
  const formattedUserData = userData.map(item => ({
    ...item,
    created_at: new Date(item.created_at).toLocaleDateString()
  }));

  // Reduce example: Calculate totals
  const totalPets = userData.reduce((acc, curr) => acc + 1, 0);

  // Filter example: Show only active records
  const activeRecords = userData.filter(item => item.status === 'active');

  return (
    <div className="container mt-4">
      <h2>Report Page</h2>
      
      <div className="row">
        <div className="col-md-6">
          <h3>External Data</h3>
          <div className="list-group">
            {externalData.map(item => (
              <div key={item.id} className="list-group-item">
                <h5>{item.name}</h5>
                <p>{item.description}</p>
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