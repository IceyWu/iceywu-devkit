<script setup lang="ts">
import PlaygroundShell from "./components/PlaygroundShell.vue";

defineOptions({
  components: {
    PlaygroundShell,
  },
});
</script>

<template>
  <div class="app-shell">
    <PlaygroundShell />
  </div>
</template>

<style scoped>
.app-shell {
  height: 100%;
}
</style>