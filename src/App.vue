<template>
  <div class="h-100 d-flex flex-column">
    <nav class="navbar navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="">
          <img
            src="../public/ppython.svg"
            alt=""
            width="30"
            height="24"
            class="d-inline-block align-text-top"
          />
          PPython
        </a>
      </div>
    </nav>

    <div class="flex-fill p-3">
      <div class="row h-100">
        <div class="col d-flex flex-column">
          <div class="hstack gap-3 mx-3">
            <img
              src="../public/ppython.svg"
              alt=""
              height="48"
              class="d-inline-block align-text-top"
            />
            <h1>PPython</h1>
            <a href="#help" class="link-info">?</a>
            <div class="ms-auto btn-group">
              <button type="button" class="btn btn-danger">Clear</button>
              <button type="button" class="btn btn-success">Transpile</button>
            </div>
          </div>
          <textarea class="form-control flex-fill" id="pythonSource"></textarea>
        </div>
        <div class="col d-flex flex-column">
          <div class="hstack gap-3">
            <h1>C++</h1>
            <div class="ms-auto btn-group me-2">
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
          <textarea class="form-control flex-fill" id="pythonSource"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
html,
body,
#app {
  widows: 100%;
  height: 100%;
}
</style>
