<template>
  <div>
    <div>
      <p v-html="$t('keychain.devSupport1')"></p>
    </div>
    <form @submit.prevent="witnessVoteKeychain(user)">
      <div class="mb-3">
        <label for="user" class="form-label">{{ $t("keychain.inputLabel") }}</label>
        <input
          id="user"
          v-model="user"
          :disabled="loggedIn"
          type="text"
          required
          class="form-control"
          :placeholder="`${$t('keychain.placeholder')}`"
        />
      </div>
      <div class="mb-3">
        <div class="mb-2">{{ $t("keychain.voteLabel4") }}</div>
        <button class="btn btn-dark w-100 mb-2" type="submit">
          {{ $t("keychain.voteWithLabel") }}
          <img class="icon-small ms-1" src="@/assets/img/random/keychain.png" />
        </button>
        <button
          class="btn btn-dark w-100"
          @click="witnessVoteHivesigner()"
          type="button"
        >
          {{ $t("keychain.voteWithLabel") }}
          <img class="icon-small ms-1" src="@/assets/img/random/hivesigner.svg" />
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    userProp: String,
    loggedInProp: Boolean,
    voteStatusProp: Boolean
  },
  data() {
    return {
      user: this.userProp,
      loggedIn: this.loggedInProp,
      voteStatus: this.voteStatusProp
    };
  },
  methods: {
    witnessVoteKeychain(user) {
      if (window.hive_keychain && user !== "") {
        hive_keychain.requestWitnessVote(user, "gtg", true, function(response) {
          if (response.success) {
            return response;
          } else {
            return response.success;
          }
        });
      } else {
        return [];
      }
    },
    witnessVoteHivesigner() {
      window.open(
        `https://hivesigner.com/sign/account-witness-vote?witness=tbd&approve=1`
      );
    }
  }
};
</script>