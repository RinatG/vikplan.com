// TODO: добавить кнопку "Перенести" в итоге (переносит техи на предыдущий уровень)
<template>
  <section class="section my-research-list" :style="{'margin-top': (25 + (!isMobile)*layer*40) + 'px'}">
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li><router-link to="/">ВикПлан</router-link></li>
        <li><router-link to="/research">Знания</router-link></li>
        <li class="is-active">
          <a href="#" aria-current="page">{{ locale[researchType] }}</a>
        </li>
      </ul>
    </nav>
    <h1 class="title" :class="{'is-2': !isMobile, 'is-4': isMobile}">Знания - {{ locale[researchType] }}</h1>
    <p class="subtitle">
      <router-link to="/help/research">Помощь</router-link>
    </p>
    <div class="field is-grouped is-grouped-multiline">
      <div class="field is-vertical">
        <span class="label">База:</span>
        <p class="control">
          <input class="input" type="text" v-model.number.lazy="bonusBase" style="width:60px;" aria-label="База">
        </p>
      </div>
      <div class="field is-vertical">
        <span class="label">Скин:</span>
        <p class="control">
          <span class="select">
            <select v-model.number="bonusSkin" aria-label="Скин">
              <option v-for="n in [0,2,5,10]">{{n}}</option>
            </select>
          </span>
        </p>
      </div>
      <div class="field is-vertical">
        <span class="label">Бонус:</span>
        <p class="control">
          <span class="select">
            <select v-model.number="bonusEvent" aria-label="Бонус">
              <option v-for="n in [0,10,20,30,40,50]">{{n}}</option>
            </select>
          </span>
        </p>
      </div>
      <div class="field is-vertical">
        <span class="label">Буст:</span>
        <p class="control">
          <span class="select">
            <select v-model.number="bonusBoost" aria-label="Буст">
              <option v-for="n in [0,20,30,35]">{{n}}</option>
            </select>
          </span>
        </p>
      </div>
      <div class="field is-vertical">
        <span class="label">Титул:</span>
        <p class="control">
          <span class="select">
            <select v-model.number="bonusRepute" aria-label="Титул">
              <option v-for="n in [0,25]">{{n}}</option>
            </select>
          </span>
        </p>
      </div>
      <div class="field is-vertical">
        <span class="label">Всего:</span>
        <p class="control">
          <input class="input" type="text" v-model.number="bonusTotal" style="width:60px;" disabled aria-label="Всего">
        </p>
      </div>
      <div class="field is-vertical">
        <span class="label">Ручки:</span>
        <p class="control">
          <span class="select">
            <select v-model.number="bonusHands" aria-label="Помощь клана">
              <option v-for="n in [0,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39]">{{n}}</option>
            </select>
          </span>
        </p>
      </div>
      <div class="field is-vertical">
        <span class="label">Стоимость:</span>
        <p class="control">
          <input class="input" type="text" v-model.number.lazy="bonusCost" style="width:60px;" aria-label="Стоимость">
        </p>
      </div>
      <div class="field is-vertical" v-if="researchType.startsWith('secret')">
        <span class="label">Уровень: <i class="fa fa-info-circle" title="применяется только к текущей ветке"></i></span>
        <p class="control">
          <span class="select">
            <select v-model.number="bonusLevel" aria-label="Уровень">
              <option v-for="n in Array(researchType.startsWith('secret2')?6:3).fill().map((x,i)=>i+1)">{{n}}</option>
            </select>
          </span>
        </p>
      </div>
    </div>
    <div class="l-total is-hidden-tablet">
      <div class="tags">
        <span
          class="tag"
          style="width: 10vw;"
          :class="{
                    'is-success': layer == 0,
                    'is-info': layer == 1,
                    'is-danger': layer == 2
                }"
        >{{ layer }}</span>
        <span class="tag" style="width: 27vw;">
          <button
            class="button is-small is-primary"
            @click="onSaveLayer()"
            :disabled="layer >= 2"
            style="width:100%;"
          >Сохранить</button>&nbsp;
        </span>
        <span class="tag" style="width: 22vw;">
          <button
            class="button is-small is-success"
            @click="onSaveLayer()"
            :disabled="layer != 1"
            style="width:100%;"
          >В изученное</button>&nbsp;
        </span>
        <span class="tag" style="width: 15vw;">
          <button class="button is-small" @click="onResetMobile()" style="width:100%;">Сброс</button>
        </span>
      </div>
    </div>
    <div class="l-total is-hidden-mobile">
      <fixed-total :totals="currentTotals" :layer="0" @save="onSaveLayer(1)" @reset="onReset(1)"></fixed-total>
      <fixed-total :totals="futureTotals" :layer="1" @save="onSaveLayer(2)" @reset="onReset(2)" @studied="moveToPrevLayer" v-if="layer > 0"></fixed-total>
      <fixed-total :totals="future2Totals" :layer="2" @reset="onReset(3)" v-if="layer > 1"></fixed-total>
    </div>
    <div class="tile is-ancestor">
      <div class="tile is-vertical is-parent">
        <div class="tile box">
          <detailed-total :totals="currentTotals" :layer="0" @save="onSaveLayer(1)" @reset="onReset(1)"></detailed-total>
        </div>
        <div class="tile box" v-if="layer > 0">
          <detailed-total :totals="futureTotals" :layer="1" @save="onSaveLayer(2)" @reset="onReset(2)" @studied="moveToPrevLayer"></detailed-total>
        </div>
        <div class="tile box" v-if="layer > 1">
          <detailed-total :totals="future2Totals" :layer="2" @reset="onReset(3)"></detailed-total>
        </div>
        <div class="tile box" v-for="tech in techList">
          <div class="tile is-child is-3 research-title">
            <p class="subtitle is-6">
              <router-link :to="'/research/' + tech.slug.replace('_', '/')">{{ tech.name }}</router-link>
            </p>
          </div>
          <div class="tile is-child">
            <div class="tags">
              <span
                class="tag my-tech-tag"
                v-for="(value, index) in tech.effect_values"
                @click="onTechClick(tech.slug, index)"
                :class="{'is-light': index >= current[tech.slug]
                                                  && index >= future[tech.slug]
                                                  && index >= future2[tech.slug],
                                         'is-success': index < current[tech.slug],
                                         'is-info': index >= current[tech.slug]
                                                 && layer >= 1
                                                 && index < future[tech.slug],
                                         'is-danger': index >= future[tech.slug]
                                                   && layer >= 2
                                                   && index < future2[tech.slug]}"
              >{{ index + 1 }} - {{ value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import _ from 'lodash';
import { store } from '../store/index';

import BaseLayout from '../partials/BaseLayout.vue';
import FixedTotal from '../components/ResearchTotal.vue';
import DetailedTotal from '../components/ResearchTotalDetailed.vue';

function getComp(param) {
  return function() {
    return store.state.research.currentBonus[param];
  };
}

function setComp(param) {
  return function(value) {
    store.commit('research/updateBonus', {
      id: 'current',
      key: param,
      value: value
    });
  };
}

function getCompL(researchType, param) {
  return getComp(researchType+'_'+param)() || 1;
}

function setCompL(researchType, param, value) {
  setComp(researchType+'_'+param)(value);
}

export default {
  components: {
    BaseLayout,
    FixedTotal,
    DetailedTotal
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
        secretf: 'Тайные - Крепости',
        secret2ofnc: 'Тайные II - Урон',
        secret2dfnc: 'Тайные II - Защита',
        secret2hlth: 'Тайные II - Здоровье',
        secret2frtr: 'Тайные II - Крепости II',
        secret2twn:  'Тайные II - Города',
        secret2t8:   'Тайные II - Войска VIII тира'
      },
      bonus: {
        id: 'default',
        base: 0,
        skin: 10,
        event: 20,
        boost: 35,
        repute: 0,
        cost: 13,
        level: 1
      }
    };
  },
  computed: {
    researchType() {
      return this.$route.params.type;
    },
    isMobile() {
      return this.$store.state.isMobile;
    },
    techList() {
      return this.$store.getters['research/getTechList'](this.researchType);
    },
    bonusList() {
      return this.$store.getters['research/getBonusList'];
    },
    current() {
      return this.$store.getters['research/getResearch']('current');
    },
    future() {
      return this.$store.getters['research/getResearch']('future');
    },
    future2() {
      return this.$store.getters['research/getResearch']('future2');
    },
    layer() {
      return this.$store.getters['research/getLayer'](this.researchType);
    },
    currentTotals() {
      return this.$store.getters['research/getTotalsDiff'](
        'current',
        this.researchType
      );
    },
    futureTotals() {
      return this.$store.getters['research/getTotalsDiff'](
        'future',
        this.researchType
      );
    },
    future2Totals() {
      return this.$store.getters['research/getTotalsDiff'](
        'future2',
        this.researchType
      );
    },
    bonusCost: {
      get: getComp('cost'),
      set: setComp('cost')
    },
    bonusBase: {
      get: getComp('base'),
      set: setComp('base')
    },
    bonusEvent: {
      get: getComp('event'),
      set: setComp('event')
    },
    bonusSkin: {
      get: getComp('skin'),
      set: setComp('skin')
    },
    bonusBoost: {
      get: getComp('boost'),
      set: setComp('boost')
    },
    bonusRepute: {
      get: getComp('repute'),
      set: setComp('repute')
    },
    bonusHands: {
      get: getComp('hands'),
      set: setComp('hands')
    },
    bonusLevel: {
      get: function() { return getCompL(this.researchType, 'level'); },
      set: function(value) { setCompL(this.researchType, 'level', value); }
    },
    bonusTotal() {
      return this.$store.getters['research/getCurrentBonusTotal'];
    }
  },
  metaInfo() {
    let description =
      'Калькулятор ресурсов и ускорений для изучения знаний в ветке ' +
      this.locale[this.researchType] +
      'в игре Vikings: War of Clans. Несколько уровней планирования.';
    return {
      title: 'Знания - ' + this.locale[this.researchType],
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: 'Знания - ' + this.locale[this.researchType] + ' | Vikings Planner'},
        { property: 'og:url', content: this.$baseUrl + '/research/' + this.researchType}
      ]
    };
  },
  methods: {
    onTechClick: function(slug, level) {
      this.$store.commit('research/onChangeTech', {
        slug: slug,
        level: level + 1,
        researchType: this.researchType
      });
    },
    onReset: function(layer) {
      this.$store.commit('research/onReset', {
        layer: layer,
        researchType: this.researchType
      });
    },
    onResetMobile: function() {
      let layer = this.layer;

      if (layer === 2 && this.future2Totals.count > 0) {
        layer = 3;
      }
      if (layer === 1 && this.futureTotals.count > 0) {
        layer = 2;
      }

      this.$store.commit('research/onReset', {
        layer: layer,
        researchType: this.researchType
      });
    },
    onSaveLayer: function(layer) {
      this.$store.commit('research/onSave', {
        layer: layer,
        researchType: this.researchType
      });
    },
    moveToPrevLayer: function(layer) {
      this.$store.commit('research/moveToPrevLayer', {
        from: 'future',
        to: 'current',
        researchType: this.researchType
      });
    },
    onResizeTotal: function(event) {
      console.log('resize', event);
    }
  },
  mounted() {
    //console.log('mounted', this.researchType);
    gtag('config', this.$gtag, {'page_path': '/research/' + this.researchType});
  }
};
</script>

<style lang="scss">
@media (min-width: 768px) {
  .l-total {
    position: fixed;
    top: 70px;
    z-index: 100;
    opacity: 1;
  }

  .l-total .tags {
    background-color: whitesmoke;
    padding: 0.25em 0.5em;
    border-radius: 5px;
    margin-bottom: 0.5em;
  }

  .l-total .tag {
    padding: 0;
    margin-bottom: 0;
    font-size: 0.9rem;
  }

  .section.my-research-list {
    padding-top: 2rem;
  }

  .section.my-research-list .tile.box {
    padding: 0.75rem 1rem;
  }
}

@media (max-width: 767px) {
  .l-total {
    position: fixed;
    top: 70px;
    z-index: 100;
    opacity: 1;
    width: 87vw;
  }

  .l-total .tags {
    background-color: whitesmoke;
    padding: 0.25em 0.5em;
    border-radius: 5px;
    margin-bottom: 0.5em;
    justify-content: space-between;
  }

  .l-total .tag {
    padding: 0;
    margin-bottom: 0;
    font-size: 0.9rem;
  }

  .section.my-research-list {
    padding-top: 2rem;
  }

  .my-research-list .research-title {
    margin-bottom: 10px !important;
  }
}

.my-tech-tag {
  cursor: pointer;
}

.field.is-vertical {
  flex-direction: column;
  margin-right: 10px;
}

.field.is-vertical .label {
  font-size: 0.9rem;
  margin: 0;
  font-weight: 500;
}

.section.my-research-list .tile.box {
  margin-bottom: 1rem;
}
</style>
