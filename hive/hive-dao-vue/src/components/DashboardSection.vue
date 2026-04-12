<template>
  <div>
    <AppHeaderSection
      :title="`${$t('dashboard.title')}`"
      :subtitle="`${$t('dashboard.subtitle')}`"
    />

    <div class="alert-light text-center p-2 proptabs">
      <div class="container">
        <div class="row">
          <div class="col-md-8">
            <ul class="nav nav-tabs">
              <li class="nav-item">
                <router-link to="/proposals" class="nav-link text-dark">
                  {{ $t("common.proposalsLabel2") }}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/proposals/createproposal" class="nav-link text-dark">
                  {{ $t("common.createProposalLabel") }}
                </router-link>
              </li>
            </ul>
          </div>

          <div class="col-md-4 text-muted d-none d-sm-block">
            <div
              class="alert my-0"
              style="cursor: pointer"
              @click="showModal = true"
            >
              {{ $t("dashboard.newsText") }}
              <span class="badge bg-warning ms-2">{{ $t("dashboard.newsBadge") }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background: rgba(0,0,0,0.5)"
      @click.self="showModal = false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t("dashboard.devsupport") }}</h5>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body">
            <WitnessVoteModal
              :userProp="user.name"
              :voteStatusProp="voteStatus"
              :loggedInProp="user.loggedIn"
            />
          </div>
        </div>
      </div>
    </div>

    <router-view />
  </div>
</template>

<script>
import WitnessVoteModal from "@/components/WitnessVoteModal.vue";
import AppHeaderSection from "@/components/AppHeaderSection.vue";
import { mapState } from "vuex";

export default {
  name: "DashboardSection",
  components: {
    WitnessVoteModal,
    AppHeaderSection
  },
  computed: {
    ...mapState(["user"])
  },
  data() {
    return {
      voteStatus: true,
      showModal: false
    };
  }
};
</script>