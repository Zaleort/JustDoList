import './scss/main.scss';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import Firebase from 'firebase/app';

Vue.config.productionTip = false;

const firebaseConfig = {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
  };

Firebase.initializeApp(firebaseConfig);

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
