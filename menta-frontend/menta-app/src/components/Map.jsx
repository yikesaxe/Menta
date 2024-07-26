import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from 'react-leaflet-cluster';
import PlacesAutocomplete from 'react-places-autocomplete';

// Function to load Google Maps script
const loadGoogleMapsScript = (apiKey, callback) => {
  const existingScript = document.getElementById('googleMaps');

  if (!existingScript) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.id = 'googleMaps';
    document.body.appendChild(script);
    script.onload = () => {
      if (callback) callback();
    };
  }

  if (existingScript && callback) callback();
};

function ZoomControl() {
  const map = useMapEvents({
    moveend: () => {},
  });

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
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');

  const fetchStudySpots = async (bounds) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/study_spots', {
        bounds: bounds,
      });
      console.log('Fetched study spots:', response.data.elements);
      setStudySpots(response.data.elements);
    } catch (error) {
      console.error('Error fetching study spots:', error);
    }
  };

  useEffect(() => {
    const fetchInitialPosition = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setPosition([latitude, longitude]);
            fetchStudySpots(getBoundsCoords([latitude, longitude], 1000));
          },
          (error) => {
            console.error('Error getting user location:', error);
            const defaultPosition = [40.7128, -74.0060];
            setPosition(defaultPosition);
            fetchStudySpots(getBoundsCoords(defaultPosition, 1000));
          }
        );
      } else {
        const defaultPosition = [40.7128, -74.0060];
        setPosition(defaultPosition);
        fetchStudySpots(getBoundsCoords(defaultPosition, 1000));
      }
    };

    fetchInitialPosition();
  }, []);

  useEffect(() => {
    loadGoogleMapsScript(process.env.REACT_APP_GOOGLE_API_KEY);
  }, []);

  const getBoundsCoords = (center, radius) => {
    const latRadian = radius / 111000;
    const lonRadian = radius / (111320 * Math.cos((center[0] * Math.PI) / 180));
    return {
      southwest: [center[0] - latRadian, center[1] - lonRadian],
      northeast: [center[0] + latRadian, center[1] + lonRadian],
    };
  };

  const handleSearch = async (address) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK') {
        const { lat, lng } = results[0].geometry.location;
        const newCoords = [lat(), lng()];
        setPosition(newCoords);
        const bounds = getBoundsCoords(newCoords, 1000);
        fetchStudySpots(bounds);
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  const handleSelect = async (address) => {
    setAddress(address);
    handleSearch(address);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        const bounds = getBoundsCoords([lat, lng], 1000);
        fetchStudySpots(bounds);
      },
    });
    return null;
  };

  const UpdateMapPosition = ({ position }) => {
    const map = useMap();
    useEffect(() => {
      if (position) {
        map.setView(position, 13);
      }
    }, [position, map]);
    return null;
  };

  if (!position) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="relative mt-5">
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-10 p-4">
        <PlacesAutocomplete
          value={address}
          onChange={setAddress}
          onSelect={handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div className="relative flex items-center">
              <input
                {...getInputProps({
                  placeholder: 'Search Places ...',
                  className: 'location-search-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6'
                })}
              />
              <button onClick={() => handleSearch(address)} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
                Search
              </button>
              <div className="autocomplete-dropdown-container absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg" style={{ transform: 'translateY(150px)' }}>
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => {
                  const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                  const style = suggestion.active
                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </div>

      <div className="map-container relative z-0">
        <MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }} className="relative z-0">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MarkerClusterGroup>
            {studySpots.map((spot) => (
              <Marker key={spot.id} position={[spot.lat, spot.lon]}>
                <Popup>{spot.tags.name || 'Unnamed Spot'}</Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
          <ZoomControl />
          <MapClickHandler />
          <UpdateMapPosition position={position} />
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
