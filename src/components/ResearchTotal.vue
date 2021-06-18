<template>
    <div class="tags">
        <span class="tag" title="Всего выбрано">
            <span class="img img-research w20"></span>&nbsp;
            {{ totals.count }}
        </span>
        <span class="tag" title="Могущество">
            <span class="img img-power w20"></span>&nbsp;
            {{ totals.inf | roundNumber }}
        </span>
        <span class="tag" title="Еда" v-show="totals.food > 0">
            <span class="img img-food w20"></span>
            <span v-show="Math.abs(totals.food - totals.lumber) > 1000000">
                &nbsp;{{ totals.food | roundNumber }}
            </span>
        </span>
        <span class="tag" title="Дерево" v-show="totals.lumber > 0">
            <span class="img img-lumber w20"></span>
            <span v-show="Math.abs(totals.iron - totals.lumber) > 1000000">
                &nbsp;{{ totals.lumber | roundNumber }}
            </span>
        </span>
        <span class="tag" title="Железо" v-show="totals.iron > 0">
            <span class="img img-iron w20"></span>
            <span v-show="Math.abs(totals.iron - totals.stone) > 1000000">
                &nbsp;{{ totals.iron | roundNumber }}
            </span>
        </span>
        <span class="tag" title="Камень" v-show="totals.stone > 0">
            <span class="img img-stone w20"></span>&nbsp;
            {{ totals.stone | roundNumber }}
        </span>
        <span class="tag" title="Серебро" v-show="totals.silver > 0">
            <span class="img img-silver w20"></span>&nbsp;
            {{ totals.silver | roundNumber }}
        </span>
        <span class="tag" v-show="totals.bronze > 0" title="Бронза">
            <span class="img img-bronze w20"></span>&nbsp;
            {{ totals.bronze | formatNumber }}
        </span>
        <span class="tag" v-show="totals.bronze2 > 0" title="Самородок">
            <span class="img img-goldnugget w20"></span>&nbsp;
            {{ totals.bronze2 | formatNumber }}
        </span>
        <span class="tag" v-show="totals.bronze3 > 0" title="Осколок души">
            <span class="img img-soulshard w20"></span>&nbsp;
            {{ totals.bronze3 | formatNumber }}
        </span>
        <span class="tag" v-show="totals.scroll > 0" title="Манускрипты / Тотемы / Обсидиан / Осколки душ">
            <span class="img w20" :class="{'img-scroll': totals.type != 'tier6' && totals.type != 'tier7' && !(totals.type == 'secreto' || totals.type == 'secretd' || totals.type == 'secretf'),
                    'img-totem': totals.type == 'tier6',
                    'img-obsidian': totals.type == 'tier7',
                    'img-soulshard': (totals.type == 'secreto' || totals.type == 'secretd' || totals.type == 'secretf')
                }"></span>&nbsp;
            {{ totals.scroll | roundNumber }}
        </span>
        <span class="tag" title="Время">
            <span class="img img-speed w20"></span>&nbsp;
            {{ Math.floor(totals.time / 86400) | formatNumber }}д
        </span>
        <span class="tag" v-show="totals.oracle > 0">
            Оракул {{ totals.oracle }}
        </span>
        <span class="tag">
            <button class="button is-small is-primary" @click="onSave" v-show="layer < 2">Сохранить</button>&nbsp;
            <button class="button is-small is-success" @click="onStudied" v-show="layer == 1">В изученное</button>&nbsp;
            <button class="button is-small" @click="onReset">Сброс</button>
        </span>
    </div>
</template>

<script>

export default {
    props: {
        totals: Object,
        layer: Number
    },
    methods: {
        onSave: function() {
            this.$emit('save');
        },
        onStudied: function() {
            this.$emit('studied');
        },
        onReset: function() {
            this.$emit('reset');
        }
    }
}

</script>

