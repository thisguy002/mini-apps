<template>
  <div>
    <div class="container mt-5">
      <h3>{{ $t("createProposal.submitProposalTitle") }}</h3>
      <div class="card">
        <div class="card-body">
          <form @submit.prevent="createProposalKeychain">

            <div class="mb-3">
              <label for="subject" class="form-label">{{ $t("createProposal.titleInputLabel") }}</label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                required
                class="form-control"
                :placeholder="`${$t('createProposal.titleInputPlaceholder')}`"
              />
            </div>

            <div class="mb-3">
              <label for="dailypay" class="form-label">{{ $t("createProposal.dailypayInputLabel") }}</label>
              <input
                id="dailypay"
                v-model="form.dailypay"
                type="number"
                required
                class="form-control"
                :placeholder="`${$t('createProposal.dailypayInputPlaceholder')}`"
              />
              <div class="form-text">{{ $t("createProposal.dailypayInputDescription") }}</div>
            </div>

            <div class="mb-3">
              <label for="permlink" class="form-label">{{ $t("createProposal.permlinkInputLabel") }}</label>
              <input
                id="permlink"
                v-model="form.permlink"
                type="text"
                required
                class="form-control"
                :placeholder="`${$t('createProposal.permlinkInputPlaceholder')}`"
              />
              <div class="form-text">{{ $t("createProposal.permlinkInputDescription") }}</div>
            </div>

            <div class="mb-3">
              <label for="creator" class="form-label">{{ $t("createProposal.creatorInputLabel") }}</label>
              <input
                id="creator"
                v-model="form.creator"
                type="text"
                required
                class="form-control"
                :placeholder="`${$t('createProposal.creatorInputPlaceholder')}`"
              />
              <div class="form-text">{{ $t("createProposal.creatorInputDescription") }}</div>
            </div>

            <div class="mb-3">
              <label for="receiver" class="form-label">{{ $t("createProposal.receiverInputLabel") }}</label>
              <input
                id="receiver"
                v-model="form.receiver"
                type="text"
                required
                class="form-control"
                :placeholder="`${$t('createProposal.receiverInputPlaceholder')}`"
              />
              <div class="form-text">{{ $t("createProposal.receiverInputDescription") }}</div>
            </div>

            <div class="mb-3">
              <label for="start_date" class="form-label">{{ $t("createProposal.startdateLabel") }}</label>
              <DatePicker
                id="start_date"
                v-model:value="form.start_date"
                class="w-100"
                type="datetime"
                format="YYYY-MM-DD HH:mm:ss"
                value-type="format"
                required
              />
            </div>

            <div class="mb-3">
              <label for="end_date" class="form-label">{{ $t("createProposal.enddateLabel") }}</label>
              <DatePicker
                id="end_date"
                v-model:value="form.end_date"
                class="w-100"
                type="datetime"
                format="YYYY-MM-DD HH:mm:ss"
                value-type="format"
                required
              />
            </div>

            <p class="text-danger">
              <small>{{ $t("createProposal.feeLabel") }}</small>
            </p>
            <button type="submit" class="btn btn-dark">
              {{ $t("common.submitWithButton") }}
              <img class="icon-small ms-1" src="@/assets/img/random/keychain.png" />
            </button>

          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateProposal",
  data() {
    return {
      form: {
        dailypay: 0,
        subject: "",
        permlink: "",
        creator: "",
        receiver: "",
        start_date: "",
        end_date: ""
      }
    };
  },
  methods: {
    createProposalHivesigner() {
      this.$router.push("/proposals");
      window.open(
        `https://hivesigner.com/sign/create-proposal?start_date=${this.form.start_date}&end_date=${this.form.end_date}&daily_pay=${this.form.dailypay}&subject=${this.form.subject}&permlink=${this.form.permlink}&creator=${this.form.creator}&receiver=${this.form.receiver}`
      );
    },
    createProposalKeychain(event) {
      if (window.hive_keychain) {
        hive_keychain.requestBroadcast(
          this.form.creator,
          [
            [
              "create_proposal",
              {
                creator: this.form.creator,
                receiver: this.form.receiver,
                start_date: this.form.start_date,
                end_date: this.form.end_date,
                daily_pay: Number(this.form.dailypay).toFixed(3) + " HBD",
                subject: this.form.subject,
                permlink: this.form.permlink.replace(/^.*\/(.*)$/, "$1")
              }
            ]
          ],
          "Active",
          function(response) {
            if (response.success) {
              event.target.reset();
            } else {
              event.target.reset();
            }
          }
        );
      } else {
        return [];
      }
    }
  }
};
</script>