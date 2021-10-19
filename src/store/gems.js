import Vue from 'vue'
import _ from 'lodash'
import gems from './db/gems'

let currentSet = {}
    currentEffects = {};

export default {
    namespaced: true,
    state: {

    },
    getters: {
        getGemList: (state) => {
            return gems;
        },
        getGemSet: (state) => {
            return currentSet;
        },
        getEffects: (state) => {
            return currentEffects;
        }
    },
    mutations: {
        onChangeGemSet(state, params) {

        }
    }
}