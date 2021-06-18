// TODO: добавить кнопку "Перенести" в итоге (переносит техи на предыдущий уровень)
<template>
  <section class="section my-research-list" :style="{'margin-top': (25 + (!isMobile)*layer*40) + 'px'}">
    <h1 class="title" :class="{'is-2': !isMobile, 'is-4': isMobile}">Здания</h1>
    <div class="field is-grouped is-grouped-multiline">
      <!-- <div class="field is-vertical">
                <span class="label">Сэт:</span>
                <div class="field has-addons">
                    <p class="control">
                        <span class="select">
                            <select v-model="bonus.id" v-for="preset in bonusList">
                                <option value="default">-- нет --</option>
                                <option :value="preset.id">{{ preset.note }}</option>
                            </select>
                        </span>
                    </p>
                    <p class="control">
                        <router-link class="button is-success" to="/research/sets/1">
                            <span class="icon">
                                <i class="fa fa-plus"></i>
                            </span>
                            <span>Новый</span>
                        </router-link>
                    </p>
                </div>
      </div>-->
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
              <option>0</option>
              <option>2</option>
              <option>5</option>
              <option>10</option>
            </select>
          </span>
        </p>
      </div>
      <div class="field is-vertical">
        <span class="label">Бонус:</span>
        <p class="control">
          <span class="select">
            <select v-model.number="bonusEvent" aria-label="Бонус">
              <option>0</option>
              <option>10</option>
              <option>20</option>
              <option>30</option>
              <option>40</option>
            </select>
          </span>
        </p>
      </div>
      <div class="field is-vertical">
        <span class="label">Буст:</span>
        <p class="control">
          <span class="select">
            <select v-model.number="bonusBoost" aria-label="Буст">
              <option>0</option>
              <option>20</option>
              <option>30</option>
              <option>35</option>
            </select>
          </span>
        </p>
      </div>
      <div class="field is-vertical">
        <span class="label">Титул:</span>
        <p class="control">
          <span class="select">
            <select v-model.number="bonusRepute" aria-label="Титул">
              <option>0</option>
              <option>25</option>
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
              <option>0</option>
              <option>10</option>
              <option>11</option>
              <option>12</option>
              <option>13</option>
              <option>14</option>
              <option>15</option>
              <option>16</option>
              <option>17</option>
              <option>18</option>
              <option>19</option>
              <option>20</option>
              <option>21</option>
              <option>22</option>
              <option>23</option>
              <option>24</option>
              <option>25</option>
              <option>26</option>
              <option>27</option>
              <option>28</option>
              <option>29</option>
              <option>30</option>
              <option>31</option>
              <option>32</option>
              <option>33</option>
              <option>34</option>
              <option>35</option>
              <option>36</option>
              <option>37</option>
              <option>38</option>
              <option>39</option>
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
    </div>
    <div class="l-total is-hidden-tablet">
      <div class="tags">
        <span
          class="tag"
          style="width: 15vw;"
          :class="{
                    'is-success': layer == 0,
                    'is-info': layer == 1,
                    'is-danger': layer == 2
                }"
        >{{ layer }}</span>
        <span class="tag" style="width: 30vw;">
          <button
            class="button is-small is-primary"
            @click="onSaveLayer()"
            :disabled="layer >= 2"
            style="width:100%;"
          >Сохранить</button>&nbsp;
        </span>
        <span class="tag" style="width: 30vw;">
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
      <div class="tile is-vertical is-parent is-7">
        <div class="tile box">
          <detailed-total :totals="currentTotals" :layer="0" @save="onSaveLayer(1)" @reset="onReset(1)"></detailed-total>
        </div>
        <div class="tile box" v-if="layer > 0">
          <detailed-total :totals="futureTotals" :layer="1" @save="onSaveLayer(2)" @reset="onReset(2)" @studied="moveToPrevLayer"></detailed-total>
        </div>
        <div class="tile box" v-if="layer > 1">
          <detailed-total :totals="future2Totals" :layer="2" @reset="onReset(3)"></detailed-total>
        </div>
      </div>
      <div class="tile is-parent">
        <div class="tile box">
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Уровень зданий:</label>
            </div>
            <div class="control">
              <div class="select">
                <select v-model.number="minLevel" aria-label="Уровень зданий">
                  <option>1</option>
                  <option>21</option>
                  <option>31</option>
                </select>
              </div>
            </div>
            <p class="control advanced-mode">
              <label class="checkbox">
                <input type="checkbox" v-model="advancedMode">
                Продвинутый режим
              </label>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="tile is-ancestor">
      <div class="tile is-vertical is-parent">
        <div class="tile box" v-for="tech in techList">
          <div class="tile is-child is-3 research-title">
            <p class="subtitle is-6">
              <router-link :to="'/buildings/' + tech.slug.substr(-2)">{{ tech.name }}</router-link>
            </p>
          </div>
          <div class="tile is-child">
            <div class="tags" v-if="!tech.multiple || !advancedMode">
              <span
                class="tag my-tech-tag"
                v-for="(value, index) in levels"
                @click="onTechClick(tech.slug, value)"
                :class="{'is-light': value > current[tech.slug]
                                                  && value > future[tech.slug]
                                                  && value > future2[tech.slug],
                                         'is-success': value <= current[tech.slug],
                                         'is-info': value > current[tech.slug]
                                                 && layer >= 1
                                                 && value <= future[tech.slug],
                                         'is-danger': value > future[tech.slug]
                                                   && layer >= 2
                                                   && value <= future2[tech.slug]}"
              >- {{ value }} -</span>
            </div>
            <div v-else class="tags">
              <div class="field has-addons my-tech-field" v-for="(value, index) in levels">
                <p class="control">
                  <button
                    class="button is-small"
                    @click="onTechClick(tech.slug, value)"
                    :class="{'is-light': value > current[tech.slug]
                                                  && value > future[tech.slug]
                                                  && value > future2[tech.slug],
                                         'is-success': value <= current[tech.slug],
                                         'is-info': value > current[tech.slug]
                                                 && layer >= 1
                                                 && value <= future[tech.slug],
                                         'is-danger': value > future[tech.slug]
                                                   && layer >= 2
                                                   && value <= future2[tech.slug]}"
                  >- {{ value }} -</button>
                </p>
                <p class="control w30">
                  <input
                    class="input is-small"
                    type="text"
                    :value="getQuantity(tech.slug, value)"
                    @input="checkQuantity"
                    @change="onChangeQuantity(tech.slug, value, $event.target.value)"
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import _ from 'lodash';
import { store } from '../store/index';

import BaseLayout from '../partials/BaseLayout.vue';
import FixedTotal from '../components/ResearchTotal.vue';
import DetailedTotal from '../components/ResearchTotalDetailed.vue';

function getComp(param) {
  return function() {
    return store.state.buildings.currentBonus[param];
  };
}

function setComp(param) {
  return function(value) {
    store.commit('buildings/updateBonus', {
      id: 'current',
      key: param,
      value: value
    });
  };
}

export default {
  components: {
    BaseLayout,
    FixedTotal,
    DetailedTotal
  },
  data: function() {
    return {
      minLevel: 31,
      advancedMode: false,
      bonus: {
        id: 'default',
        base: 0,
        skin: 10,
        event: 20,
        boost: 35,
        repute: 0,
        cost: 13
      }
    };
  },
  computed: {
    levels() {
      let arr = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40
      ];
      return _.filter(arr, value => value >= this.minLevel);
    },
    researchType() {
      return 'building';
    },
    isMobile() {
      return this.$store.state.isMobile;
    },
    techList() {
      return this.$store.getters['buildings/getTechList'](this.researchType);
    },
    bonusList() {
      return this.$store.getters['buildings/getBonusList'];
    },
    current() {
      return this.$store.getters['buildings/getResearch']('current');
    },
    future() {
      return this.$store.getters['buildings/getResearch']('future');
    },
    future2() {
      return this.$store.getters['buildings/getResearch']('future2');
    },
    layer() {
      return this.$store.getters['buildings/getLayer'](this.researchType);
    },
    multiples() {
      return this.$store.getters['buildings/getMultiples'];
    },
    currentTotals() {
      return this.$store.getters['buildings/getTotalsDiff'](
        'current',
        this.researchType
      );
    },
    futureTotals() {
      return this.$store.getters['buildings/getTotalsDiff'](
        'future',
        this.researchType
      );
    },
    future2Totals() {
      return this.$store.getters['buildings/getTotalsDiff'](
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
    bonusTotal() {
      return this.$store.getters['buildings/getCurrentBonusTotal'];
    }
  },
  metaInfo() {
    let description =
      'Калькулятор ресурсов и ускорений для постройки зданий в игре Vikings: war of Clans. ' +
      'Дворец, оракул, храм Одина, оплот валькирий и другие здания. Несколько уровней планирования.';
    return {
      title: 'Здания',
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: 'Здания | Vikings Planner' },
        { property: 'og:url', content: this.$baseUrl + '/buildings' }
      ]
    };
  },
  methods: {
    onTechClick: function(slug, level) {
      this.$store.commit('buildings/onChangeTech', {
        slug: slug,
        level: level,
        researchType: this.researchType
      });
    },
    onReset: function(layer) {
      this.$store.commit('buildings/onReset', {
        layer: layer,
        researchType: this.researchType
      });
    },
    onResetMobile: function() {
      let layer = this.layer;

      if (layer === 2 && !_.isEqual(this.future, this.future2)) {
        layer = 3;
      }
      if (layer === 1 && !_.isEqual(this.future, this.current)) {
        layer = 2;
      }

      this.$store.commit('buildings/onReset', {
        layer: layer,
        researchType: this.researchType
      });
    },
    onSaveLayer: function(layer) {
      this.$store.commit('buildings/onSave', {
        layer: layer,
        researchType: this.researchType
      });
    },
    onResizeTotal: function(event) {
      //console.log('resize', event);
    },
    getQuantity(slug, level) {
      let key = slug + '_' + level;
      return this.multiples[key] || 1;
    },
    onChangeQuantity: function(slug, level, value) {
      this.$store.commit('buildings/updateMultiples', {
        slug,
        level,
        value
      });
    },
    checkQuantity(event) {
      let value = event.target.value;
      let re = /^([1-9]|1\d|2[01-5])$/; // max 25

      if (!re.test(value)) {
        event.target.value = value.substr(0, value.length - 1);
      }
    },
    moveToPrevLayer: function(layer) {
      this.$store.commit('buildings/moveToPrevLayer', {
        from: 'future',
        to: 'current',
        researchType: this.researchType
      });
    },
  },
  mounted() {
    //console.log('mounted', this.researchType);
    gtag('config', this.$gtag, { page_path: '/buildings' });
  }
};
</script>

<style lang="scss">
.w30 {
  width: 30px;
}
.my-tech-field {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
@media (min-width: 768px) {
  .advanced-mode {
    margin-left: 1rem;
  }
}
.advanced-mode {
  padding-top: 0.5rem;
}
</style>
