<template>
  <div class="card research-card" :class="isNew?'research-card-new':''">
    <div class="card-content" :class="currentTotals.count<allCount?'card-notfull':''">
      <div class="media">
        <div class="media-left">
          <figure class="image">
            <span class="img w20" :class="'research-' + slug"></span>
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-5 has-text-justified">
            <router-link :to="'/research/' + slug">
              {{ name }}
            </router-link><span class="research_level" v-if="currentTotals.level>0">({{ currentTotals.level }}ур.)</span>
            <span class="is-pulled-right">{{ currentTotals.count }}/{{ allCount }}</span>
          </p>
        </div>
      </div>

      <div class="content">
        <div class="tags">
          <span class="tag">
            <!-- <span class="img img-power w20"></span>&nbsp; -->
            Могущество:
          </span>
          <span class="tag is-success">{{ currentTotals.inf | roundNumber }}</span>
          <span class="tag is-info">
            <span v-show="futureTotals.inf > 0">+</span>
            {{ futureTotals.inf | roundNumber }}
          </span>
          <span class="tag is-danger">
            <span v-show="future2Totals.inf > 0">+</span>
            {{ future2Totals.inf | roundNumber }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    slug: String
  },
  computed: {
    allCount() {
      return this.$store.getters['research/getAllTechCountBySlug'](this.slug);
    },
    currentTotals() {
      return this.$store.getters['research/getTotalsDiff']('current', this.slug);
    },
    futureTotals() {
      return this.$store.getters['research/getTotalsDiff']('future', this.slug);
    },
    future2Totals() {
      return this.$store.getters['research/getTotalsDiff']('future2',this.slug);
    },
    isNew() {
      return this.slug.startsWith('secret2');
    }
  },
  methods: {}
};
</script>

<style lang="scss">
.research-card .card-content {
  padding: 0.7rem 1rem;
}
.research-card.research-card-new .card-content {
  background-color: #f0f8ff;
}
.research-card {
  margin-bottom: 1px;
}
.research-card .card-content.card-notfull .image .img {
    border: 2px solid #dadada;
    border-radius: 3px;
    outline: none;
    border-color: #ffe08a;
    box-shadow: 0 0 10px #ffe08a;
}
.research-card .card-content .research_level {
    font-size: 14px;
    font-style: italic;
    padding-left: 4px;
}
</style>