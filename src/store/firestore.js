import Vue from 'vue';
import _ from 'lodash';
// This import loads the firebase namespace along with all its type information.
import firebase from "firebase/app";
// These imports load individual services into the firebase namespace.
import 'firebase/firestore';
 
const config = {
  apiKey: "AIzaSyDGrBRUUIOPXLfNzEgAZWYLhUngJz7X0nw",
  authDomain: "vikplan2.firebaseapp.com",
  databaseURL: "https://vikplan2.firebaseio.com",
  projectId: "vikplan2",
  storageBucket: "vikplan2.appspot.com",
  messagingSenderId: "721470914813",
  appId: "1:721470914813:web:257ad4fc8d58d40e2dfe94"
};
firebase.initializeApp(config);
const firestore = firebase.firestore();
const settings = { /* your settings... */ };
firestore.settings(settings);

export default {
  namespaced: true,
  state: {
    collectionsList: [],
    collections: {},
    currentCollection: ''
  },
  getters: {
    // `getters` is localized to this module's getters
    // you can use rootGetters via 4th argument of getters
    getCollection: (state, getters, rootState) => {
      return {
        research: {
          current: _.clone(rootState.research.current),
          future: _.clone(rootState.research.future),
          future2: _.clone(rootState.research.future2),
          layers: _.cloneDeep(rootState.research.layers)
        },
        war: {
          research: rootState.war.research,
          troops: rootState.war.troops,
          tier: rootState.war.tier
        }
      };
    }
  },
  mutations: {
    addCollection(state, { name, collection }) {
      if (name) {
        if (name !== 'local' && state.collectionsList.indexOf(name) == -1) {
          state.collectionsList.push(name);
        }
        state.collections[name] = collection;
      }
    },
    removeCollection(state, name) {
      if (state.currentCollection === 'name') {
        state.currentCollection = '';
      }
      state.collections[name] = null;
      const i = state.collectionsList.indexOf(name);
      Vue.delete(state.collectionsList, i);
    }
  },
  actions: {
    load({ state, commit, getters, rootState }, name) {
      return new Promise((resolve, reject) => {
        // save local collection before
        const currentColl = state.currentCollection;
        if (name !== 'local' && (currentColl === 'local' || !currentColl)) {
          const localColl = getters.getCollection;
          commit('addCollection', {
            name: 'local',
            collection: localColl
          });
        }

        // check cache
        if (state.collections[name]) {
          state.currentCollection = name;
          return resolve(state.collections[name]);
        }

        var docRef = firestore.collection('research').doc(name);

        docRef.get().then(doc => {
          if (doc.exists) {
            const coll = doc.data();

            // add collection to cache
            state.currentCollection = name;
            commit('addCollection', {
              name: name,
              collection: coll
            });

            resolve(coll);
          } else {
            resolve(false);
          }
        });
        // setTimeout(() => {
        //   //fake load
        //   const loadedColl = state.firestoreTest[name];

        //   // add collection
        //   state.currentCollection = name;
        //   commit('addCollection', {
        //     name: name,
        //     collection: loadedColl
        //   });

        //   // update state
        //   // rootState.research.current = loadedColl.research.current;
        //   // rootState.research.future = loadedColl.research.future;
        //   // rootState.research.future2 = loadedColl.research.future2;
        //   // rootState.research.layers = loadedColl.research.layers;

        //   // rootState.war.troops = loadedColl.war.troops;
        //   // rootState.war.tier = loadedColl.war.tier;

        //   resolve(loadedCall);
        // }, 3000);
      }).then(loadedColl => {
        if (!loadedColl) return false;

        // update state
        rootState.research.current = _.clone(loadedColl.research.current);
        rootState.research.future = _.clone(loadedColl.research.future);
        rootState.research.future2 = _.clone(loadedColl.research.future2);
        rootState.research.layers = _.cloneDeep(loadedColl.research.layers);

        rootState.war.troops = loadedColl.war.troops;
        rootState.war.tier = loadedColl.war.tier;

        return true;
      });
    },
    save({ state, commit, getters }, name) {
      const coll = getters.getCollection;

      return firestore
        .collection('research')
        .doc(name)
        .set({
          ...coll,
          created: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function(docRef) {
          console.log('Document written with ID: ', docRef);
          return true;
        })
        .catch(function(error) {
          console.error('Error adding document: ', error);
          return false;
        });
      // return new Promise((resolve, reject) => {
      //   //return resolve(false);
      //   const coll = getters.getCollection;
      //   setTimeout(() => {
      //     //fake save
      //     Vue.set(state.firestoreTest, name, coll);

      //     commit('addCollection', {
      //       name: name,
      //       collection: coll
      //     });
      //     resolve(true)
      //   }, 1000)
      // });
    }
  }
};
