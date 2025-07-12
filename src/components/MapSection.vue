<template>
  <div class="map-section">
    <div class="map-container" ref="mapContainer" id="map"></div>
    <div class="map-controls">
      <button @click="zoomIn" class="control-button">
        <i class="fa fa-plus"></i>
      </button>
      <button @click="zoomOut" class="control-button">
        <i class="fa fa-minus"></i>
      </button>
      <button @click="toggleSatellite" class="control-button satellite">
        <i class="fa fa-globe"></i>
      </button>
    </div>
    <div class="map-stats">
      <div class="stat-item">
        <i class="fa fa-fire"></i> 2.2K+
      </div>
      <div class="stat-item">
        <i class="fa fa-home"></i> 246.9K+
      </div>
      <div class="stat-item">
        <i class="fa fa-building"></i> 3.6K+
      </div>
      <div class="stat-item">
        <i class="fa fa-chart-line"></i> 37.7K+
      </div>
      <div class="stat-item">
        <i class="fa fa-dollar-sign"></i> 685.7K+
      </div>
    </div>
    <div class="map-type-toggle">
      <button 
        :class="['map-type-btn', { active: mapType === 'roadmap' }]" 
        @click="setMapType('roadmap')"
      >
        Map
      </button>
      <button 
        :class="['map-type-btn', { active: mapType === 'satellite' }]" 
        @click="setMapType('satellite')"
      >
        Satellite
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const mapContainer = ref(null);
let map = null;
let markers = [];
const mapType = ref('roadmap');

// Sample listing data with geo coordinates
const listings = [
  { 
    id: 1, 
    lat: 40.7128, 
    lng: -74.0060, 
    price: '399K', 
    alert: false,
    bedrooms: 3,
    bathrooms: 1,
    sqft: 888,
    address: '5638 Meisenbach Drive'
  },
  { 
    id: 2, 
    lat: 40.7200, 
    lng: -73.9800, 
    price: '425K', 
    alert: true,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1593,
    address: '4052 Providence Road'
  },
  { 
    id: 3, 
    lat: 40.7300, 
    lng: -73.9900, 
    price: '614K', 
    alert: true,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2513,
    address: '789 Oak Dr'
  },
  { 
    id: 4, 
    lat: 40.7150, 
    lng: -74.0150, 
    price: '327K', 
    alert: false,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1686,
    address: '101 Cedar Ln'
  },
  { 
    id: 5, 
    lat: 40.7250, 
    lng: -74.0100, 
    price: '629K', 
    alert: false,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2100,
    address: '250 Pine Street'
  },
];

function initMap() {
  if (!window.google || !window.google.maps) {
    // Load Google Maps API if not already loaded
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?callback=initGoogleMap`;
    script.defer = true;
    document.head.appendChild(script);
    
    // Define the callback function
    window.initGoogleMap = () => {
      setupMap();
    };
  } else {
    setupMap();
  }
}

function setupMap() {
  const mapOptions = {
    center: { lat: 40.7200, lng: -74.0000 }, // NYC area
    zoom: 13,
    mapTypeId: mapType.value,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: false,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  };

  map = new window.google.maps.Map(mapContainer.value, mapOptions);

  // Add markers for each property
  listings.forEach(listing => {
    addMarker(listing);
  });

  // Add event listener for map click
  map.addListener('click', () => {
    // Close any open info windows
    markers.forEach(marker => {
      if (marker.infoWindow) {
        marker.infoWindow.close();
      }
    });
  });

  // Add bounds changed listener for responsive behavior
  map.addListener('bounds_changed', () => {
    // You can update UI elements based on current map bounds
  });
}

function addMarker(listing) {
  const markerIcon = {
    path: 'M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,11.5,12,11.5z',
    fillColor: listing.alert ? '#ff7700' : '#0061e4',
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: '#ffffff',
    scale: 1.5,
    anchor: new window.google.maps.Point(12, 22),
  };

  const marker = new window.google.maps.Marker({
    position: { lat: listing.lat, lng: listing.lng },
    map: map,
    icon: markerIcon,
    label: {
      text: listing.price,
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: '12px'
    },
    animation: window.google.maps.Animation.DROP
  });

  // Create info window content
  const infoWindowContent = `
    <div class="info-window">
      <h3>$${listing.price}</h3>
      <div class="info-details">
        <span>${listing.bedrooms} bd</span>
        <span>${listing.bathrooms} ba</span>
        <span>${listing.sqft.toLocaleString()} sqft</span>
      </div>
      <p class="info-address">${listing.address}</p>
      ${listing.alert ? '<p class="alert">Deal Alert!</p>' : ''}
    </div>
  `;

  // Create info window
  const infoWindow = new window.google.maps.InfoWindow({
    content: infoWindowContent,
    maxWidth: 250
  });

  // Store info window with marker
  marker.infoWindow = infoWindow;

  // Add click event to markers
  marker.addListener('click', () => {
    // Close all other info windows first
    markers.forEach(m => {
      if (m !== marker && m.infoWindow) {
        m.infoWindow.close();
      }
    });
    
    // Open this info window
    infoWindow.open(map, marker);
  });

  // Add hover effects
  marker.addListener('mouseover', () => {
    marker.setZIndex(window.google.maps.Marker.MAX_ZINDEX + 1);
    marker.setIcon({
      ...markerIcon,
      scale: 1.8,
    });
  });

  marker.addListener('mouseout', () => {
    marker.setIcon(markerIcon);
  });

  markers.push(marker);
}

function zoomIn() {
  if (map) {
    const currentZoom = map.getZoom();
    map.setZoom(currentZoom + 1);
  }
}

function zoomOut() {
  if (map) {
    const currentZoom = map.getZoom();
    map.setZoom(currentZoom - 1);
  }
}

function toggleSatellite() {
  if (map) {
    mapType.value = mapType.value === 'roadmap' ? 'satellite' : 'roadmap';
    map.setMapTypeId(mapType.value);
  }
}

function setMapType(type) {
  if (map) {
    mapType.value = type;
    map.setMapTypeId(type);
  }
}

// Watch for changes in map type
watch(mapType, (newType) => {
  if (map) {
    map.setMapTypeId(newType);
  }
});

// Lifecycle hooks
onMounted(() => {
  initMap();
  
  // Add font awesome for icons if not already added
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(link);
  }

  // Handle window resize for responsive behavior
  function handleResize() {
    if (map && mapContainer.value) {
      // Trigger resize event to make map responsive
      window.google.maps.event.trigger(map, 'resize');
    }
  }

  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // Clean up
  if (map) {
    // Remove event listeners
    markers.forEach(marker => {
      window.google.maps.event.clearInstanceListeners(marker);
    });
    
    // Remove window resize listener
    window.removeEventListener('resize', handleResize);
  }
});
</script>

<style scoped>
.map-section {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 150px);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.map-container {
  width: 100%;
  height: 100%;
}

.map-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
}

.control-button {
  background-color: white;
  border: none;
  border-radius: 4px;
  padding: 8px;
  width: 36px;
  height: 36px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: transform 0.2s, background-color 0.2s;
}

.control-button:hover {
  background-color: #f8f8f8;
  transform: scale(1.05);
}

.control-button.satellite {
  color: #0061e4;
}

.map-stats {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  gap: 10px;
  z-index: 10;
  flex-wrap: wrap;
  max-width: 70%;
}

.stat-item {
  background-color: white;
  border-radius: 20px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.5s ease;
  transition: transform 0.2s, background-color 0.2s;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.map-type-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  z-index: 10;
}

.map-type-btn {
  border: none;
  background: transparent;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.map-type-btn.active {
  background-color: #0061e4;
  color: white;
}

/* Info window styling */
:deep(.info-window) {
  padding: 12px;
  max-width: 220px;
  font-family: Arial, sans-serif;
}

:deep(.info-window h3) {
  margin: 0 0 8px;
  font-size: 18px;
  color: #2a2a33;
}

:deep(.info-details) {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
}

:deep(.info-address) {
  margin: 0 0 8px;
  font-size: 13px;
  color: #666;
}

:deep(.info-window .alert) {
  color: #ff7700;
  font-weight: bold;
  margin: 5px 0 0;
}

/* Animation for markers */
@keyframes bounce {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}

/* Responsive styles for different screen sizes */
@media (min-width: 1200px) {
  .map-section {
    height: 650px;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .map-section {
    height: 600px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .map-section {
    height: 500px;
  }
  
  .stat-item {
    padding: 7px 10px;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .map-section {
    height: 400px;
  }
  
  .map-stats {
    flex-wrap: wrap;
    max-width: calc(100% - 40px);
    gap: 5px;
    top: 15px;
    left: 15px;
  }
  
  .stat-item {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .map-controls {
    bottom: 15px;
    right: 15px;
  }
  
  .control-button {
    width: 32px;
    height: 32px;
    padding: 6px;
  }
  
  .map-type-toggle {
    top: 15px;
    right: 15px;
  }
  
  .map-type-btn {
    padding: 6px 10px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .map-section {
    height: 350px;
  }
  
  .map-stats {
    position: relative;
    top: auto;
    left: auto;
    padding: 10px;
    background-color: white;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 100%;
    justify-content: center;
    margin-top: -10px;
    z-index: 5;
  }
  
  .control-button {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
  
  .map-type-toggle {
    top: 10px;
    right: 10px;
  }
  
  .map-type-btn {
    padding: 5px 8px;
    font-size: 12px;
  }
}
</style>