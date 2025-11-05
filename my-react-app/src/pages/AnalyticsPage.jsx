import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsPage = () => {
  const [petData, setPetData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPetData();
  }, []);

  const fetchPetData = async () => {
    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('*');
      
      if (error) throw error;
      setPetData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pet data:', error);
      setLoading(false);
    }
  };

  // Data processing using reduce
  const petTypeCount = petData.reduce((acc, pet) => {
    acc[pet.pet_type] = (acc[pet.pet_type] || 0) + 1;
    return acc;
  }, {});

  const ageRanges = petData.reduce((acc, pet) => {
    const age = parseInt(pet.age);
    if (age <= 2) acc['0-2 years']++;
    else if (age <= 5) acc['3-5 years']++;
    else if (age <= 10) acc['6-10 years']++;
    else acc['10+ years']++;
    return acc;
  }, {
    '0-2 years': 0,
    '3-5 years': 0,
    '6-10 years': 0,
    '10+ years': 0
  });

  const barChartData = {
    labels: Object.keys(petTypeCount),
    datasets: [
      {
        label: 'Number of Pets by Type',
        data: Object.values(petTypeCount),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const pieChartData = {
    labels: Object.keys(ageRanges),
    datasets: [
      {
        data: Object.values(ageRanges),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
      },
    ],
  };

  if (loading) {
    return <div className="container mt-4">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Analytics Dashboard</h2>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Pet Types Distribution</h3>
              <Bar data={barChartData} />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Age Distribution</h3>
              <Pie data={pieChartData} />
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Summary Statistics</h3>
              <div className="row">
                <div className="col-md-3">
                  <div className="card bg-primary text-white">
                    <div className="card-body">
                      <h5>Total Pets</h5>
                      <h2>{petData.length}</h2>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-success text-white">
                    <div className="card-body">
                      <h5>Pet Types</h5>
                      <h2>{Object.keys(petTypeCount).length}</h2>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-info text-white">
                    <div className="card-body">
                      <h5>Average Age</h5>
                      <h2>
                        {(petData.reduce((acc, pet) => acc + parseInt(pet.age), 0) / petData.length).toFixed(1)}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;