<template>
    <ul>
        <li v-for="gem in gemList">{{ gem.name }}</li>
    </ul>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import _ from 'lodash';
import { store } from '../store/index';

import BaseLayout from '../partials/BaseLayout.vue';

export default {
    components: {
        BaseLayout
    },
    data: function() {
        return {

        };
    },
    computed: {
        gemList() {
            return this.$store.getters['gems/getGemList'];
        }
    },
    methods: {
        
    },
    metaInfo() {
        let description = "Калькулятор апгрейда камней в игре Vikings: War of Clans";
        return {
            title: "Камни",
            meta: [
                { name: 'description', content: description },
                { property: 'og:title', content: 'Камни | Vikings Planner'},
                { property: 'og:url', content: this.$baseUrl + '/gems'}
            ]
        };
    }
}
</script>