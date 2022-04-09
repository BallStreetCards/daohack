<template>
  <q-page class="q-py-xl">
    <div class="container q-mx-auto q-mt-lg">
      <h2 class="fn-lg fn-bold q-ma-none">SUBMIT CARD PROPOSALS</h2>

      <div>
        <q-card bordered flat class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-7">
              <q-img class="bg-grey-2" :src="form.cardImg" />
            </div>
            <div class="row col">
              <q-separator vertical />
            </div>
            <div class="col-5 column q-col-gutter-md q-pa-xl">
              <q-input label="Card name" v-model="form.cardName" />
              <q-input label="Card image URL" v-model="form.cardImg" />
              <q-input
                label="Card verification URL"
                v-model="form.cardVerificationURL"
              />
              <q-input label="Listing price" v-model="form.listedPrice" />
              <div class="q-mt-md">
                <q-btn class="fit bg-orange text-white q-py-sm" flat border
                  >PROPOSE FOR REVIEW</q-btn
                >
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { propose } from '../../../scripts/propose';

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const form = ref({
      cardName: '',
      cardImg: '',
      cardVerificationURL: '',
      listedPrice: '',
    });

    const submitProposal = async () => {
      await propose([cardName, cardImg, cardVerificationURL, listedPrice], '');
    };
    return { form };
  },
});
</script>
