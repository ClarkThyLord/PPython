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

          <div class="ms-auto d-flex" />

          <Spinner v-bind:class="{ 'd-none': showSpinner }" />
          <div class="btn-group">
            <input
              type="checkbox"
              class="btn-check"
              id="autoTranspile"
              autocomplete="off"
              v-model="autoTranspiling"
            />
            <label class="btn btn-outline-success" for="autoTranspile"
              >Auto</label
            >
            <button
              type="button"
              class="btn btn-success"
              v-on:click="transpile()"
            >
              Transpile
            </button>
          </div>
        </div>
        <hr />
        <TextArea
          placeholder="# Write some PPython code here...&#10;x = 10&#10;while x > 0:&#10;&#9;x = x - 1"
          v-on:update:value="ppythonSourceUpdatedValue"
          ref="ppythonSource"
        />
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
        <TextArea
          placeholder="\\ Get some C++ code here...&#10;int x = 10;&#10;while (x > 0) {&#10;&#9;x = x - 1&#10;}"
          ref="cppSource"
        />
        <ul class="m-2 list-group overflow-auto" style="max-height: 15vh">
          <li v-for="i in 100" class="list-group-item list-group-item-danger">
            A simple danger list group item
          </li>
          <li class="list-group-item list-group-item-warning">
            A simple warning list group item
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import TextArea from "./components/text_area.vue";
import Spinner from "./components/spinner.vue";

export default {
  name: "App",
  components: {
    TextArea,
    Spinner,
  },
  data() {
    return {
      autoTranspiling: true,
      transpiling: false,
      lastTranspile: 0,
    };
  },
  computed: {
    showSpinner() {
      return !this.$data.transpiling;
    },
  },
  methods: {
    ppythonSourceUpdatedValue(value) {
      setTimeout(() => {
        if (
          this.$data.autoTranspiling &&
          !this.$data.transpiling &&
          new Date().getTime() - this.$data.lastTranspile > 5000
        )
          this.transpile();
      }, 3000);
    },
    transpile() {
      this.$data.transpiling = true;
      console.log("t");
      setTimeout(() => {
        this.$refs.cppSource.setValue(this.$refs.ppythonSource.getValue());
        this.$data.transpiling = false;
        this.$data.lastTranspile = new Date().getTime();
      }, 600);
    },
  },
  mounted() {
    this.$refs.cppSource.setReadOnly(true);
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
