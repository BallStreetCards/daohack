<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useEthers } from './ethers';

export default defineComponent({
  name: 'App',
  setup() {
    return;
  },
});
</script>
