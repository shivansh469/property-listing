<template>
  <div class="listings-section">
    <div class="listings-header">
      <div class="listings-title">
        <h2>Homes For Sale Near Me</h2>
        <div class="listings-count">{{ properties.length }} Homes</div>
      </div>
      <div class="sort-container">
        <div class="dropdown">
          <button class="sort-button" @click="toggleSortDropdown">
            <span class="sort-label">Sort by:</span>
            <span class="sort-value">{{ getSortLabel() }}</span>
            <i class="fa fa-chevron-down"></i>
          </button>
          <div class="dropdown-content" v-if="showSortDropdown">
            <div 
              v-for="option in sortOptions" 
              :key="option.value" 
              class="dropdown-item" 
              :class="{ active: sortBy === option.value }"
              @click="selectSortOption(option.value)"
            >
              <i class="fa fa-check" v-if="sortBy === option.value"></i>
              <span>{{ option.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="property-grid">
      <PropertyCard
        v-for="property in properties"
        :key="property.id"
        :property="property"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue';
import PropertyCard from './PropertyCard.vue';

// Sorting state
const sortBy = ref('for-you');
const showSortDropdown = ref(false);

// Sort options
const sortOptions = [
  { label: 'Homes for You', value: 'for-you' },
  { label: 'Newest Listing', value: 'newest' },
  { label: 'Price (Low to High)', value: 'price-asc' },
  { label: 'Price (High to Low)', value: 'price-desc' },
  { label: 'Bedrooms', value: 'bedrooms' },
  { label: 'Bathrooms', value: 'bathrooms' },
  { label: 'Square Footage', value: 'sqft' }
];

// Toggle dropdown function with improved handling
const toggleSortDropdown = () => {
  showSortDropdown.value = !showSortDropdown.value;
  
  // Close dropdown when clicking outside
  if (showSortDropdown.value) {
    // Use setTimeout to ensure the event listener isn't triggered by the current click
    setTimeout(() => {
      document.addEventListener('click', closeDropdown);
    }, 0);
  } else {
    // Remove listener when manually closing dropdown
    document.removeEventListener('click', closeDropdown);
  }
};

// Improved close dropdown handler
const closeDropdown = (event) => {
  const dropdown = document.querySelector('.dropdown');
  if (dropdown && !dropdown.contains(event.target)) {
    showSortDropdown.value = false;
    document.removeEventListener('click', closeDropdown);
  }
};

// Clean up event listener when component is unmounted
onBeforeUnmount(() => {
  document.removeEventListener('click', closeDropdown);
});

// Get sort label based on current sort value
const getSortLabel = () => {
  const option = sortOptions.find(opt => opt.value === sortBy.value);
  return option ? option.label : 'Homes for You';
};

// Select sort option
const selectSortOption = (value) => {
  sortBy.value = value;
  showSortDropdown.value = false;
};

// Mock property data using the uploaded house images
const propertiesData = [
  {
    id: 1,
    type: 'Single family for sale',
    status: 'New',
    price: 399900,
    bedrooms: 3,
    bathrooms: 1,
    sqft: 888,
    lotSize: 5280,
    yearBuilt: 2010,
    address: '5638 Meisenbach Drive, Hope Township Barry, MI 49058',
    daysOnMarket: 6,
    images: ['/assets/images/1.png', '/assets/images/2.png', '/assets/images/3.png'],
    realtor: 'Miller Real Estate'
  },
  {
    id: 2,
    type: 'Single family for sale',
    status: 'Price Reduced',
    price: 425000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1593,
    lotSize: 7405,
    yearBuilt: 1992,
    address: '4052 Providence Road, Marietta, GA 30062',
    daysOnMarket: 12,
    images: ['/assets/images/2.png', '/assets/images/3.png', '/assets/images/4.png'],
    realtor: 'Atlanta Fine Homes Sotheby\'s International'
  },
  {
    id: 3,
    type: 'Single family for sale',
    status: 'Deal Alert',
    price: 614990,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2513,
    lotSize: 8712,
    yearBuilt: 2015,
    address: '789 Oak Dr, Austin, TX 78703',
    daysOnMarket: 3,
    images: ['/assets/images/3.png', '/assets/images/4.png', '/assets/images/1.png'],
    realtor: 'Keller Williams Realty'
  },
  {
    id: 4,
    type: 'Single family for sale',
    price: 327000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1686,
    lotSize: 6534,
    yearBuilt: 2005,
    address: '101 Cedar Ln, Austin, TX 78704',
    daysOnMarket: 18,
    images: ['/assets/images/4.png', '/assets/images/1.png', '/assets/images/2.png'],
    realtor: 'Compass Real Estate'
  },
  {
    id: 5,
    type: 'Townhouse for sale',
    status: 'Open House',
    price: 529000,
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 1950,
    lotSize: 3200,
    yearBuilt: 2018,
    address: '224 Maple Street, Portland, OR 97205',
    daysOnMarket: 5,
    images: ['/assets/images/2.png', '/assets/images/4.png', '/assets/images/1.png'],
    realtor: 'Portland Modern Realty'
  },
  {
    id: 6,
    type: 'Condo for sale',
    price: 275000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    lotSize: 0,
    yearBuilt: 2012,
    address: '1234 Downtown Ave, Seattle, WA 98101',
    daysOnMarket: 22,
    images: ['/assets/images/3.png', '/assets/images/1.png', '/assets/images/4.png'],
    realtor: 'Urban Living Realty'
  }
];

// Computed property for sorted properties
const properties = computed(() => {
  let sorted = [...propertiesData];
  
  switch (sortBy.value) {
    case 'for-you':
      // Personalized algorithm would go here, for now just use newest
      return sorted.sort((a, b) => a.daysOnMarket - b.daysOnMarket);
    case 'newest':
      return sorted.sort((a, b) => a.daysOnMarket - b.daysOnMarket);
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'bedrooms':
      return sorted.sort((a, b) => b.bedrooms - a.bedrooms);
    case 'bathrooms':
      return sorted.sort((a, b) => b.bathrooms - a.bathrooms);
    case 'sqft':
      return sorted.sort((a, b) => b.sqft - a.sqft);
    default:
      return sorted;
  }
});
</script>

<style scoped>
.listings-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.listings-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.listings-title h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 5px 0;
  color: #2a2a33;
}

.listings-count {
  font-size: 16px;
  color: #596b82;
}

.sort-container {
  position: relative;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.sort-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.sort-button:hover {
  border-color: #0061e4;
}

.sort-label {
  color: #596b82;
  font-weight: normal;
}

.sort-value {
  color: #0061e4;
  font-weight: 600;
  margin: 0 4px;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  min-width: 180px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 100;
  margin-top: 5px;
  overflow: hidden;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-item {
  padding: 10px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f5f8ff;
}

.dropdown-item.active {
  background-color: #f0f7ff;
}

.dropdown-item i {
  color: #0061e4;
  visibility: hidden;
  width: 16px;
}

.dropdown-item.active i {
  visibility: visible;
}

.property-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

/* Responsive grid layout */
@media (min-width: 1440px) {
  .property-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
  }
}

@media (min-width: 1200px) and (max-width: 1439px) {
  .property-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 22px;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .property-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .property-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .listings-title h2 {
    font-size: 22px;
  }
}

@media (min-width: 640px) and (max-width: 767px) {
  .property-grid {
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
  }
}

/* Mobile Responsiveness */
@media (max-width: 767px) {
  .listings-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .listings-title h2 {
    font-size: 20px;
  }
  
  .sort-container {
    width: 100%;
  }
  
  .dropdown {
    width: 100%;
  }
  
  .sort-button {
    width: 100%;
    justify-content: space-between;
  }
  
  .dropdown-content {
    width: 100%;
    left: 0;
    right: auto;
  }
}

@media (max-width: 480px) {
  .property-grid {
    gap: 15px;
  }
  
  .listings-section {
    padding: 15px;
  }
  
  .listings-title h2 {
    font-size: 18px;
  }
  
  .listings-count {
    font-size: 14px;
  }
}

/* Add visual feedback for interactive elements */
.sort-button:active {
  transform: scale(0.98);
}

.dropdown-item:active {
  background-color: #e6f0ff;
}
</style>