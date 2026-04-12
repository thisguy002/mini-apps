<template>
  <div>
    <section class="slice bg-section-secondary">
      <div class="container px-1">
        <AppStats />
        <SkeletonLoading v-if="totalProposals === 0" class="ms-3" />
        <div class="mb-5 mx-2" v-if="totalProposals > 0">
          <ProposalsToolbar
            @onProposalSearch="proposalSearch($event)"
            @onStatusChange="status = $event"
            :filterProp="filter"
            :statusProp="status"
          />

          <!-- PASSING PROPOSALS -->
          <ProposalsList
            :filterProp="filter"
            :statusProp="status"
            :votesStatusProp="'passing'"
          />

          <!-- RETURN PROPOSAL -->
          <div class="text-center text-warning text-uppercase mb-2">
            {{ $t("proposals.insufficientVotes") }} ({{ $filters.numeric3(returnProposal[0]?.total_votes) }} HP)
          </div>

          <!-- PROPOSALS WITH INSUFFICIENT VOTES -->
          <ProposalsList
            :filterProp="filter"
            :statusProp="status"
            :votesStatusProp="'insufficient'"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import AppStats from "@/components/AppStats.vue";
import ProposalsToolbar from "@/pages/Proposals/ProposalsToolbar.vue";
import ProposalsList from "@/pages/Proposals/ProposalsList.vue";
import SkeletonLoading from "@/components/SkeletonLoading.vue";

export default {
  name: "Proposals",
  components: {
    AppStats,
    SkeletonLoading,
    ProposalsToolbar,
    ProposalsList
  },
  computed: {
    ...mapState([
      "voters",
      "accounts",
      "dailyBudget",
      "globalProperties",
      "language",
      "proposalVoters",
      "returnProposal",
      "post"
    ]),
    ...mapGetters({
      proposals: "proposalsByVotesStatus",
      totalProposalsByVotesStatus: "totalProposalsByVotesStatus",
      totalProposals: "totalProposals"
    })
  },
  methods: {
    proposalSearch(event) {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.filter = event;
      }, 300);
    }
  },
  data() {
    return {
      filter: null,
      votesStatus: "passing",
      status: "all",
      voteStatus: true,
      user: "",
      proposalId: 0,
      proposalSubject: ""
    };
  }
};
</script>