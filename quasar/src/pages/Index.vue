<template>
  <q-page>
    <div class="container q-mx-auto q-px-lg q-mt-lg">
      <div v-if="currentUser">
        <div v-if="proposals && proposals.size">
          <q-card
            v-for="[id, proposal] in proposals"
            :key="id"
            bordered
            flat
            class="q-pa-md"
          >
            <div class="text-h4">DAO proposal #{{ proposal.proposalId }}</div>
            <div class="row q-col-gutter-md q-mt-md">
              <div class="col col-sm-5">
                <q-img class="bg-grey-2" :src="proposal.cardImg" />
              </div>
              <!-- <div class="col">
                <q-separator vertical />
              </div> -->
              <div class="col col-sm-7">
                <h5 style="margin: 0">{{ proposal.cardName }}</h5>
                <q-list bordered separator>
                  <q-item>
                    <q-item-section>Supply</q-item-section>
                    <q-item-section>
                      100 tokens @ {{ proposal.listedPrice / 100 }} Ⓝ
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section> Market cap</q-item-section>
                    <q-item-section>
                      {{ proposal.listedPrice }} Ⓝ
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      Details<br />
                      <div style="font-size: 70%">{{ proposal }}</div>
                    </q-item-section>
                  </q-item>
                </q-list>
                <!-- <a>{{ proposal.cardVerificationURL }}</a> -->
                <div v-if="proposal.status === 'drafted'">
                  <q-banner rounded class="q-mt-lg bg-grey-3">
                    Waiting for voting to start...
                  </q-banner>
                </div>
                <q-card
                  class="q-mt-lg"
                  v-if="
                    proposal.status === 'proposed' &&
                    proposal.account !== currentUser?.accountId
                  "
                >
                  <q-card-section>
                    Cast your vote
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
                      @click="vote(proposal.proposalId, false, reason, id)"
                    >
                      NO
                    </q-btn>
                    <q-input
                      label="Optional reason for vote decision"
                      v-model="reason"
                    />
                  </q-card-section>
                </q-card>
                <q-banner
                  rounded
                  class="q-mt-lg"
                  :class="proposal.votes ? 'bg-green-3' : 'bg-grey-3'"
                  v-if="
                    ['proposed', 'voted'].indexOf(proposal.status) >= 0 &&
                    proposal.account === currentUser?.accountId
                  "
                >
                  Waiting for community votes...
                  <b>{{ proposal.votes || 0 }}</b> votes received
                </q-banner>
                <q-card
                  flat
                  bordered
                  class="q-mt-lg"
                  v-if="
                    proposal.status === 'voted' &&
                    proposal.account === currentUser?.accountId
                  "
                >
                  <!-- <q-card-section>
                    Congratulations! The commmunity approved your proposal.
                  </q-card-section>
                  <q-separator inset></q-separator> -->
                  <q-card-section>
                    Next:
                    <q-btn
                      flat
                      color="green"
                      @click="mint(id)"
                      v-if="proposal.approved"
                      >Mint card & establish sub-DAO</q-btn
                    >
                    <q-btn flat @click="done(id)">Cancel proposal</q-btn>
                  </q-card-section>
                </q-card>
                <div
                  v-if="
                    proposal.status === 'mint' &&
                    proposal.account === currentUser?.accountId
                  "
                >
                  <q-banner rounded class="q-mt-lg bg-grey-3">
                    Minting your card and establishing its DAO...
                  </q-banner>
                </div>
                <div
                  v-if="
                    proposal.status === 'executed' &&
                    proposal.account === currentUser?.accountId
                  "
                >
                  <q-banner rounded class="q-my-lg bg-green-3">
                    Congratulations! Your new <a href>DAO</a> is online
                    <template v-slot:action>
                      <q-btn flat @click="done(id)">DONE</q-btn>
                    </template>
                  </q-banner>
                </div>
              </div>
            </div>
          </q-card>
        </div>
        <div v-else>
          <div class="text-h4">Create DAO proposal</div>
          <q-card bordered flat class="q-pa-md q-mt-lg">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-4 col-md-6">
                <q-img class="bg-grey-2" :src="form.cardImg" />
              </div>
              <!-- <div class="row col">
                <q-separator vertical />
              </div> -->
              <div class="col-12 col-sm-8 col-md-6 q-col-gutter-y-md">
                <q-input label="Card name" v-model="form.cardName" />

                <div>
                  <!-- <div class="text-grey-6 fn-sm">Card image</div> -->
                  <!-- <q-card flat bordered class="q-pa-md"> -->
                  <media-input label="Card image" v-model="form.cardImg" />
                  <!-- </q-card> -->
                </div>

                <q-input
                  label="Card verification URL"
                  v-model="form.cardVerificationURL"
                />
                <q-input
                  type="number"
                  label="Card value (NEAR)"
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
import { defineComponent, ref } from 'vue';
import firebase from 'firebase';
import 'firebase/firestore';
// import { useEthers } from 'src/ethers';
import { useFirestoreCollection } from 'src/hooks/firebase';
import { useCurrentUser, useNearContract } from 'src/hooks/near';

export default defineComponent({
  name: 'PageIndex',
  components: { MediaInput },
  setup() {
    const { data: near } = useNearContract();
    const { data: currentUser } = useCurrentUser();

    const { data: proposals } = useFirestoreCollection('proposals', () => ({
      // where: ['status', '!=', 'executed'],
    }));
    // const ethers = useEthers();

    // const accounts = computed(() => ethers.value.accounts);

    const form = ref({
      cardName: '2020-21 Panini Select - Teal White Pink #63 LaMelo Ball SN49',
      cardImg: '',
      cardVerificationURL: 'https://www.psacard.com/cert/63594751',
      listedPrice: '1337',
      status: 'drafted',
    });
    const reason = ref('');

    const submitProposal = async () => {
      await firebase
        .firestore()
        .collection('proposals')
        .add({
          ...form.value,
          account: currentUser.value?.accountId,
        });
      form.value.cardImg = '';
    };

    const done = async (id: string) => {
      await firebase.firestore().collection('proposals').doc(id).delete();
    };

    const mint = async (id: string) => {
      await firebase
        .firestore()
        .collection('proposals')
        .doc(id)
        .update({ status: 'mint' });
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
        account: currentUser.value?.accountId,
      });
      // TODO: Ethers call
    };

    return {
      form,
      submitProposal,
      // accounts,
      proposals,
      vote,
      reason,
      mint,
      currentUser,
      near,
      done,
    };
  },
});
</script>
