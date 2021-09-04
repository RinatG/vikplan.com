<template>
  <section class="section research-main">
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li><router-link to="/">ВикПлан</router-link></li>
        <li class="is-active"><a href="#" aria-current="page">Знания</a></li>
      </ul>
    </nav>

    <h1 class="title" :class="{'is-2': !isMobile, 'is-4': isMobile}">Обзор знаний</h1>

    <research-collections></research-collections>

    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <div class="tile is-child">
          <research-card v-for="(name, slug) in locale_b" :name="name" :slug="slug" :key="slug"></research-card>
        </div>
        <div class="tile is-child">
          <research-card v-for="(name, slug) in locale_s" :name="name" :slug="slug" :key="slug"></research-card>
        </div>
      </div>

      <div class="tile is-parent is-2">
        <div class="tile is-child">
          <share-button></share-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import _ from 'lodash';
import ResearchCard from '../components/ResearchCard.vue';
import ResearchWarBonus from '../components/ResearchWarBonus.vue';
import ShareButton from '../components/ShareButton.vue';
import ResearchCollections from '../components/ResearchCollections.vue';

export default {
  components: {
    ResearchCard,
    ResearchWarBonus,
    ShareButton,
    ResearchCollections
  },
  data: function() {
    return {
      locale_b: {
        economy: 'Экономические',
        warfare: 'Военные',
        spy: 'Шпионаж',
        training: 'Обучение',
        invaders: 'Захватчики',
        hero: 'Герой',
        tier5: 'Тиры I-V',
        tier6: 'Тир VI',
        tier7: 'Тир VII',
        shaman: 'Шаманы',
      },
      locale_s: {
        secreto: 'Тайные I - Нападение',
        secretd: 'Тайные I - Оборона',
        secretf: 'Тайные I - Крепости I',
        secret2ofnc: 'Тайные II - Урон',
        secret2dfnc: 'Тайные II - Защита',
        secret2hlth: 'Тайные II - Здоровье',
        secret2frtr: 'Тайные II - Крепости II',
        secret2twn:  'Тайные II - Города',
        secret2t8:   'Тайные II - Войска VIII тира'
      }
    };
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
    },
    current() {
      return this.$store.getters['research/getResearch']('current');
    },
    future() {
      return this.$store.getters['research/getResearch']('future');
    },
    future2() {
      return this.$store.getters['research/getResearch']('future2');
    }
  },
  metaInfo() {
    let description =
      'Калькулятор ресурсов и ускорений для изучения знаний в ветке ' +
      (this.locale_b[this.researchType]||this.locale_s[this.researchType]) +
      'в игре Vikings: War of Clans. Несколько уровней планирования.';
    return {
      title: 'Обзор знаний',
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: 'Обзор знаний' + ' | Vikings Planner'},
        { property: 'og:url', content: this.$baseUrl + '/research'}
      ]
    };
  },
  methods: {
    onResizeTotal: function(event) {
      console.log('resize', event);
    }
  },
  mounted() {
    //console.log('mounted', this.researchType);
    gtag('config', this.$gtag, {'page_path': '/research'});
  }
};
</script>

<style lang="scss">
</style>
