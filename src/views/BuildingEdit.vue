<template>
  <section class="section">
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li><router-link to="/">ВикПлан</router-link></li>
        <li><router-link to="/buildings">Здания</router-link></li>
        <li class="is-active"><a href="#" aria-current="page">{{ techMain.name }}</a></li>
      </ul>
    </nav>

    <h1 class="title" :class="{'is-2': !isMobile, 'is-4': isMobile}">{{ techMain.name }}</h1>

    <div class="field has-addons">
      <div class="control">
        <button class="button is-static">Уровень зданий:</button>
      </div>
      <div class="control">
        <div class="select">
          <select v-model.number="minLevel" aria-label="Уровень зданий">
            <option>1</option>
            <option>27</option>
            <option>31</option>
          </select>
        </div>
      </div>
    </div>

    <table class="table is-bordered is-narrow" v-if="!isMobile">
      <thead>
        <tr class="is-center">
          <th>Уровень</th>
          <th>Еда</th>
          <th>Дерево</th>
          <th>Железо</th>
          <th>Камень</th>
          <th>Серебро</th>
          <th>Золото</th>
          <th>Время</th>
          <th>Бронза</th>
          <th>Самородок</th>
          <th>Осколок души</th>
          <th>Требования</th>
          <th>Эффекты</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tech in entries">
          <td class="is-center">{{ tech.level }}</td>
          <td class="is-center">{{ tech.food | roundNumber }}</td>
          <td class="is-center">{{ tech.lumber | roundNumber }}</td>
          <td class="is-center">{{ tech.iron | roundNumber }}</td>
          <td class="is-center">{{ tech.stone | roundNumber }}</td>
          <td class="is-center">{{ tech.silver | roundNumber }}</td>
          <td class="is-center">{{ tech.gold | roundNumber }}</td>
          <td class="is-center">
            {{ tech.time_days | formatNumber }}д
            {{ tech.time_seconds | formatTime }}
          </td>
          <td class="is-center">{{ tech.bronze | formatNumber }}</td>
          <td class="is-center">{{ tech.bronze2 | formatNumber }}</td>
          <td class="is-center">{{ tech.bronze3 | formatNumber }}</td>
          <td>
            <ul class="my-req">
              <li v-show="tech.req1">{{ tech.req1 }}</li>
              <li v-show="tech.req2">{{ tech.req2 }}</li>
              <li v-show="tech.req3">{{ tech.req3 }}</li>
            </ul>
          </td>
          <td>
            <ul class="my-req">
              <li v-show="techMain.effect1_name">{{ techMain.effect1_name }}</li>
              <li v-show="techMain.effect1_name">{{ tech.effect1_value }}</li>
              <li v-show="techMain.effect2_name">{{ techMain.effect2_name }}</li>
              <li v-show="techMain.effect2_name">{{ tech.effect2_value }}</li>
              <li v-show="techMain.effect3_name">{{ techMain.effect3_name }}</li>
              <li v-show="techMain.effect3_name">{{ tech.effect3_value }}</li>
            </ul>
          </td>
          <!-- <td class="is-center">{{ tech.effect_value }}</td> -->
        </tr>
      </tbody>
    </table>
    <div class="mobile-table" v-else>
      <div class="card" v-for="tech in entries">
        <div class="card-content">
          <table class="table is-striped is-narrow is-fullwidth">
            <tbody>
              <tr>
                <th class="has-text-left">Уровень</th>
                <td class="has-text-right">{{ tech.level }}</td>
              </tr>
              <tr>
                <th class="has-text-left">Еда</th>
                <td class="has-text-right">{{ tech.food | roundNumber }}</td>
              </tr>
              <tr>
                <th class="has-text-left">Дерево</th>
                <td class="has-text-right">{{ tech.lumber | roundNumber }}</td>
              </tr>
              <tr>
                <th class="has-text-left">Железо</th>
                <td class="has-text-right">{{ tech.iron | roundNumber }}</td>
              </tr>
              <tr>
                <th class="has-text-left">Камень</th>
                <td class="has-text-right">{{ tech.stone | roundNumber }}</td>
              </tr>
              <tr>
                <th class="has-text-left">Серебро</th>
                <td class="has-text-right">{{ tech.silver | roundNumber }}</td>
              </tr>
              <tr>
                <th class="has-text-left">Золото</th>
                <td class="has-text-right">{{ tech.gold | roundNumber }}</td>
              </tr>
              <tr>
                <th class="has-text-left">Время</th>
                <td class="has-text-right">
                  {{ tech.time_days | formatNumber }}д
                  {{ tech.time_seconds | formatTime }}
                </td>
              </tr>
              <tr v-show="tech.bronze > 0">
                <th class="has-text-left">Бронза</th>
                <td class="has-text-right">{{ tech.bronze | formatNumber }}</td>
              </tr>
              <tr v-show="tech.bronze2 > 0">
                <th class="has-text-left">Самородок</th>
                <td class="has-text-right">{{ tech.bronze2 | formatNumber }}</td>
              </tr>
              <tr v-show="tech.bronze3 > 0">
                <th class="has-text-left">Осколок души</th>
                <td class="has-text-right">{{ tech.bronze3 | formatNumber }}</td>
              </tr>
              <tr>
                <th class="has-text-left">Требования</th>
                <td class="has-text-right">
                  <ul class="my-req">
                    <li v-show="tech.req1">{{ tech.req1 }}</li>
                    <li v-show="tech.req2">{{ tech.req2 }}</li>
                    <li v-show="tech.req3">{{ tech.req3 }}</li>
                  </ul>
                </td>
              </tr>
              <tr v-show="techMain.effect1_name">
                <th class="has-text-left">{{ techMain.effect1_name }}</th>
                <td class="has-text-right">{{ tech.effect1_value }}</td>
              </tr>
              <tr v-show="techMain.effect2_name">
                <th class="has-text-left">{{ techMain.effect2_name }}</th>
                <td class="has-text-right">{{ tech.effect2_value }}</td>
              </tr>
              <tr v-show="techMain.effect3_name">
                <th class="has-text-left">{{ techMain.effect3_name }}</th>
                <td class="has-text-right">{{ tech.effect3_value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import _ from 'lodash';
import BaseLayout from '../partials/BaseLayout.vue';

export default {
  components: {
    BaseLayout
  },
  data: function() {
    return {
      minLevel: 27
    };
  },
  computed: {
    slug() {
      let num = this.$route.params.id;
      if (num.length === 1) {
        num = '0' + num;
      }
      return 'building_' + num;
    },
    isMobile() {
      return this.$store.state.isMobile;
    },
    entries() {
      let entries = this.$store.getters['buildings/getTechEntries'](this.slug);
      return _.filter(entries, (entry) => entry.level >= this.minLevel);
    },
    techMain() {
      return this.$store.getters['buildings/getTech'](this.slug);
    }
    // materials () {
    //     return this.$store.getters['equip/getMaterials'](this.id);
    // }
  },
  metaInfo() {
    return {
      title: this.techMain.name,
      meta: [{ name: 'description', content: this.techMain.name + ' - уровни, ресурсы, бронза, время изучения.'}]
    };
  },
  methods: {
    updateBonus: function(value, bonusType) {
      this.$store.commit('updateBonus', {
        id: this.id,
        param: bonusType,
        value
      });
    }
  },
  mounted() {
    gtag('config', this.$gtag, {'page_path': '/buildings/' + this.$route.params.id});
  }
};
</script>

<style lang="scss">
ul.my-req {
  font-size: 0.9rem;
}
.mobile-table .card {
  margin-bottom: 10px;
}
</style>
