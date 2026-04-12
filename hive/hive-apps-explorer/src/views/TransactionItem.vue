<template>
<div class="container">
     <section class="bg-primary-alt header-inner">
      <div class="container">
        <h5 class="text-center mb-5">Transaction #{{trxId}}</h5>
        <div class="alert alert-danger rounded-0" role="alert" v-if="!trx.operations">
          Ooops. Can't find your transaction. Please wait for a couple of minutes and try one more time.
        </div>
        <div class="col-md-9 offset-2" v-if="trx.operations">
          <div class="card rounded-0">
            <div class="card-body pb-1">
              <h5 class="card-title">Transaction details:</h5>
              <ul>
                <li><strong>Expiration - </strong><code>{{formatDate(trx.expiration, "MMMM Do YYYY")}}</code></li>
                <li><strong>Extensions - </strong> <code>{{trx.extensions}}</code></li>
                <li><strong>Block number reference- </strong> <code>{{trx.ref_block_num}}</code></li>
                <li><strong>Block prefix - </strong> <code>{{trx.ref_block_prefix}}</code></li>
                <li><strong>Signatures - </strong> <code>{{trx.signatures}}</code></li>
                <li><strong>Transaction umber in a block - </strong> <code>{{trx.transaction_num}}</code></li>
              </ul>
            </div>
            <!-- First operation -->
            <div class="card-body pt-0">
              <h5 class="card-title">{{trx.operations[0].type}}:</h5>
              <ul class="card-text mb-2" v-for="(opValue, key) in trx.operations[0].value" :key="key">
                <li><strong>{{key}}</strong> - <code>{{opValue}}</code></li>
              </ul>
            </div>

            <!-- More operations indicator -->
            <div class="card-body pt-0 text-muted text-small" v-if="trx.operations.length > 1">
              <em>+ {{trx.operations.length - 1}} more operation(s)...</em>
            </div>
            <div class="card-footer text-muted text-small font-weight-bold">
              <span>{{formatDate(trx.timestamp, "MMMM Do YYYY")}}</span>
              <span class="float-right">Block #{{trx.block_num}}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
</div>
</template>

<script>
import { useDate } from '../helpers/useDate'
export default {
  name: 'TransactionItem',
  props: ['trxId'],
  setup() {
    const { formatDate } = useDate()
    return { formatDate }
  },
  computed: {
    trx () {
      return this.$store.getters.transaction
    },
  },
  methods: {
    fetchTransactionById () {
      this.$store.dispatch('fetchTransactionById', this.trxId)
    }
  },
  created () {
    this.fetchTransactionById()
  }
}
</script>

<style>

</style>
