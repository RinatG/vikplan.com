<template>
  <section class="section">
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li><router-link to="/">ВикПлан</router-link></li>
        <li><router-link to="/research">Знания</router-link></li>
        <li><router-link :to="'/research/' + researchType">
        {{ locale[researchType] }}</router-link></li>
        <li class="is-active"><a href="#" aria-current="page">{{ techName }}</a></li>
      </ul>
    </nav>

    <h1 class="title" :class="{'is-2': !isMobile, 'is-4': isMobile}">{{ techName }}</h1>

    <div class="field has-addons">
      <div class="control">
        <button class="button is-static">Показывать с уровня (max {{ maxLevel }}):</button>
      </div>
      <div class="control">
        <div class="select">
          <select v-model.number="minLevel" aria-label="Уровень знаний">
            <option>1</option>
            <option v-show="maxLevel >= 4">4</option>
            <option v-show="maxLevel >= 8">8</option>
            <option v-show="maxLevel >= 12">12</option>
            <option v-show="maxLevel >= 16">16</option>
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
          <th>{{ scrollsName }}</th>
          <th>Время</th>
          <th>Требования</th>
          <th>Эффект</th>
          <th>Могущество</th>
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
          <td class="is-center">{{ tech.scroll | formatNumber }}</td>
          <td class="is-center">
            {{ tech.time_days | formatNumber }}д
            {{ tech.time_seconds | formatTime }}
          </td>
          <td>
            <ul class="my-req">
              <li>Оракул {{ tech.oracle }}</li>
              <li v-show="tech.req1">{{ tech.req1 }}</li>
              <li v-show="tech.req2">{{ tech.req2 }}</li>
              <li v-show="tech.req3">{{ tech.req3 }}</li>
            </ul>
          </td>
          <td class="is-center">{{ tech.effect_value }}</td>
          <td class="is-center">{{ tech.inf | roundNumber }}</td>
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
                <th class="has-text-left">{{ scrollsName}}</th>
                <td class="has-text-right">{{ tech.scroll | formatNumber }}</td>
              </tr>
              <tr>
                <th class="has-text-left">Время</th>
                <td class="has-text-right">
                  {{ tech.time_days | formatNumber }}д
                  {{ tech.time_seconds | formatTime }}
                </td>
              </tr>
              <tr>
                <th class="has-text-left">Требования</th>
                <td class="has-text-right">
                  <ul class="my-req">
                    <li>Оракул {{ tech.oracle }}</li>
                    <li v-show="tech.req1">{{ tech.req1 }}</li>
                    <li v-show="tech.req2">{{ tech.req2 }}</li>
                    <li v-show="tech.req3">{{ tech.req3 }}</li>
                    <li v-show="tech.req4">{{ tech.req4 }}</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <th class="has-text-left">Эффект</th>
                <td class="has-text-right">{{ tech.effect_value }}</td>
              </tr>
              <tr>
                <th class="has-text-left">Могущество</th>
                <td class="has-text-right">{{ tech.inf | roundNumber }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data: function() {
    return {
      locale: {
        economy: 'Экономические',
        warfare: 'Военные',
        spy: 'Шпионаж',
        training: 'Обучение',
        invaders: 'Захватчики',
        hero: 'Герой',
        tier5: 'Тиры I-V',
        tier6: 'Тир VI',
        tier7: 'Тир VII',
        secreto: 'Тайные I - Нападение',
        secretd: 'Тайные I - Оборона',
        secretf: 'Тайные I - Крепости I',
        secret2ofnc: 'Тайные II - Урон',
        secret2dfnc: 'Тайные II - Защита',
        secret2hlth: 'Тайные II - Здоровье',
        secret2frtr: 'Тайные II - Крепости II',
        secret2twn:  'Тайные II - Города',
        secret2t8:   'Тайные II - Войска VIII тира'
      },
      minLevel: 1
    };
  },
  computed: {
    researchType () {
      return this.$route.params.type;
    },
    slug() {
      let num = this.$route.params.id;
      if (num.length === 1) {
        num = '0' + num;
      }
      return this.$route.params.type + '_' + num;
    },
    isMobile() {
      return this.$store.state.isMobile;
    },
    entries() {
      let entries = this.$store.getters['research/getTechEntries'](this.slug);
      return _.filter(entries, (entry) => entry.level >= this.minLevel);
    },
    maxLevel() {
      return this.entries[this.entries.length - 1].level;
    },
    techName() {
      return this.$store.getters['research/getTechNameBySlug'](this.slug);
    },
    scrollsName() {
      if (this.researchType === 'tier6') {
        return 'Тотемы';
      } else if (this.researchType === 'tier7') {
        return 'Обсидиан';
      } else if (this.researchType === 'secreto' || this.researchType === 'secretd' || this.researchType === 'secretf') {
        return 'Осколки душ';
      } else if (this.researchType.startsWith('secret2')) {
        return 'Осколки душ';
      } else {
        return 'Манускрипты'
      }
    }
  },
  metaInfo() {
    return {
      title: this.techName,
      meta: [{ name: 'description', content: this.techName + ' - уровни, ресурсы, манускрипты, время изучения.'}]
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
    let url = this.$route.params.type + '/' + this.$route.params.id;
    //console.log('mounted', url);
    gtag('config', this.$gtag, {'page_path': '/research/' + url});
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
