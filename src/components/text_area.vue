<template>
  <textarea :disabled="disabled" :placeholder="placeholder"></textarea>
</template>

<script>
export default {
  name: "TextArea",
  emits: ["update:value"],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      editor: undefined,
    };
  },
  mounted() {
    let editor = codemirror.fromTextArea(this.$el, {
      lineNumbers: true,
    });
    editor.on("change", (instance, changeObj) => {
      this.$emit("update:value", this.getValue());
    });
    editor.getWrapperElement().classList.add("flex-fill");
    this.$data.editor = editor;
  },
  methods: {
    getValue() {
      return this.$data.editor ? this.$data.editor.getValue() : undefined;
    },
    setValue(value) {
      this.$data.editor ? this.$data.editor.setValue(value) : undefined;
    },
    clearValue() {
      if (this.$data.editor) {
        // this.$data.editor.setValue("");
        // this.$data.editor.clearHistory();
        // this.$data.editor.swapDoc(codemirror.Doc("", {}));
      }
    },
  },
};
</script>