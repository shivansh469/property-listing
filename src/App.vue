<template>
  <div class="app-container">
    <Header />
    <FilterBar />
    <main class="main-content">
      <div class="container">
        <div class="content-layout">
          <div class="map-col">
            <MapSection />
          </div>
          <div class="listings-col">
            <PropertyListings />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import FilterBar from './components/FilterBar.vue';
import MapSection from './components/MapSection.vue';
import PropertyListings from './components/PropertyListings.vue';
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --primary-color: #0061e4;
  --secondary-color: #0050c0;
  --text-color: #2a2a33;
  --text-light: #596b82;
  --background-color: #f7f8f9;
  --border-color: #e1e1e1;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --border-radius: 8px;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

button {
  cursor: pointer;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.main-content {
  flex: 1;
  padding: var(--spacing-lg) 0;
}

.content-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
}

/* On larger screens, show map and listings side by side */
@media (min-width: 992px) {
  .content-layout {
    grid-template-columns: 60% 40%;
  }
  
  .map-col {
    position: sticky;
    top: 100px;
    height: calc(100vh - 150px);
  }
  
  .container {
    max-width: none;
    padding: 0;
  }
}

/* Responsive adjustments for large screens */
@media (min-width: 1200px) {
  .content-layout {
    grid-template-columns: 65% 35%;
  }
}

/* Extra large screens */
@media (min-width: 1600px) {
  .content-layout {
    grid-template-columns: 70% 30%;
  }
}

/* Medium screens */
@media (max-width: 991px) {
  .content-layout {
    grid-template-columns: 1fr;
  }
  
  .map-col {
    order: 1;
  }
  
  .listings-col {
    order: 2;
  }
}

/* Ensure map has fixed height on mobile */
@media (max-width: 767px) {
  .map-col {
    max-height: 400px;
  }
}
</style>