<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-white">
      <div class="container row justify-between items-center q-py-sm q-mx-auto">
        <img class="logo" src="/favicon.svg" alt="BallStreet" />
        <div class="text-black">
          <q-btn
            flat
            class="text-white bg-accent"
            no-caps
            v-if="accounts.length"
            >{{ accounts[0]?.substring(0, 8) }}...</q-btn
          >
          <q-btn v-else flat class="text-white bg-accent" @click="connectWallet"
            >Connect Wallet</q-btn
          >
        </div>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped>
.logo {
  width: 80px;
  height: 80px;
}
</style>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useEthers } from '../ethers';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const ethers = useEthers();

    async function connectWallet() {
      await ethers.value.enable?.();
    }
    const accounts = computed(() => ethers.value.accounts);
    return { connectWallet, ethers, accounts };
  },
});
</script>
