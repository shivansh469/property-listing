<template>
  <div class="filter-bar">
    <div class="container">
      <div class="filter-container">
        <div class="search-input">
          <input 
            type="text" 
            placeholder="City, Neighborhood, Address, ZIP" 
            aria-label="Search location"
            class="transition-input" 
          />
          <button class="search-button">
            <i class="fa fa-search"></i>
          </button>
        </div>
        <div class="filter-group">
          <button class="filter-dropdown" @click="toggleStatusDropdown">
            {{ selectedStatus }} <i class="fa fa-chevron-down"></i>
          </button>
          <div class="dropdown-menu" v-if="showStatusDropdown">
            <div class="dropdown-item" v-for="status in statuses" :key="status" @click="selectStatus(status)">
              {{ status }}
            </div>
          </div>
        </div>
        <div class="filter-group">
          <button class="filter-dropdown" @click="togglePriceDropdown">
            {{ selectedPrice }} <i class="fa fa-chevron-down"></i>
          </button>
          <div class="dropdown-menu" v-if="showPriceDropdown">
            <div class="dropdown-item" v-for="price in prices" :key="price" @click="selectPrice(price)">
              {{ price }}
            </div>
          </div>
        </div>
        <div class="filter-group">
          <button class="filter-dropdown">
            Beds & Baths <i class="fa fa-chevron-down"></i>
          </button>
        </div>
        <div class="filter-group">
          <button class="filter-dropdown">
            Home Type <i class="fa fa-chevron-down"></i>
          </button>
        </div>
        <div class="filter-group">
          <button class="filters-button">
            <i class="fa fa-sliders"></i> Filters
          </button>
        </div>
        <div class="filter-group save-button-container">
          <button class="save-button">
            <i class="fa fa-save"></i> Save
          </button>
        </div>
      </div>
      
      <!-- Price Range Filter (Initially Hidden) -->
      <div class="price-range-container" v-show="showPriceRange">
        <h3>Price Range</h3>
        <div class="range-chart">
          <div class="chart-bar"></div>
        </div>
        <div class="price-inputs">
          <input 
            type="text" 
            v-model="minPrice" 
            placeholder="Min Price" 
            class="price-input transition-input" 
          />
          <span class="price-separator">—</span>
          <input 
            type="text" 
            v-model="maxPrice" 
            placeholder="Max Price" 
            class="price-input transition-input" 
          />
        </div>
        <div class="price-range-actions">
          <button class="cancel-button" @click="showPriceRange = false">Cancel</button>
          <button class="apply-button" @click="applyPriceRange">Apply</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// Dropdown states
const showStatusDropdown = ref(false);
const showPriceDropdown = ref(false);
const showPriceRange = ref(false);

// Selected values
const selectedStatus = ref('For Sale');
const selectedPrice = ref('Price');

// Min and max price values for custom range
const minPrice = ref('');
const maxPrice = ref('');

// Dropdown options
const statuses = ['For Sale', 'For Rent', 'Sold', 'New Construction'];
const prices = ['Any Price', 'Under $200k', '$200k-$400k', '$400k-$600k', '$600k-$800k', '$800k-$1M', 'Over $1M', 'Custom Range'];

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  const statusDropdown = document.querySelector('.filter-group:nth-child(2)');
  const priceDropdown = document.querySelector('.filter-group:nth-child(3)');
  
  if (statusDropdown && !statusDropdown.contains(event.target)) {
    showStatusDropdown.value = false;
  }
  
  if (priceDropdown && !priceDropdown.contains(event.target)) {
    showPriceDropdown.value = false;
  }
};

// Toggle dropdown functions
const toggleStatusDropdown = () => {
  showStatusDropdown.value = !showStatusDropdown.value;
  if (showStatusDropdown.value) {
    showPriceDropdown.value = false;
    showPriceRange.value = false;
  }
};

const togglePriceDropdown = () => {
  showPriceDropdown.value = !showPriceDropdown.value;
  if (showPriceDropdown.value) {
    showStatusDropdown.value = false;
    showPriceRange.value = false;
  }
};

// Selection functions
const selectStatus = (status) => {
  selectedStatus.value = status;
  showStatusDropdown.value = false;
};

const selectPrice = (price) => {
  if (price === 'Custom Range') {
    showPriceRange.value = true;
    showPriceDropdown.value = false;
  } else {
    selectedPrice.value = price;
    showPriceDropdown.value = false;
  }
};

const applyPriceRange = () => {
  if (minPrice.value && maxPrice.value) {
    selectedPrice.value = `$${minPrice.value}-$${maxPrice.value}`;
  } else if (minPrice.value) {
    selectedPrice.value = `$${minPrice.value}+`;
  } else if (maxPrice.value) {
    selectedPrice.value = `Up to $${maxPrice.value}`;
  } else {
    selectedPrice.value = 'Custom Range';
  }
  
  showPriceRange.value = false;
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.filter-bar {
  background-color: #fff;
  padding: 15px 0;
  border-bottom: 1px solid #e1e1e1;
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.filter-container {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  position: relative;
  flex-grow: 1;
  min-width: 200px;
}

.search-input input {
  width: 100%;
  padding: 10px 40px 10px 15px;
  border: 1px solid #ccc;
  border-radius: 25px;
  font-size: 14px;
}

.transition-input {
  transition: all 0.3s ease;
}

.transition-input:focus {
  border-color: #0061e4;
  box-shadow: 0 0 0 2px rgba(0, 97, 228, 0.2);
  outline: none;
}

.search-button {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: #0061e4;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.filter-group {
  flex-shrink: 0;
  position: relative;
}

.filter-dropdown {
  background: white;
  border: 1px solid #ccc;
  border-radius: 25px;
  padding: 8px 15px;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-dropdown:hover {
  border-color: #0061e4;
}

.filters-button {
  background: white;
  border: 1px solid #ccc;
  border-radius: 25px;
  padding: 8px 15px;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.filters-button:hover {
  border-color: #0061e4;
}

.save-button-container {
  margin-left: auto;
}

.save-button {
  background: #0061e4;
  border: none;
  border-radius: 25px;
  padding: 8px 15px;
  font-size: 14px;
  color: white;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.save-button:hover {
  background-color: #0050c0;
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 5px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  z-index: 10;
  overflow: hidden;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-item {
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f5f8ff;
}

/* Price Range Filter Styling */
.price-range-container {
  margin-top: 15px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.price-range-container h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
}

.range-chart {
  height: 50px;
  background: #f0f0f0;
  margin: 15px 0;
  border-radius: 4px;
  position: relative;
}

.chart-bar {
  background: linear-gradient(90deg, rgba(9,9,121,0.2) 0%, rgba(0,97,228,0.7) 35%, rgba(0,97,228,1) 100%);
  height: 100%;
  border-radius: 4px;
  position: relative;
  width: 70%; /* Default width */
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.price-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.price-separator {
  color: #666;
}

.price-range-actions {
  display: flex;
  gap: 10px;
}

.apply-button {
  flex: 1;
  background: #0061e4;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.apply-button:hover {
  background-color: #0050c0;
}

.cancel-button {
  flex: 1;
  background: white;
  border: 1px solid #ccc;
  color: #333;
  border-radius: 4px;
  padding: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  border-color: #0061e4;
  color: #0061e4;
}

/* Responsive design */
@media (min-width: 1200px) {
  .filter-container {
    justify-content: flex-start;
  }
  
  .filter-group {
    max-width: 150px;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .filter-container {
    gap: 8px;
  }
  
  .filter-dropdown, .filters-button {
    padding: 8px 12px;
    font-size: 13px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .filter-container {
    gap: 6px;
  }
  
  .filter-dropdown, .filters-button {
    padding: 7px 10px;
    font-size: 13px;
  }
  
  .search-input input {
    padding: 8px 40px 8px 12px;
  }
}

@media (max-width: 768px) {
  .filter-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  
  .search-input {
    grid-column: 1 / -1;
    width: 100%;
  }
  
  .filter-group:nth-last-child(2),
  .save-button-container {
    grid-column: 1 / -1;
  }
  
  .filter-dropdown, .filters-button, .save-button {
    width: 100%;
    justify-content: space-between;
  }
  
  .dropdown-menu {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .filter-container {
    grid-template-columns: 1fr;
  }
  
  .filter-group {
    grid-column: 1 / -1;
  }
  
  .filter-dropdown, .filters-button, .save-button {
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .search-input input {
    padding: 10px 40px 10px 15px;
  }
  
  .price-inputs {
    flex-direction: column;
    gap: 8px;
  }
  
  .price-separator {
    display: none;
  }
}
</style>