import Vue from 'vue';
import _ from 'lodash';
import db from './db/buildings';
import allTechs from './db/buildings_list';

let currentResearch = {},
  futureResearch = {},
  future2Research = {},
  names = {},
  techIndex = {};

_.forEach(allTechs, (tech, index) => {
  //tech.effect_values = tech.effect_values.split(',')
  currentResearch[tech.slug] = 0;
  futureResearch[tech.slug] = 0;
  future2Research[tech.slug] = 0;
  names[tech.slug] = tech.name;
});

//console.log(names)

_.forEach(db, (tech, index) => {
  const name = names[tech.slug];
  techIndex[name + ' ' + tech.level] = index;
});

export default {
  namespaced: true,
  state: {
    selectedBonus: 'default',
    currentBonus: {
      base: 722,
      skin: 10,
      event: 20,
      boost: 35,
      repute: 0,
      hands: 33,
      cost: 13
    },
    bonusList: [],
    bonuses: {
      research1: {
        id: 'research1',
        note: 'основа',

        oracle: 54,
        skin: 10,
        event: 20,
        boost: 35,
        repute: 0,

        equipHeroHelm: 34,
        equipHeroWeapon: 41,
        equipHeroArmor: 36,
        equipHeroBoot: 40,
        equipHeroAmulet1: 43,
        equipHeroAmulet2: 43,
        equipShamanHelm: 0,
        equipShamanWeapon: 0,
        equipShamanArmor: 0,
        equipShamanBoot: 14,
        equipShamanAmulet1: 36,
        equipShamanAmulet2: 0,

        heroBonus1: 40,
        heroBonus2: 60,

        shamanBonus: 21,
        shamanBonus1: 20,
        shamanBonus2: 0,

        costHero: 10,
        costShaman1: 5,
        costShaman2: 0
      }
    },
    current: currentResearch,
    future: futureResearch,
    future2: future2Research,
    multiples: {},
    layers: {}
  },
  getters: {
    getTechList: state => techType => {
      let techs = _.filter(
        allTechs,
        tech => tech.slug.indexOf(techType + '_') === 0
      );
      return techs;
    },
    getTechEntries: state => techSlug => {
      let techs = _.filter(db, tech => tech.slug.indexOf(techSlug) === 0);
      return techs;
    },
    getLayer: state => researchType => {
      return state.layers[researchType] || 0;
    },
    getResearch: state => section => {
      return state[section];
    },
    getBonus: state => id => {
      return state.bonuses[id];
    },
    getTechNameBySlug: state => techSlug => {
      return names[techSlug];
    },
    getTech: state => techSlug => {
      let tech = _.filter(allTechs, tech => tech.slug === techSlug);
      return tech.length && tech[0];
    },
    getMultiples: state => {
      return state.multiples;
    },
    applyBonus: state => totals => {
      const cur = state.currentBonus;

      if (cur.cost) {
        let cost = state.currentBonus.cost;
        totals.food = Math.ceil(totals.food * (1 - cost / 100));
        totals.lumber = Math.ceil(totals.lumber * (1 - cost / 100));
        totals.iron = Math.ceil(totals.iron * (1 - cost / 100));
        totals.stone = Math.ceil(totals.stone * (1 - cost / 100));
      }

      totals.time_calc =
        (totals.time *
          (1 - cur.event / 100) *
          (1 - (cur.skin + cur.boost) / 100) *
          (1 - cur.repute / 100)) /
        (1 + cur.base / 100);

      //totals.time_hands = totals.time_calc * (1 - cur.hands/100);
      totals.time_hands =
        (totals.time_calc * (1 - cur.hands / 100) +
          totals.time_calc * 0.99 ** cur.hands) /
        2;

      return totals;
    },
    getTotals: (state, getters) => (section, researchType) => {
      let layer = state[section];
      let totals = {
        type: researchType,
        count: 0,
        inf: 0,
        food: 0,
        lumber: 0,
        iron: 0,
        stone: 0,
        silver: 0,
        gold: 0,
        time: 0,
        bronze: 0,
        bronze2: 0,
        bronze3: 0,
        oracle: 0
      };

      let tech, name, quantity, qtyKey;
      _.forOwn(layer, (level, slug) => {
        if (slug.indexOf(researchType) === 0) {
          while (level > 0) {
            name = names[slug];
            tech = db[techIndex[name + ' ' + level]];

            qtyKey = slug + '_' + level;
            quantity = state.multiples[qtyKey] || 1;

            totals.count += quantity;
            totals.inf += tech.inf * quantity;
            totals.food += tech.food * quantity;
            totals.lumber += tech.lumber * quantity;
            totals.iron += tech.iron * quantity;
            totals.stone += tech.stone * quantity;
            totals.silver += tech.silver * quantity;
            totals.gold += tech.gold * quantity;
            totals.time += (tech.time_days * 86400 + tech.time_seconds) * quantity;
            totals.bronze += tech.bronze * quantity;
            totals.bronze2 += tech.bronze2 * quantity;
            totals.bronze3 += tech.bronze3 * quantity;
            level -= 1;
          }
        }
      });

      return getters.applyBonus(totals);
    },
    getTotalsDiff: (state, getters) => (section, researchType) => {
      let layer = state[section],
        prevLayer = {};
      let totals = {
        type: researchType,
        count: 0,
        inf: 0,
        food: 0,
        lumber: 0,
        iron: 0,
        stone: 0,
        silver: 0,
        gold: 0,
        time: 0,
        bronze: 0,
        bronze2: 0,
        bronze3: 0,
        oracle: 0
      };

      if (section === 'future') {
        prevLayer = state['current'];
      } else if (section === 'future2') {
        prevLayer = state['future'];
      }

      let tech, name, prevLevel, quantity, qtyKey;
      _.forOwn(layer, (level, slug) => {
        if (slug.indexOf(researchType) === 0) {
          prevLevel = prevLayer[slug] || 0;
          while (level > prevLevel) {
            name = names[slug];
            tech = db[techIndex[name + ' ' + level]];

            qtyKey = slug + '_' + level;
            quantity = parseInt(state.multiples[qtyKey]) || 1;

            totals.count += quantity;
            totals.inf += tech.inf * quantity;
            totals.food += tech.food * quantity;
            totals.lumber += tech.lumber * quantity;
            totals.iron += tech.iron * quantity;
            totals.stone += tech.stone * quantity;
            totals.silver += (tech.silver || 0) * quantity;
            totals.gold += tech.gold * quantity;
            totals.time += (tech.time_days * 86400 + tech.time_seconds) * quantity;
            totals.bronze += tech.bronze * quantity;
            totals.bronze2 += (tech.bronze2 || 0) * quantity;
            totals.bronze3 += (tech.bronze3 || 0) * quantity;
            level -= 1;
          }
        }
      });

      return getters.applyBonus(totals);
    },
    getBonusBase: (state, getters) => id => {
      const bonus = state.bonuses[id];
      return (
        bonus.equipHeroHelm +
        bonus.equipHeroWeapon +
        bonus.equipHeroArmor +
        bonus.equipHeroBoot +
        bonus.equipHeroAmulet1 +
        bonus.equipHeroAmulet2 +
        bonus.equipShamanHelm +
        bonus.equipShamanWeapon +
        bonus.equipShamanArmor +
        bonus.equipShamanBoot +
        bonus.equipShamanAmulet1 +
        bonus.equipShamanAmulet2 +
        parseInt(bonus.oracle) +
        bonus.heroBonus1 +
        bonus.heroBonus2 +
        bonus.shamanBonus +
        bonus.shamanBonus1 +
        bonus.shamanBonus2
      );
    },
    getBonusTotal: (state, getters) => id => {
      const bonus = state.bonuses[id];
      return (
        getters.getBonusBase(id) +
        parseInt(bonus.skin) +
        parseInt(bonus.event) +
        parseInt(bonus.boost) +
        parseInt(bonus.repute)
      );
    },
    getCurrentBonusTotal: state => {
      const bonus = state.currentBonus;
      return (
        parseFloat(bonus.base) +
        parseInt(bonus.skin) +
        parseInt(bonus.event) +
        parseInt(bonus.boost) +
        parseInt(bonus.repute)
      );
    },
    getBonusList: (state, getters) => {
      return state.bonusList.map(id => {
        const bonus = state.bonuses[id];
        return {
          id: id,
          note: bonus.note,
          base: getters.getBonusBase(id),
          event: parseInt(bonus.event),
          boost: parseInt(bonus.boost),
          repute: parseInt(bonus.repute),
          cost: bonus.costHero + bonus.costShaman1 + bonus.costShaman2
        };
      });
    }
  },
  mutations: {
    onChangeTech(state, params) {
      let slug = params.slug,
        lvl = params.level,
        researchType = params.researchType,
        current = {};
      current[slug] = lvl;

      let layer = state.layers[researchType],
        section;

      if (layer >= 2) {
        section = 'future2';
      } else if (layer === 1) {
        section = 'future';
      } else {
        section = 'current';
      }

      //let slugs = _.map(allTechs, 'slug');

      let reqs = [],
        tech,
        t;
      let techName = names[slug] + ' ' + lvl;

      while (techName) {
        tech = db[techIndex[techName]];
        if (tech.req1) {
          t = db[techIndex[tech.req1]];
          if (!current[t.slug] || current[t.slug] < t.level) {
            current[t.slug] = t.level;
            reqs.push(tech.req1);
          }
        }
        if (tech.req2) {
          t = db[techIndex[tech.req2]];
          if (!current[t.slug] || current[t.slug] < t.level) {
            current[t.slug] = t.level;
            reqs.push(tech.req2);
          }
        }
        if (tech.req3) {
          t = db[techIndex[tech.req3]];
          if (!current[t.slug] || current[t.slug] < t.level) {
            current[t.slug] = t.level;
            reqs.push(tech.req3);
          }
        }
        techName = reqs.pop();
      }

      _.forOwn(current, (value, key) => {
        state[section][key] = Math.max(state[section][key], value);
      });
    },
    onReset(state, params) {
      let researchType = params.researchType,
        currentLayer = state.layers[researchType] || 0,
        layer = params.layer || currentLayer;

      let slugs = _.map(allTechs, 'slug');
      //slugs = _.filter(slugs, (entry) => entry.indexOf(researchType + '_') === 0);

      _.forEach(slugs, slug => {
        if (layer <= 1) {
          state.future2[slug] = 0;
          state.future[slug] = 0;
          state.current[slug] = 0;
        } else if (layer == 2) {
          state.future2[slug] = 0;
          state.future[slug] = state.current[slug];
        } else if (layer === 3) {
          state.future2[slug] = state.future[slug];
        }
      });
      Vue.set(state.layers, researchType, Math.max(layer - 1, 0));
    },
    onSave(state, params) {
      let researchType = params.researchType,
        currentLayer = state.layers[researchType] || 0,
        layer = params.layer || currentLayer + 1;

      if (currentLayer === 2) {
        // max 3 layers
        return;
      }

      if (currentLayer < layer) {
        Vue.set(state.layers, researchType, layer);
      }

      let slugs = _.map(allTechs, 'slug');
      //slugs = _.filter(slugs, (entry) => entry.indexOf(researchType + '_') === 0);

      _.forEach(slugs, slug => {
        if (layer == 1) {
          state.future[slug] = state.current[slug];
        }
        if (layer == 2) {
          state.future2[slug] = state.future[slug];
        }
      });
    },
    updateBonus(state, params) {
      if (state.bonuses[params.id]) {
        state.bonuses[params.id][params.key] = params.value;
      } else if (params.id === 'current') {
        state.currentBonus[params.key] = params.value;
      }
    },
    updateMultiples(state, params) {
      let key = params.slug + '_' + params.level;
      if (params.value > 1) {
        Vue.set(state.multiples, key, params.value);
      } else {
        Vue.delete(state.multiples, key);
      }
    },
    moveToPrevLayer(state, params) {
      let researchType = params.researchType;

      let slugs = _.map(allTechs, 'slug');

      _.forEach(slugs, (slug) => {
          if (state.future[slug] > state.current[slug]) {
              state.current[slug] = state.future[slug];
          }
          if (state.future2[slug] > state.future[slug]) {
              state.future[slug] = state.future2[slug];
          }
          state.future2[slug] = 0;
      });
      Vue.set(state.layers, researchType, 1);
  },
  }
};
