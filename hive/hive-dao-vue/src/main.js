import '@/assets/css/main.css'
import "@/assets/css/fontawesome/all.min.css";
import 'vue-datepicker-next/index.css';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { createApp } from 'vue'
import App from './App.vue'
import store from './store/store'
import router from './router'
import { i18n } from "@/utils/plugins/i18n.js";
import DatePicker from 'vue-datepicker-next';

import { numeric, numeric3, daysLeft, dateFilter } from "@/utils/filters/filters";

const app = createApp(App);

app.config.globalProperties.$filters = { numeric, numeric3, daysLeft, dateFilter };

app.use(router);
app.use(store);
app.use(i18n);
app.component('DatePicker', DatePicker);
app.mount("#app");