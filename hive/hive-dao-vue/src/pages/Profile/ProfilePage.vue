<template>
  <div>
    <AppHeaderSection :title="`Profile title`" :subtitle="`profile subtitle`" />
    <section class="pt-7 pt-lg-0 bg-section-secondary">
      <div class="container-fluid pl-lg-6 pr-lg-6">
        <div class="row">
          <WorkerProposalsInfo />
          <div class="col-lg-9 mt-lg-5">
            <SkeletonLoading v-if="!voterProposals.length" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from "vuex";
import AppHeaderSection from "@/components/AppHeaderSection.vue";
import SkeletonLoading from "@/components/SkeletonLoading.vue";
import WorkerProposalsInfo from "@/pages/WorkerProposals/WorkerProposalsInfo.vue";

export default {
  components: {
    AppHeaderSection,
    SkeletonLoading,
    WorkerProposalsInfo
  },
  computed: {
    ...mapState(["voterProposals", "user"])
  },
  methods: {
    fetchAccountByName(name) {
      this.$store.dispatch("fetchAccountByName", name);
    }
  },
  created() {
    this.fetchAccountByName(this.user.name);
  }
};
</script>

<style></style>
