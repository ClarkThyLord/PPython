<template><div class="spinner"></div></template>

<script>
export default {
  name: "Spinner",
};
</script>


<style scoped>
.spinner {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #198754;
  width: 16px;
  height: 16px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>