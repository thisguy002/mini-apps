import axios from "axios";

export default {
  async fetchProposals({ commit }, limit) {
    const url = import.meta.env.VITE_HIVE_MAINNET;
    const headers = { "Content-Type": "application/json" };
    const body = {
      jsonrpc: "2.0",
      method: "database_api.list_proposals",
      id: 2,
      params: {
        start: [],
        limit: limit,
        order: "by_total_votes",
        order_direction: "descending",
        status: "all"
      }
    };
    await axios.post(url, body, { headers })
      .then(response => {
        let proposals = response.data.result.proposals;
        commit("SET_PROPOSALS", proposals);
        return proposals;
      })
      .catch(() => []);
  },

  async fetchProposalById({ commit, dispatch }, id) {
    commit("SET_PROPOSAL", {});
    const url = import.meta.env.VITE_HIVE_MAINNET;
    const headers = { "Content-Type": "application/json" };
    const body = {
      jsonrpc: "2.0",
      method: "call",
      id: 2,
      params: ["condenser_api", "find_proposals", [[`${id}`]]]
    };
    await axios.post(url, body, { headers })
      .then(response => {
        let proposal = response.data.result[0];
        commit("SET_PROPOSAL", proposal);
        dispatch("fetchProposalVoters", id);
        return proposal;
      })
      .catch(() => {});
  },

  async fetchPost({ commit }, [author, permlink]) {
    commit("SET_POST", {});
    const url = import.meta.env.VITE_HIVE_MAINNET;
    const headers = { "Content-Type": "application/json" };
    const body = {
      jsonrpc: "2.0",
      method: "condenser_api.get_content",
      id: 2,
      params: [author, permlink]
    };
    await axios.post(url, body, { headers })
      .then(response => {
        let post = response.data.result;
        commit("SET_POST", post);
        return post;
      })
      .catch(() => {});
  },

  async fetchReturnProposal({ commit, state }) {
    const url = import.meta.env.VITE_HIVE_MAINNET;
    const headers = { "Content-Type": "application/json" };
    const body = {
      jsonrpc: "2.0",
      method: "condenser_api.find_proposals",
      id: 1,
      params: [[0]]
    };
    await axios.post(url, body, { headers })
      .then(response => {
        let proposal = response.data.result[0];
        proposal.total_votes = (Number(proposal.total_votes) * state.steemPerMVest) / 1000000000;
        commit("SET_RETURNING_PROPOSAL", proposal);
      })
      .catch((err) => {
        console.error("fetchReturnProposal error:", err);
      });
  },

  async fetchProposalVoters({ commit, dispatch }, proposalId) {
    commit("SET_VOTERS", []);
    commit("SET_ACCOUNTS", []);
    const url = import.meta.env.VITE_HIVE_MAINNET;
    const headers = { "Content-Type": "application/json" };
    const body = {
      jsonrpc: "2.0",
      method: "call",
      id: 0,
      params: [
        "condenser_api",
        "list_proposal_votes",
        [[proposalId, ""], 500, "by_proposal_voter"]
      ]
    };
    await axios.post(url, body, { headers })
      .then(response => {
        if (response.data.result !== undefined) {
          let voters = response.data.result;
          let accounts = voters
            .filter(v => v.proposal.id === proposalId)
            .map(voter => voter["voter"]);
          commit("SET_VOTERS", voters);
          dispatch("fetchAccounts", accounts);
          return voters;
        }
      })
      .catch(() => []);
  },

  addVoterProposal({ commit }, id) {
    commit("ADD_VOTER_PROPOSAL", id);
  },

  removeVoterProposal({ commit }, id) {
    commit("REMOVE_VOTER_PROPOSAL", id);
  },

  async setVoterProposals({ commit }, voter) {
    commit("SET_VOTER_PROPOSALS", []);
    const url = import.meta.env.VITE_HIVE_MAINNET;
    const headers = { "Content-Type": "application/json" };
    const body = {
      jsonrpc: "2.0",
      method: "call",
      id: 0,
      params: [
        "condenser_api",
        "list_proposal_votes",
        [[voter, 0], 500, "by_voter_proposal"]
      ]
    };
    await axios.post(url, body, { headers })
      .then(response => {
        if (response.data.result !== undefined) {
          let voterProposals = response.data.result.filter(p => p.voter === voter);
          let newproposals = [];
          voterProposals.forEach(p => {
            newproposals.push(p.proposal.proposal_id);
          });
          commit("SET_VOTER_PROPOSALS", newproposals);
          return newproposals; // fixed: was returning undefined `proposals`
        }
      })
      .catch(() => []);
  },

  async fetchAccounts({ commit, dispatch }, voters) {
    const url = import.meta.env.VITE_HIVE_MAINNET;
    const headers = { "Content-Type": "application/json" };
    const body = {
      jsonrpc: "2.0",
      method: "call",
      id: 0,
      params: ["condenser_api", "get_accounts", [voters]]
    };
    await axios.post(url, body, { headers })
      .then(response => {
        let accounts = response.data.result;
        if (accounts !== undefined) {
          commit("SET_ACCOUNTS", accounts);
          dispatch("setProposalVoters", voters);
          commit("SET_TOTAL_PROPOSAL_VOTERS", voters.length);
        }
        return accounts;
      })
      .catch(() => []);
  },

  async fetchAccountByName({ commit }, accountName) {
    commit("SET_ACCOUNT", "");
    const url = import.meta.env.VITE_HIVE_MAINNET;
    const headers = { "Content-Type": "application/json" };
    const body = {
      jsonrpc: "2.0",
      method: "call",
      id: 0,
      params: ["condenser_api", "get_accounts", [[accountName]]]
    };
    await axios.post(url, body, { headers })
      .then(response => {
        let account = response.data.result[0];
        commit("SET_ACCOUNT", account);
        return account;
      })
      .catch(() => []);
  },

  async setBudget({ commit }) {
    const url = import.meta.env.VITE_HIVE_MAINNET;
    const headers = { "Content-Type": "application/json" };
    const body = {
      jsonrpc: "2.0",
      method: "condenser_api.get_accounts",
      id: 1,
      params: [["steem.dao"]]
    };
    await axios.post(url, body, { headers })
      .then(response => {
        let totalBudget = parseFloat(response.data.result[0].hbd_balance);
        commit("SET_TOTAL_BUDGET", totalBudget);
        commit("SET_DAILY_BUDGET", totalBudget / 100);
        return totalBudget;
      })
      .catch(() => []);
  },

  async fetchSteemGlobalProperties({ commit, dispatch }) {
    const url = import.meta.env.VITE_HIVE_MAINNET;
    const headers = { "Content-Type": "application/json" };
    const body = {
      jsonrpc: "2.0",
      method: "database_api.get_dynamic_global_properties",
      id: 2
    };
    await axios.post(url, body, { headers })
      .then(async response => {
        const globalProperties = response.data.result;
        commit("SET_GLOBAL_PROPERTIES", globalProperties);
        await dispatch("setSteemPerMvest", globalProperties); // must complete first
        await dispatch("setBudget");
        await dispatch("fetchReturnProposal"); // after steemPerMVest is set
        await dispatch("fetchProposals", 100);
      })
      .catch(() => []);
  },

  setWorkers({ commit }, workers) {
    commit("SET_WORKERS", workers);
  },

  setUser({ commit }, user) {
    commit("SET_USER", user);
  },

  setProposalVoters({ commit }, id) {
    commit("SET_PROPOSAL_VOTERS", id);
  },

  setSteemPerMvest({ commit }, globalProperties) {
    let total_vesting_fund_hive = parseFloat(
      globalProperties.total_vesting_fund_hive.amount
    );
    let total_vesting_shares = parseFloat(
      globalProperties.total_vesting_shares.amount
    );
    let steemPerMvest = total_vesting_fund_hive / (total_vesting_shares / 1000000);
    commit("SET_STEEM_PER_MVEST", steemPerMvest);
  },

  setReturningProposal({ commit }, proposal) {
    commit("SET_RETURNING_PROPOSAL", proposal);
  }
};