<template>
  <q-page class="q-py-xl">
    <div class="container q-mx-auto q-mt-lg">
      <h2 class="fn-lg fn-bold q-ma-none">NEW CARD PROPOSAL</h2>

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

              <div>
                <div class="text-grey-6 fn-sm">Card image</div>
                <q-card flat bordered class="q-pa-md">
                  <media-input v-model="form.cardImg" />
                </q-card>
              </div>

              <q-input
                label="Card verification URL"
                v-model="form.cardVerificationURL"
              />
              <q-input
                type="number"
                label="Card value (ETH)"
                v-model="form.listedPrice"
              />
              <div class="q-mt-md">
                <q-btn
                  class="fit bg-orange text-white q-py-sm"
                  flat
                  border
                  @click="submitProposal"
                  >Create proposal</q-btn
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
import MediaInput from 'src/forms/form/MediaInput.vue';
import { defineComponent, ref } from 'vue';
import firebase from 'firebase';
import 'firebase/firestore';

export default defineComponent({
  name: 'PageIndex',
  components: { MediaInput },
  setup() {
    const form = ref({
      cardName: '',
      cardImg: '',
      cardVerificationURL: '',
      listedPrice: '',
    });

    const submitProposal = async () => {
      await firebase.firestore().collection('proposals').add(form.value);
      // await propose([cardName, cardImg, cardVerificationURL, listedPrice], '');
    };
    return { form, submitProposal };
  },
});
</script>
