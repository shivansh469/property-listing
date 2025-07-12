<template>
  <header class="header">
    <div class="container header-container">
      <img src="/assets/images/HouzeoLogblue_small.png" alt="Houzeo Logo" class="logo">
    </div>
  </header>
</template>

<script setup>
</script>

<style scoped>
.header {
  background-color: #fff;
  padding: 12px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  height: 40px;
  max-width: 100%;
}

@media (max-width: 768px) {
  .logo {
    height: 32px;
  }
}
</style>