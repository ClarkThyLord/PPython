<template>
  <textarea
    class="form-control flex-fill"
    :disabled="disabled"
    :placeholder="placeholder"
    v-model="text"
    v-on:input="$emit('input', text)"
  ></textarea>
</template>

<script>
export default {
  name: "TextArea",
  emits: ["input"],
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