<template>
  <div>
    <!-- VOTING MODAL -->
    <div
      v-if="showVotingModalFlag"
      class="modal fade show d-block"
      tabindex="-1"
      style="background: rgba(0,0,0,0.5)"
      @click.self="showVotingModalFlag = false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t("vote.supportingProposal") }}</h5>
            <button type="button" class="btn-close" @click="showVotingModalFlag = false"></button>
          </div>
          <div class="modal-body">
            <VotingModal
              :proposalIdProp="proposalId"
              :userProp="user.name"
              :voteStatusProp="user.loggedIn ? isApproved(proposalId) : voteStatus"
              :loggedInProp="user.loggedIn"
              :hivesigner="true"
              :shareonsocial="true"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- VOTERS MODAL -->
    <div
      v-if="showVotersModalFlag"
      class="modal fade show d-block"
      tabindex="-1"
      style="background: rgba(0,0,0,0.5)"
      @click.self="showVotersModalFlag = false"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t("proposals.proposalVoters") }} (#{{ proposalId }})</h5>
            <button type="button" class="btn-close" @click="showVotersModalFlag = false"></button>
          </div>
          <div class="modal-body">
            <SkeletonLoading v-if="!accounts.length" />
            <VotersModal :accounts="accounts" :proposalVoters="proposalVoters" />
          </div>
        </div>
      </div>
    </div>

    <!-- POST MODAL -->
    <div
      v-if="showPostModalFlag"
      class="modal fade show d-block"
      tabindex="-1"
      style="background: rgba(0,0,0,0.5)"
      @click.self="showPostModalFlag = false"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ proposalSubject }} (#{{ proposalId }})</h5>
            <button type="button" class="btn-close" @click="showPostModalFlag = false"></button>
          </div>
          <div class="modal-body">
            <SkeletonLoading v-if="!post.body" />
            <div v-if="post.body">
              <div v-html="post.body" class="postImage"></div>
              <h3>{{ $t("common.originalPostTitle") }}</h3>
              <div>
                {{ $t("common.originalPostDescription") }}
                <a :href="`https://peakd.com/@${post.author}/${post.permlink}`" target="_blank">PeakD</a>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PROPOSALS TABLE -->
    <div class="row mt-2">
      <div class="col-md-12">
        <div class="table-responsive">
          <table :class="`table table-padded table-${votesStatusProp} align-items-center`">
            <thead>
              <tr>
                <th
                  v-for="field in fieldsProposals"
                  :key="field.key"
                  style="cursor: pointer"
                  @click="sortBy(field.key)"
                >
                  {{ field.label }}
                  <span v-if="proposalsSortBy === field.key">
                    {{ proposalsSortDesc ? "▼" : "▲" }}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
            <tr v-for="item in filteredProposals" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.subject }}</td>
              <td>{{ item.status }}</td>
              <td>{{ item.duration }}</td>
              <td>{{ item.daily_pay }}</td>
              <td>{{ item.total_votes }}</td>
              <td>{{ item.funding?.fundedStake }}</td>
            </tr>
          </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { i18n } from "@/utils/plugins/i18n.js";
import { DefaultRenderer } from "steem-content-renderer";
import { Tooltip } from "bootstrap";
import VotingModal from "@/components/VotingModal.vue";
import SkeletonLoading from "@/components/SkeletonLoading.vue";
import VotersModal from "@/components/VotersModal.vue";

export default {
  components: {
    VotingModal,
    SkeletonLoading,
    VotersModal
  },
  computed: {
    ...mapState([
      "voters",
      "accounts",
      "dailyBudget",
      "globalProperties",
      "language",
      "proposalVoters",
      "post",
      "user",
      "voterProposals"
    ]),
    ...mapGetters({
      proposals: "proposalsByVotesStatus",
      totalProposalsByVotesStatus: "totalProposalsByVotesStatus",
      totalProposals: "totalProposals"
    }),
    filteredProposals() {
      let list = this.proposals(this.votesStatusProp, this.statusProp) || [];
      list = list.filter(p => p && p.funding); // skip any without funding
      if (this.filterProp) {
        const f = this.filterProp.toLowerCase();
        list = list.filter(p =>
          JSON.stringify(p).toLowerCase().includes(f)
        );
      }
      list = [...list].sort((a, b) => {
        const valA = a[this.proposalsSortBy];
        const valB = b[this.proposalsSortBy];
        if (valA < valB) return this.proposalsSortDesc ? 1 : -1;
        if (valA > valB) return this.proposalsSortDesc ? -1 : 1;
        return 0;
      });
      return list;
    }
  },
  props: {
    filterProp: String,
    votesStatusProp: String,
    statusProp: String
  },
  methods: {
    sortBy(key) {
      if (this.proposalsSortBy === key) {
        this.proposalsSortDesc = !this.proposalsSortDesc;
      } else {
        this.proposalsSortBy = key;
        this.proposalsSortDesc = true;
      }
    },
    isApproved(id) {
      return this.voterProposals.includes(id);
    },
    loadVoters(id) {
      this.proposalId = id;
      this.showVotersModalFlag = true;
      this.$store.dispatch("fetchProposalVoters", id);
    },
    showVotingModal(id) {
      this.proposalId = id;
      this.showVotingModalFlag = true;
    },
    showPostModal(id, creator, permlink, subject) {
      this.proposalSubject = subject;
      this.proposalId = id;
      const renderer = new DefaultRenderer({
        baseUrl: "https://peakd.com/",
        breaks: true,
        skipSanitization: false,
        allowInsecureScriptTags: false,
        addNofollowToLinks: true,
        doNotShowImages: false,
        ipfsPrefix: "",
        assetsWidth: 640,
        assetsHeight: 480,
        imageProxyFn: url => url,
        usertagUrlFn: account => "/@" + account,
        hashtagUrlFn: hashtag => "/trending/" + hashtag,
        isLinkSafeFn: () => true
      });
      this.showPostModalFlag = true;
      this.$store.dispatch("fetchPost", [creator, permlink]).then(() => {
        this.post.body = renderer.render(this.post.body);
      });
    },
    initTooltips() {
      document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
        new Tooltip(el);
      });
    }
  },
  updated() {
    this.initTooltips();
  },
  data() {
    return {
      fieldsProposals: [
        { key: "total_votes", label: i18n.global.t("common.totalVotes") },
        { key: "description", label: i18n.global.t("common.description") },
        { key: "status", label: i18n.global.t("common.status") },
        { key: "duration", label: i18n.global.t("common.duration") },
        { key: "requested", label: i18n.global.t("common.requested") },
        { key: "funding", label: i18n.global.t("common.funding") },
        { key: "vote", label: i18n.global.t("common.vote") }
      ],
      proposalsSortBy: "total_votes",
      proposalsSortDesc: true,
      proposalsSortDirection: "asc",
      voteStatus: false,
      proposalId: 0,
      proposalSubject: "",
      showVotingModalFlag: false,
      showVotersModalFlag: false,
      showPostModalFlag: false
    };
  }
};
</script>