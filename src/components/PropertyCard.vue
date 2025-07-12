<template>
  <div class="property-card">
    <!-- Image Slider -->
    <div class="image-slider">
      <transition-group name="fade" tag="div" class="slider-container">
        <img
          v-for="(image, index) in normalizedImages"
          :key="index"
          :src="image"
          :alt="`Property image ${index + 1}`"
          class="slider-image"
          v-show="index === currentImageIndex"
          loading="lazy"
        />
      </transition-group>
      
      <!-- Favorite button -->
      <button class="favorite-btn" @click.stop="toggleFavorite">
        <i class="fa" :class="isFavorite ? 'fa-heart' : 'fa-heart-o'"></i>
      </button>
      
      <!-- Property tools button -->
      <button class="tools-btn" @click.stop="showTools = !showTools">
        <i class="fa fa-ellipsis-v"></i>
      </button>
      
      <!-- Tools dropdown -->
      <div class="tools-dropdown" v-if="showTools">
        <div class="tools-item" @click="shareProperty">
          <i class="fa fa-share"></i> Share
        </div>
        <div class="tools-item" @click="scheduleViewing">
          <i class="fa fa-calendar"></i> Schedule Viewing
        </div>
        <div class="tools-item" @click="requestInfo">
          <i class="fa fa-info-circle"></i> Request Info
        </div>
      </div>
      
      <!-- Navigation arrows -->
      <div class="slider-arrows" v-if="hasMultipleImages">
        <button class="arrow-btn prev" @click.prevent="prevImage">
          <i class="fa fa-angle-left"></i>
        </button>
        <button class="arrow-btn next" @click.prevent="nextImage">
          <i class="fa fa-angle-right"></i>
        </button>
      </div>
      
      <!-- Dots pagination -->
      <div class="slider-dots" v-if="hasMultipleImages">
        <span
          v-for="(_, index) in normalizedImages"
          :key="index"
          :class="['dot', { active: index === currentImageIndex }]"
          @click="setImage(index)"
        ></span>
      </div>
      
      <!-- Status badge -->
      <div class="status-badge" v-if="property.status">
        {{ property.status }}
      </div>
    </div>

    <!-- Property Information -->
    <div class="property-info">
      <div class="property-price">${{ formatPrice(property.price) }}</div>
      
      <div class="property-details">
        <span class="detail-item">{{ property.bedrooms }} <span class="label">Beds</span></span>
        <span class="detail-item">{{ property.bathrooms }} <span class="label">Ba</span></span>
        <span class="detail-item">{{ formatNumber(property.sqft) }} <span class="label">sqft</span></span>
        <span class="detail-type">{{ property.type }}</span>
      </div>
      
      <div class="property-address">{{ property.address }}</div>
      
      <div class="property-extras">
        <div class="property-features">
          <span v-if="property.yearBuilt" class="feature-item">
            <i class="fa fa-calendar-o"></i> Built {{ property.yearBuilt }}
          </span>
          <span v-if="property.lotSize" class="feature-item">
            <i class="fa fa-tree"></i> {{ property.lotSize }} sqft lot
          </span>
        </div>
        
        <div class="property-days" v-if="property.daysOnMarket !== undefined">
          <span>{{ property.daysOnMarket }} {{ property.daysOnMarket === 1 ? 'day' : 'days' }} on Houzeo</span>
        </div>
      </div>
      
      <div class="property-footer">
        <div class="realtor">{{ property.realtor }}</div>
        <div class="actions">
          <button class="contact-btn" @click="contactRealtor">Contact</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue';

// Define the property prop received from parent component
const props = defineProps({
  property: {
    type: Object,
    required: true
  }
});

// State for image slider and UI controls
const currentImageIndex = ref(0);
const isFavorite = ref(false);
const showTools = ref(false);

// Ensure we always have an array of images
const normalizedImages = computed(() => {
  if (!props.property.images || !Array.isArray(props.property.images) || props.property.images.length === 0) {
    // Default image if none provided
    return ['/assets/images/1.png'];
  }
  
  // Map relative paths to include /assets/images/ if needed
  return props.property.images.map(img => {
    if (img.startsWith('/assets/')) return img;
    if (img.startsWith('/public/')) return img.replace('/public/', '/');
    if (img.startsWith('http')) return img;
    return `/assets/images/${img.replace(/^\//, '')}`;
  });
});

// Check if there are multiple images
const hasMultipleImages = computed(() => normalizedImages.value.length > 1);

// Image slider methods
const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % normalizedImages.value.length;
};

const prevImage = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + normalizedImages.value.length) % normalizedImages.value.length;
};

const setImage = (index) => {
  currentImageIndex.value = index;
};

// Toggle favorite state
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
};

// Property action methods
const shareProperty = () => {
  alert(`Share property: ${props.property.address}`);
  showTools.value = false;
};

const scheduleViewing = () => {
  alert(`Schedule viewing for: ${props.property.address}`);
  showTools.value = false;
};

const requestInfo = () => {
  alert(`Request information for: ${props.property.address}`);
  showTools.value = false;
};

const contactRealtor = () => {
  alert(`Contact ${props.property.realtor} about ${props.property.address}`);
};

// Format price to display with commas
const formatPrice = (price) => {
  return price.toLocaleString();
};

// Format number with commas
const formatNumber = (num) => {
  return num.toLocaleString();
};

// Auto-advance slider every 5 seconds if there are multiple images
let sliderInterval = null;
if (hasMultipleImages.value) {
  sliderInterval = setInterval(nextImage, 5000);
}

// Clear interval on component unmount
onBeforeUnmount(() => {
  if (sliderInterval) clearInterval(sliderInterval);
});
</script>

<style scoped>
.property-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  position: relative;
  display: flex;
  flex-direction: column;
}

.property-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.image-slider {
  position: relative;
  padding-bottom: 66.67%; /* 3:2 aspect ratio */
  height: 0;
  overflow: hidden;
}

.slider-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.slider-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Fade transition for image slider */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.favorite-btn, .tools-btn {
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  border: none;
  cursor: pointer;
  z-index: 5;
  color: #333;
  font-size: 16px;
  transition: transform 0.2s, background-color 0.2s;
}

.favorite-btn {
  top: 10px;
  right: 10px;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.favorite-btn i.fa-heart {
  color: #ff3e63;
}

.tools-btn {
  top: 10px;
  right: 56px;
}

.tools-btn:hover {
  transform: scale(1.1);
}

.tools-dropdown {
  position: absolute;
  top: 52px;
  right: 56px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.15);
  z-index: 10;
  overflow: hidden;
  min-width: 150px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.tools-item {
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tools-item:hover {
  background-color: #f5f8ff;
}

.slider-arrows {
  position: absolute;
  bottom: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  transform: translateY(50%);
}

.arrow-btn {
  background: rgba(255, 255, 255, 0.9);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  font-size: 18px;
  color: #333;
  transition: transform 0.2s, background-color 0.2s;
}

.arrow-btn:hover {
  background: white;
  transform: scale(1.1);
}

.slider-dots {
  position: absolute;
  bottom: 15px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: all 0.2s;
}

.dot.active {
  background: white;
  transform: scale(1.2);
}

.status-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #0061e4;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  z-index: 5;
}

.property-info {
  padding: 15px;
}

.property-price {
  font-size: 24px;
  font-weight: 700;
  color: #2a2a33;
  margin-bottom: 8px;
}

.property-details {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 15px;
  margin-bottom: 8px;
  font-size: 16px;
  color: #2a2a33;
}

.detail-item {
  font-weight: 600;
}

.detail-item .label {
  font-weight: 400;
  margin-left: 3px;
}

.detail-type {
  color: #596b82;
  font-size: 14px;
}

.property-address {
  color: #596b82;
  margin-bottom: 10px;
  line-height: 1.4;
}

.property-extras {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 5px;
}

.property-features {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.feature-item {
  color: #596b82;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.property-days {
  color: #596b82;
  font-size: 13px;
  font-style: italic;
}

.property-footer {
  color: #596b82;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f0f0f0;
  padding-top: 10px;
  margin-top: 5px;
}

.realtor {
  font-style: italic;
}

.contact-btn {
  background: #0061e4;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.contact-btn:hover {
  background-color: #0050c0;
}

/* Responsive styles */
@media (min-width: 1200px) {
  .image-slider {
    padding-bottom: 60%; /* Slightly shorter on larger screens */
  }
  
  .property-price {
    font-size: 26px;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .image-slider {
    padding-bottom: 63%;
  }
  
  .arrow-btn {
    width: 32px;
    height: 32px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .property-price {
    font-size: 22px;
  }
  
  .property-details {
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .property-details {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .property-extras {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .property-features {
    margin-bottom: 5px;
  }
  
  .property-footer {
    flex-wrap: wrap;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .image-slider {
    padding-bottom: 70%; /* Taller on small screens */
  }
  
  .property-price {
    font-size: 20px;
  }
  
  .property-info {
    padding: 12px;
  }
  
  .property-details {
    font-size: 14px;
  }
  
  .arrow-btn {
    width: 28px;
    height: 28px;
    font-size: 16px;
  }
  
  .favorite-btn, .tools-btn {
    width: 32px;
    height: 32px;
  }
}
</style>