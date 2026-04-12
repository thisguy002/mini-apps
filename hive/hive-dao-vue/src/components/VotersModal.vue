<template>
  <div class="row">
    <div class="col-sm-12 col-md-12 col-lg-9 justify-content-center">
      <div v-if="accounts.length">
        <h5>
          {{ $t("vote.supportedByCommunity") }} ({{ proposalVoters.length }}):
        </h5>
        <ul class="list-group">
          <li
            v-for="(voter, index) in proposalVoters"
            :key="index"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div class="avatar rounded-circle">
              <a :href="`https://peakd.com/@${voter.voter}`" target="_blank">
                <img :src="`https://images.hive.blog/u/${voter.voter}/avatar`" />
              </a>
            </div>

            
           <a  v-if="voter.proxyAccount === ''"
              class="text-dark"
              :href="`https://peakd.com/@${voter.voter}`"
              target="_blank"
            >@{{ voter.voter }}</a>

            
           <a  v-else
              class="text-dark"
              :href="`https://peakd.com/@${voter.voter}`"
              target="_blank"
              :title="`${$t('common.proxied1')} @${voter.proxyAccount}${$t('common.proxied2')}`"
              data-bs-toggle="tooltip"
            ><strike>@{{ voter.voter }}</strike></a>

            <span v-if="voter.proxyAccount === ''" class="badge bg-light text-dark p-2">
              {{ $filters.numeric3(voter.sp) }} HP + <br />
              {{ $filters.numeric3(voter.proxySP) }} HP {{ $t("common.proxy") }}
            </span>

            <span
              v-else
              class="badge bg-light text-dark p-2"
              :title="`${$t('common.proxied1')} @${voter.proxyAccount}${$t('common.proxied2')}`"
              data-bs-toggle="tooltip"
            >
              <strike>
                {{ $filters.numeric3(voter.sp) }} HP + <br />
                {{ $filters.numeric3(voter.proxySP) }} HP {{ $t("common.proxy") }}
              </strike>
            </span>

          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { Tooltip } from "bootstrap";

export default {
  props: {
    proposalVoters: Array,
    accounts: Array
  },
  mounted() {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
      new Tooltip(el);
    });
  }
};
</script>