import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

function ZoomControl() {
  const map = useMap();
  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button onClick={() => map.zoomIn()}>+</button>
        <button onClick={() => map.zoomOut()}>-</button>
      </div>
    </div>
  );
}

const Map = () => {
  const [studySpots, setStudySpots] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [position, setPosition] = useState([40.7128, -74.0060]); // Default position (New York City)
  const [radius, setRadius] = useState(1000); // Default radius

  useEffect(() => {
    const fetchStudySpots = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/study_spots', {
          lat: position[0],
          lon: position[1],
          radius: radius,
        });
        setStudySpots(response.data.elements);
      } catch (error) {
        console.error('Error fetching study spots:', error);
      }
    };

    fetchStudySpots();
  }, [position, radius]);

  const handleSearch = async () => {
    const response = await axios.post('http://127.0.0.1:8000/api/study_spots', {
      lat: position[0],
      lon: position[1],
      radius: radius,
    });
    setStudySpots(response.data.elements);
  };

  return (
    <div>
      <div className="p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a location"
          className="p-2 border rounded mr-2"
        />
        <button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded">Search</button>
      </div>

      <MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {studySpots.map((spot) => (
          <Marker key={spot.id} position={[spot.lat, spot.lon]}>
            <Popup>{spot.tags.name || 'Unnamed Spot'}</Popup>
          </Marker>
        ))}
        <ZoomControl />
      </MapContainer>
    </div>
  );
};

export default Map;
