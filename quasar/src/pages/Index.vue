<template>
  <q-page class="q-py-xl">
    <div class="container q-mx-auto q-mt-lg">
      <div v-if="accounts.length">
        <h2 class="fn-lg fn-bold q-ma-none">Proposed card for listing</h2>
        <div v-if="proposals && proposals.size">
          <q-card
            v-for="[id, proposal] in proposals"
            :key="id"
            bordered
            flat
            class="q-pa-md"
          >
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-7">
                <q-img class="bg-grey-2" :src="proposal.cardImg" />
              </div>
              <div class="row col">
                <q-separator vertical />
              </div>
              <div class="col-5 column q-col-gutter-md q-pa-xl">
                <h3 style="margin: 0">{{ proposal.cardName }}</h3>
                <a>{{ proposal.cardVerificationURL }}</a>

                <p>Supply: 100 tokens @ {{ proposal.listedPrice / 100 }}</p>
                <p>
                  Details<br />
                  <code style="font-size: 60%">{{ proposal }}</code>
                </p>
                <div
                  v-if="
                    proposal.status === 'proposed' &&
                    proposal.account !== accounts[0]
                  "
                >
                  Vote
                  <q-btn
                    flat
                    color="green"
                    @click="vote(proposal.proposalId, true, reason, id)"
                  >
                    YES
                  </q-btn>
                  <q-btn
                    flat
                    color="red"
                    @click="vote(proposal.proposalId, true, reason, id)"
                  >
                    NO
                  </q-btn>
                  <q-input
                    label="Optional reason for vote decision"
                    v-model="reason"
                  />
                </div>
                <div
                  v-if="
                    proposal.status === 'proposed' &&
                    proposal.account === accounts[0]
                  "
                >
                  Waiting for community votes...
                  {{ proposal.votes || 0 }} votes received
                </div>
                <div
                  v-if="
                    proposal.status === 'voted' &&
                    proposal.account === accounts[0]
                  "
                >
                  <q-btn flat color="green" @click="mint(id)">MINT</q-btn>
                </div>
              </div>
            </div>
          </q-card>
        </div>
        <div v-else>
          <h2 class="fn-lg fn-bold q-ma-none">NEW CARD PROPOSAL</h2>
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
    </div>
  </q-page>
</template>

<script lang="ts">
import MediaInput from 'src/forms/form/MediaInput.vue';
import { computed, defineComponent, ref } from 'vue';
import firebase from 'firebase';
import 'firebase/firestore';
import { useEthers } from 'src/ethers';
import { useFirestoreCollection } from 'src/hooks/firebase';

export default defineComponent({
  name: 'PageIndex',
  components: { MediaInput },
  setup() {
    const { data: proposals } = useFirestoreCollection('proposals', () => ({
      // where: ['status', '!=', 'executed'],
    }));
    const ethers = useEthers();

    const accounts = computed(() => ethers.value.accounts);

    const form = ref({
      cardName: '',
      cardImg: '',
      cardVerificationURL: '',
      listedPrice: '',
      status: 'drafted',
    });
    const reason = ref('');

    const submitProposal = async () => {
      await firebase
        .firestore()
        .collection('proposals')
        .add({ ...form.value, account: accounts.value[0] });
      // TODO: Eters
    };

    const mint = async (id: string) => {
      await firebase
        .firestore()
        .collection('proposals')
        .doc(id)
        .update({ status: 'mint' });
      // TODO: Eters
    };

    const vote = async (
      proposalId: string,
      approve: boolean,
      reason: string,
      docId: string
    ) => {
      await firebase.firestore().collection('votes').add({
        docId,
        proposalId,
        approve,
        reason,
        account: accounts.value[0],
      });
      // TODO: Ethers call
    };

    return { form, submitProposal, accounts, proposals, vote, reason, mint };
  },
});
</script>
