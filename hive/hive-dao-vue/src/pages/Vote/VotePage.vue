<template>
  <div>
    <!-- Voting modal -->
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
              :proposalIdProp="parseInt(id)"
              :userProp="user.name"
              :voteStatusProp="user.loggedIn ? isApproved(id) : voteStatus"
              :loggedInProp="user.loggedIn"
              :hivesigner="false"
              :shareonsocial="false"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Voters modal -->
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
            <h5 class="modal-title">{{ $t("proposals.proposalVoters") }} (#{{ id }})</h5>
            <button type="button" class="btn-close" @click="showVotersModalFlag = false"></button>
          </div>
          <div class="modal-body">
            <SkeletonLoading v-if="!accounts.length" />
            <VotersModal :accounts="accounts" :proposalVoters="proposalVoters" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div v-if="proposal">
      <section class="slice bg-gradient-primary pt-5">
        <div class="container py-5 position-relative zindex-100">
          <div class="row row-grid justify-content-around align-items-center">
            <div class="col-lg-5">
              <div class="text-center text-lg-left">
                <span class="badge bg-light rounded-pill">{{ $t("vote.HiveOn") }}</span>
                <h1 class="text-white mt-4 mb-3">{{ $t("vote.HiveProposalsTitle") }}</h1>
                <div class="mt-6">
                  
                 <a  class="btn btn-app-store hover-translate-y-n3 me-lg-4 mb-4 text-left"
                    @click="showVotingModal()"
                    style="cursor: pointer"
                  >
                    <i><img class="icon-small ms-1" src="@/assets/img/random/keychain.png" /></i>
                    <span class="btn-inner--text">{{ $t("vote.supportWith") }}</span>
                    <span class="btn-inner--brand">Keychain</span>
                  </a>
                  
                 <a   class="btn btn-app-store hover-translate-y-n3 mb-4 text-left"
                    @click="hivesignerVote(true)"
                    style="cursor: pointer"
                  >
                    <i><img class="icon-small ms-1" src="@/assets/img/random/hivesigner.svg" /></i>
                    <span class="btn-inner--text">{{ $t("vote.supportWith") }}</span>
                    <span class="btn-inner--brand">Hivesigner</span>
                  </a>
                </div>
                <div class="text-white">
                  <a href="https://signup.hive.io" target="_blank" class="text-white">
                    <small>{{ $t("vote.HiveAccount") }}</small>
                  </a>
                </div>
              </div>
            </div>

            <div class="col-lg-5">
              <div class="card bg-section-secondary mt-6 mb-0 py-3 px-4 shadow-lg">
                <div class="card-body">
                  <h5 class="heading h5 mb-3">{{ proposal.subject }}</h5>
                  <div class="mb-3" style="cursor: pointer" @click="loadVoters()">
                    <strong class="h3">{{ totalProposalVoters || 0 }}</strong>
                    <span> {{ $t("vote.supportersLabel") }}</span>
                  </div>

                  <!-- Progress bar -->
                  <div class="progress" style="height: 2rem">
                    <div
                      class="progress-bar bg-success"
                      role="progressbar"
                      :style="`width: ${totalValue() || 0}%`"
                      :class="totalValue() < 10 ? 'text-dark ps-2' : 'text-white ps-2'"
                    >
                      {{ totalValue() || 0 }}%
                    </div>
                  </div>
                  <small v-if="returnProposal" class="text-muted">
                    {{ $t("vote.totalVotesValue") }} {{ $filters.numeric3(totalProposalSP()) }} SP
                  </small>

                  <ul class="list-unstyled mt-4">
                    <li class="py-2">
                      <div class="d-flex align-items-center">
                        
                      <a  :href="`https://peakd.com/@${proposal.creator}`"
                          target="_blank"
                          class="avatar avatar-sm rounded-circle me-3"
                        >
                          <img
                            alt="Image placeholder"
                            :src="`https://images.hive.blog/u/${proposal.creator}/avatar`"
                          />
                        </a>
                        <span class="h6 mb-0">
                          <strong>{{ $t("vote.createdBy") }}</strong> @
                         <a   target="_blank"
                            :href="`https://peakd.com/@${proposal.creator}`"
                          >{{ proposal.creator }}</a>
                        </span>
                      </div>
                    </li>
                    <li class="py-2">
                      <div class="d-flex align-items-center">
                        <div class="icon icon-shape icon-danger icon-sm rounded-circle me-3">
                          <i class="fas fa-wallet"></i>
                        </div>
                        <span class="h6 mb-0">
                          <strong>{{ $t("vote.requestedFunding") }}: </strong>
                          {{ $filters.numeric3(proposal.total_requested) }} HBD
                        </span>
                      </div>
                    </li>
                    <li class="py-2">
                      <div class="d-flex align-items-center">
                        <div class="icon icon-shape icon-warning icon-sm rounded-circle me-3">
                          <i class="fas fa-calendar"></i>
                        </div>
                        <span class="h6 mb-0">
                          <strong>{{ proposal.duration || 0 }} {{ $t("common.days") }}</strong>
                          ({{ $filters.dateFilter(proposal.start_date) }} -
                          {{ $filters.dateFilter(proposal.end_date) }})
                        </span>
                      </div>
                    </li>
                    <li class="py-2">
                      <div class="d-flex align-items-center">
                        <div class="icon icon-shape icon-success icon-sm rounded-circle me-3">
                          <i class="fas fa-book"></i>
                        </div>
                        <span class="h6 mb-0">
                          <a href="#proposalBody">{{ $t("proposals.detailsLabel") }}</a>
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="container my-4" id="proposalBody">
        <SkeletonLoading v-if="!post.body" />
        <div v-if="post.body">
          <div v-html="post.body" class="postImage"></div>
          <h3>{{ $t("common.originalPostTitle") }}</h3>
          <div>
            {{ $t("common.originalPostDescription") }}
            <a :href="`${proposal.permlink}`" target="_blank">PeakD</a>.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SkeletonLoading from "@/components/SkeletonLoading.vue";
import VotersModal from "@/components/VotersModal.vue";
import VotingModal from "@/components/VotingModal.vue";
import { DefaultRenderer } from "steem-content-renderer";

export default {
  name: "ProposalVote",
  props: ["id"],
  components: {
    SkeletonLoading,
    VotersModal,
    VotingModal
  },
  computed: {
    ...mapState([
      "proposal",
      "voters",
      "accounts",
      "totalProposalVoters",
      "proposalVoters",
      "returnProposal",
      "user",
      "post",
      "voterProposals"
    ])
  },
  data() {
    return {
      voteStatus: false,
      showVotingModalFlag: false,
      showVotersModalFlag: false
    };
  },
  methods: {
    hivesignerVote(approve) {
      window.open(
        `https://hivesigner.com/sign/update-proposal-votes?proposal_ids=[${this.id}]&approve=${approve}`
      );
    },
    fetchProposalById() {
      this.$store.dispatch("fetchProposalById", Number(this.id)).then(() => {
        if (this.proposal !== undefined) {
          this.showPostDetails();
        }
      });
    },
    totalValue() {
      if (this.proposal && this.returnProposal[0]) {
        let value = Number(
          (this.proposal.total_votes / this.returnProposal[0].total_votes) * 100
        ).toFixed(2);
        return Number(value);
      }
    },
    totalProposalSP() {
      return Math.max(...this.proposalVoters.map(v => v.totalSP), 0);
    },
    loadVoters() {
      this.showVotersModalFlag = true;
    },
    showVotingModal() {
      this.showVotingModalFlag = true;
    },
    setProposalVoters() {
      this.$store.dispatch("setProposalVoters", Number(this.id));
    },
    isApproved(id) {
      return this.voterProposals.includes(id);
    },
    showPostDetails() {
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
      if (this.proposal) {
        let permlinkShort = this.proposal.permlink.replace(/^.*\/(.*)$/, "$1");
        this.$store
          .dispatch("fetchPost", [`${this.proposal.creator}`, `${permlinkShort}`])
          .then(() => {
            this.post.body = renderer.render(this.post.body);
          });
      }
    }
  },
  created() {
    this.fetchProposalById();
    this.setProposalVoters();
  }
};
</script>