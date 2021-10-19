import Home from './views/Home.vue'
import ProdEditor from './views/ProdEditor.vue'
import ProdList from './views/ProdList.vue'
import Equipment from './views/Equipment.vue'
import ResearchList from './views/ResearchList.vue'
import ResearchEdit from './views/ResearchEdit.vue'
import ResearchSetEditor from './views/ResearchSetEditor.vue'
import HelpResearch from './views/HelpResearch.vue'
import BuildingList from './views/BuildingList.vue'
import BuildingEdit from './views/BuildingEdit.vue'
import WarBonus from './views/WarBonus.vue'
import ResearchMain from './views/ResearchMain.vue'
import Loader from './views/Loader.vue'

export const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/prod/:id',
    component: ProdEditor
  },
  {
    path: '/prod',
    component: ProdList
  },
  {
    path: '/equip',
    component: Equipment
  },
  {
    path: '/gems',
    component: GemsList
  },
  {
    path: '/research',
    component: ResearchMain
  },
  {
    path: '/research/:type',
    component: ResearchList
  },
  {
    path: '/research/sets/:id',
    component: ResearchSetEditor
  },
  {
    path: '/research/:type/:id',
    component: ResearchEdit
  },
  {
    path: '/buildings',
    component: BuildingList
  },
  {
    path: '/buildings/:id',
    component: BuildingEdit
  },
  {
    path: '/help/research',
    component: HelpResearch
  },
  {
    path: '/war/bonus',
    component: WarBonus
  },
  {
    path: '/r/:name',
    component: Loader
  }
]
