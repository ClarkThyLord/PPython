<template>
  <div class="h-100 d-grid gap-3 p-3">
    <div class="row h-100">
      <div class="col-lg-6 d-flex flex-column">
        <div class="hstack gap-3 mx-3">
          <img
            src="../public/ppython.svg"
            alt=""
            height="48"
            class="d-inline-block align-text-top ppython-icon"
          />
          <h1>PPython</h1>

          <a href="#help" class="link-info">?</a>
          <div class="ms-auto btn-group">
            <button type="button" class="btn btn-danger">Clear</button>
            <button type="button" class="btn btn-success">Transpile</button>
          </div>
        </div>
        <hr />
        <TextArea ref="ppythonSource" />
      </div>

      <div class="col-lg-6 d-flex flex-column">
        <div class="hstack gap-3 mx-3">
          <h1>C++</h1>

          <div class="ms-auto btn-group">
            <button type="button" class="btn btn-primary active">Code</button
            ><button type="button" class="btn btn-danger position-relative">
              Errors
              <span
                class="
                  position-absolute
                  top-0
                  start-100
                  translate-middle
                  badge
                  rounded-pill
                  bg-warning
                "
              >
                99+
              </span>
            </button>
          </div>
        </div>
        <hr />
        <TextArea :disabled="true" ref="cppSource" />
      </div>
    </div>
  </div>
</template>

<script>
import TextArea from "./components/text_area.vue";

export default {
  name: "App",
  components: {
    TextArea,
  },
  mounted() {
    this.$refs.ppythonSource.$el.focus();
  },
};
</script>

<style>
html,
body,
#app {
  widows: 100%;
  height: 100%;
}

@media (max-width: 400px) {
  img.ppython-icon {
    display: none !important;
  }

  .col-lg-6 {
    padding-top: 1rem * 0.25;
  }
}

@media (max-width: 768px) {
  .ppython-icon {
    height: 32px !important;
  }
}
</style>
