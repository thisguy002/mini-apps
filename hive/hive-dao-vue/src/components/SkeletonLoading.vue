<template>
  <div class="skeleton-wrapper p-3 col-12">
    <div class="skeleton-line" style="width: 82%"></div>
    <div class="skeleton-line" style="width: 36%"></div>
    <div class="skeleton-line" style="width: 74%"></div>
    <div class="skeleton-line" style="width: 48%"></div>
    <div class="skeleton-line" style="width: 91%"></div>
    <div class="skeleton-line" style="width: 58%"></div>
    <div class="skeleton-line" style="width: 82%"></div>
    <div class="skeleton-line" style="width: 36%"></div>
    <div class="skeleton-line" style="width: 74%"></div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.skeleton-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-line {
  height: 30px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>