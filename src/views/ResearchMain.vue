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
      <div class="tile is-parent is-4">
        <div class="tile is-child">
          <research-card v-for="(name, slug) in locale" :name="name" :slug="slug" :key="slug"></research-card>
        </div>
      </div>

      <div class="tile is-parent is-4 is-vertical">
        <div class="tile is-child">
          <research-war-bonus></research-war-bonus>
        </div>
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
        shaman: 'Шаманы',
        secreto: 'Тайные - Нападение',
        secretd: 'Тайные - Оборона',
        secretf: 'Тайные - Крепости'
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
      this.locale[this.researchType] +
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
