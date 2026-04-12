<template>
  <header class="header header-transparent" id="header-main">
    <nav class="navbar navbar-expand-md navbar-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">
          <img
            src="@/assets/img/logo.png"
            id="navbar-logo"
            style="height: 30px;"
            alt="logo"
          />
        </router-link>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav ms-auto align-items-center">

            <li class="nav-item">
              <router-link class="nav-link text-white" to="/proposals">
                {{ $t("common.proposalsLabel2") }}
              </router-link>
            </li>

            <!-- Info dropdown -->
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown">
                {{ $t("common.infoLabel") }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <router-link class="dropdown-item" to="/faq">
                    {{ $t("faq.title") }}
                  </router-link>
                </li>
              </ul>
            </li>

            <!-- Profile dropdown (logged in) -->
            <li class="nav-item dropdown d-none d-md-block" v-if="user.loggedIn">
              <a class="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown">
                {{ $t("common.profileLabel") }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <span class="dropdown-item text-dark">{{ user.name }}</span>
                </li>
                <li>
                  <a class="dropdown-item text-dark" href="#" @click.prevent="logout">
                    {{ $t("common.logoutLabel") }}
                  </a>
                </li>
              </ul>
            </li>

            <!-- Profile dropdown (logged out) -->
            <li class="nav-item dropdown" v-if="!user.loggedIn">
              <a class="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown">
                {{ $t("common.profileLabel") }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <router-link class="dropdown-item" to="/login">
                    {{ $t("common.loginLabel") }}
                  </router-link>
                </li>
              </ul>
            </li>

            <!-- Language selector -->
            <li class="nav-item d-none d-md-block">
              <select
                v-model="$i18n.locale"
                class="form-select form-select-sm selector-plain mt-1"
                @change="changeLang($event)"
              >
                <option v-for="(lang, i) in languages" :key="i" :value="lang.locale">
                  {{ lang.name }}
                </option>
              </select>
            </li>

          </ul>
        </div>
      </div>
    </nav>

    <!-- Toast notification -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        ref="logoutToast"
        class="toast align-items-center text-bg-dark border-0"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body">
            {{ $t("common.logoutLabel") }}: {{ $t("common.success") }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    </div>

  </header>
</template>

<script>
import { mapState } from "vuex";
import items from "@/shared/constants/localStorage";
import { Toast } from "bootstrap";

export default {
  name: "AppHeader",
  computed: {
    ...mapState(["global", "user"])
  },
  data() {
    return {
      languages: [
        { name: "EN", locale: "en" },
        { name: "KO", locale: "ko" }
      ]
    };
  },
  methods: {
    changeLang(event) {
      this.$i18n.locale = event.target.value;
      localStorage.setItem(items.LANGUAGE, event.target.value);
    },
    logout() {
      this.resetLocalStorage();
      this.$store
        .dispatch("setUser", {
          name: "",
          loggedIn: false,
          token: ""
        })
        .then(() => {
          const toast = new Toast(this.$refs.logoutToast, { delay: 3000 });
          toast.show();
        });
    },
    resetLocalStorage() {
      localStorage.removeItem(items.LOGGED_IN);
      localStorage.removeItem(items.USER);
      localStorage.removeItem(items.TOKEN);
      localStorage.removeItem(items.PROPOSALS);
    }
  }
};
</script>

<style scoped>
select.selector-plain {
  background: transparent;
  border: 1pt solid #eeeeee;
  text-transform: uppercase;
  color: white;
  opacity: 0.8;
}

select.selector-plain option {
  color: black;
}

select.selector-plain:focus {
  border: 1pt solid #eeeeee;
  box-shadow: none;
}
</style>