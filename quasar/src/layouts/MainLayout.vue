<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered>
      <div class="container q-px-lg row items-center q-mx-auto">
        <img class="logo" src="/favicon.svg" alt="Ball Street logo" />
        <div class="col"></div>
        <div>
          <!-- <q-btn-dropdown
            flat
            v-if="accounts.length"
            color="primary"
            no-caps
            :label="`${accounts[0]}`"
          >
            <q-list flat>
              <q-item clickable v-close-popup @click="disconnectWallet">
                <q-item-section>
                  <q-item-label>Disconnect</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown> -->

          <!-- <q-btn v-else flat class="text-white bg-accent" @click="connectWallet"
            >Connect Wallet</q-btn
          > -->
          <q-btn v-if="!currentUser" @click="near?.signIn" outline>
            Connect wallet
          </q-btn>
          <div v-else>
            <q-btn no-caps :label="currentUser?.accountId" outline>
              <q-menu>
                <q-list bordered separator>
                  <!-- EVENTS -->
                  <!-- <q-item clickable v-close-popup class="column">
                    <q-item-section class="fn-sm">
                      <router-link to="/my-events" class="text-light fn-link">
                        My events
                      </router-link>
                    </q-item-section>
                  </q-item> -->
                  <!-- LOGOUT -->
                  <q-item clickable v-close-popup @click="currentUser.signOut">
                    <q-item-section>Sign out</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </div>
    </q-header>

    <q-page-container>
      <router-view v-if="currentUser" />
      <div class="q-ma-lg container q-mx-auto q-px-lg" v-else>
        Connect your NEAR wallet to begin.
      </div>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped>
.logo {
  width: 80px;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
// import { useEthers } from '../ethers';
import { useCurrentUser, useNearContract } from 'src/hooks/near';
// import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    // const ethers = useEthers();
    // async function connectWallet() {
    // await ethers.value.enable?.();
    // }
    // async function disconnectWallet() {
    // await ethers.value
    // }
    // const accounts = computed(() => ethers.value.accounts);
    // return { connectWallet, ethers, accounts, disconnectWallet };

    // const router = useRouter();
    const { data: near } = useNearContract();
    const { data: currentUser } = useCurrentUser();

    // const { data: eventsList } = useFirestoreCollection<Event>('events');

    // eventsList.value.values()
    // const events = computed(() =>
    //   ([...(eventsList.value?.values() ?? [])] as Event[]).map(
    //     (x: Event) => x.title
    //   )
    // );

    return { near, currentUser };
  },
});
</script>
