<template>
  <textarea :placeholder="placeholder"></textarea>
</template>

<script>
export default {
  name: "TextArea",
  emits: ["update:value"],
  props: {
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
    editor.getWrapperElement().classList.add("overflow-auto");
    editor.getWrapperElement().classList.add("flex-fill");
    editor.getWrapperElement().classList.add("rounded-2");
    this.$data.editor = editor;
  },
  methods: {
    getValue() {
      return this.$data.editor ? this.$data.editor.getValue() : undefined;
    },
    setValue(value) {
      if (this.$data.editor) this.$data.editor.setValue(value);
    },
    setReadOnly(value) {
      if (this.$data.editor) this.$data.editor.options.readOnly = value;
    },
  },
};
</script>