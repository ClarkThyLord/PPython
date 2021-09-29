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

          <Spinner v-bind:class="{ 'd-none': !this.$data.transpiling }" />
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
            <button type="button" class="btn btn-primary active">Code</button>
            <input
              type="checkbox"
              class="btn-check"
              id="showTranspilingLogs"
              autocomplete="off"
              v-model="showTranspilingLogs"
            />
            <label class="btn btn-outline-secondary" for="showTranspilingLogs">
              Log
              <span
                class="
                  position-absolute
                  top-0
                  start-100
                  translate-middle
                  badge
                  rounded-pill
                  bg-danger
                "
                v-bind:class="{ 'd-none': transpilingLogs.length == 0 }"
              >
                {{ transpilingLogs.length }}
              </span>
            </label>
          </div>
        </div>
        <hr />
        <TextArea
          placeholder="\\ Get some C++ code here...&#10;int x = 10;&#10;while (x > 0) {&#10;&#9;x = x - 1&#10;}"
          ref="cppSource"
        />
        <ul
          style="max-height: 15vh"
          class="m-2 list-group overflow-auto"
          v-bind:class="{ 'd-none': !showTranspilingLogs }"
        >
          <li
            v-for="transpilingLog in transpilingLogs"
            v-bind:key="transpilingLog"
            class="list-group-item"
            v-bind:class="{
              'list-group-item-danger': transpilingLog.isError,
              'list-group-item-warning': transpilingLog.isWarning,
            }"
          >
            {{ transpilingLog.message }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import TextArea from "./components/text_area.vue";
import Spinner from "./components/spinner.vue";

import transpiler from "./js/transpiler";

export default {
  name: "App",
  components: {
    TextArea,
    Spinner,
  },
  data() {
    return {
      edits: 0,
      autoTranspiling: true,
      transpiling: false,
      transpilingLogs: [],
      showTranspilingLogs: true,
    };
  },
  methods: {
    ppythonSourceUpdatedValue(value) {
      if (!this.$data.autoTranspiling) return;
      this.$data.edits += 1;
      setTimeout(() => {
        this.$data.edits -= 1;
        if (this.$data.edits === 0 && !this.$data.transpiling) this.transpile();
      }, 3000);
    },
    transpile() {
      this.$data.transpiling = true;
      setTimeout(() => {
        let translation = transpiler(this.$refs.ppythonSource.getValue());
        this.$refs.cppSource.setValue(
          translation.result ? translation.result : ""
        );
        this.$data.transpilingLogs = translation.logs;

        this.$data.transpiling = false;
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
