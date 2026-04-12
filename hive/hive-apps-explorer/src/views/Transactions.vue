<template>
  <div>
    <div class="container position-relative mt-0">
      <!-- Search -->
      <div class="row mb-2">
        <div class="col-md-12">
          <ul class="nav nav-pills mb-2">
            <li class="nav-item" v-for="(d, index) in dapps" :key="d.key">
              
             <a class="nav-link rounded-0 app mr-1 mb-1"
                :class="tabIndex === index ? 'active text-white' : 'bg-light text-dark'"
                href="#"
                @click.prevent="tabIndex = index; onDappChange(d.value)"
              >{{ d.text }}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="row mb-1">
        <div class="col-md-6">
          <div class="input-group bg-primary-light p-1 mb-2">
            <input type="number" v-debounce:600="fetchBlockById" v-model="blockId" class="form-control input" placeholder="Put your search query" aria-label="Recipient's username" aria-describedby="basic-addon2">
            <div class="input-group-append">
              <span class="input-group-text rounded-0" id="basic-addon2">block #</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="alert alert-primary rounded-0" role="alert" v-if="totalTransactions === 0">
        Ooops. Can't find any transactions for your app
      </div>
      <div class="row">
        <div class="col-md-4 col-lg-3 d-flex justify-content-center" v-for="trx in transactions" :key="trx.key">
          <div class="card card-icon-2 card-body shadow-3d hover-bg-primary-3 pb-2 justify-content-center rounded-0">
            <div class="d-flex justify-content-between">
              <div class="icon-round mb-3 mb-md-4 icon bg-primary-2">
                <img class="icon rounded" :src="`${dappImage(dapp)}`" @error="$event.target.src = '/star.png'">
              </div>
              <div class="text-small text-right mt-2">
                <span class="text-muted">{{formatDate(trx.expiration, "MMMM Do YYYY")}}</span><br/>
                <router-link :to="`/trx/${trx.transaction_id}`"><span>Id #{{trx.transaction_id.slice(0, 11)}}</span></router-link>
              </div>
            </div>
            <div v-for="op in trx.operations" :key="op.key">
              <div class="mb-2">
                <span v-if="op[0] === 'custom_json'" class="mr-1"><a :href='`https://peakd.com/@${(op[1].required_posting_auths[0] || op[1].required_auths[0])}`' target="_blank">@{{op[1].required_posting_auths[0] || op[1].required_auths[0]}}</a></span>
                <span v-html="dappInfo(op[1].id || op[0], trx.transaction_id)"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useDate } from '../helpers/useDate'

export default {
  name: 'Transactions',
  data () {
    return {
      dapp: 'all',
      tabIndex: 0
    }
  },
  setup() {
    const { formatDate } = useDate()
    return { formatDate }
  },
  computed: {
    block () {
      return this.$store.getters.block
    },
    blockId: {
      get () {
        return this.$store.state.blockId
      },
      set (blockId) {
        this.$store.commit('SET_LATEST_BLOCK_ID', blockId)
      }
    },
    transactions () {
      return this.$store.getters.dappsTransactions(this.dapp)
    },
    totalTransactions () {
      return this.$store.getters.totalTransactions(this.dapp)
    },
    dappImage () {
      return this.$store.getters.dappImage
    },
    dappInfo () {
      return this.$store.getters.dappInfo
    },
    dapps () {
      return this.$store.getters.dapps
    }
  },
  methods: {
    fetchBlockById (blockId) {
      this.$store.dispatch('fetchBlockById', blockId)
    },
    fetchDapps () {
      this.$store.dispatch('fetchDapps', this.dapp)
    },
    onDappChange (name) {
      this.dapp = name
    }
  },
  created () {
    this.fetchDapps()
  }
}
</script>

<style>
.app {
  border: 1.2pt solid #e7e7f1;
}
</style>