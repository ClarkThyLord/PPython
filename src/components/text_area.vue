<template>
  <textarea
    class="form-control flex-fill"
    :disabled="disabled"
    :placeholder="placeholder"
    v-model="text"
  ></textarea>
</template>

<script>
export default {
  name: "TextArea",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
  },
};
</script>