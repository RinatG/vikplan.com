<template>
  <div class="side-navigation-menu" :class="{'is-active': nav.isSideNav}">
    <!-- Categories menu -->
    <div class="category-menu-wrapper" :class="{'is-active': nav.isSideNav}">
      <!-- Menu -->
      <ul class="categories">
        <li class="square-logo">
          <!-- <img :src="menu.logoImg" alt="logo"> -->
          <span class="img w30" :class="menu.logoImg"></span>
        </li>
        <li
          v-for="(ctg, index) in menu.categories"
          :key="index"
          class="category-link"
          :class="{'is-active': nav.sideMenu == index}"
          @click="setMenu(index)"
        >
          <span v-if="ctg.icon" class="icon">
            <i class="fa" :class="ctg.icon"></i>
          </span>
          <span v-if="ctg.img" class="img w30" :class="ctg.img"></span>
          <span>{{ ctg.name }}</span>
        </li>
      </ul>
    </div>
    <div class="navigation-menu-wrapper animated preFadeInRight fadeInRight">
      <!-- Navigation Header -->
      <div class="navigation-menu-header">
        <span>{{ currentMenu.title || currentMenu.name }}</span>
        <a class="ml-auto hamburger-btn navigation-close" href="javascript:void(0);" @click="closeSideNav()" aria-label="Close">
          <span class="menu-toggle">
            <span class="icon-box-toggle active">
              <span class="rotate">
                <i class="icon-line-top"></i>
                <i class="icon-line-center"></i>
                <i class="icon-line-bottom"></i>
              </span>
            </span>
          </span>
        </a>
      </div>
      <!-- Navigation body -->
      <ul class="navigation-menu" v-if="currentMenuType == 'simple'">
        <li v-for="(submenu, subIndex) in currentMenu.items" :key="subIndex">
          <router-link class="is-submenu" :to="submenu.link" :class="{'has-new-feature': submenu.new}">
            <!-- <img v-if="submenu.img" :src="submenu.img" width="30" alt="icon"> -->
            <span v-if="submenu.img" class="img w30" :class="submenu.img"></span>
            <span v-if="submenu.icon" class="icon">
              <i class="fa" :class="submenu.icon"></i>
            </span>
            &nbsp;
            {{ submenu.name }}
          </router-link>
        </li>
      </ul>
      <ul class="navigation-menu" v-else>
        <li
          v-for="(submenu, subIndex) in currentMenu.items"
          :key="subIndex"
          class="has-children"
          :class="{active: subIndex == nav.sideSubMenu}"
          @click="toggleSubMenu(subIndex)"
        >
          <a class="parent-link" href="#" :class="{'has-new': submenu.new}">
            <span v-if="submenu.icon" class="icon">
              <i class="fa" :class="submenu.icon"></i>
            </span>
            {{ submenu.name }}
          </a>
          <ul v-show="subIndex == nav.sideSubMenu">
            <li v-for="(sub2menu, sub2Index) in submenu.items" :key="sub2Index">
              <router-link class="is-submenu" :to="sub2menu.link" :class="{'has-new-feature': sub2menu.new}">
                <!-- <img v-if="sub2menu.img" :src="sub2menu.img" width="30" alt="icon"> -->
                <span v-if="sub2menu.img" class="img w30" :class="sub2menu.img"></span>
                <span v-if="sub2menu.icon" class="icon">
                  <i class="fa" :class="sub2menu.icon"></i>
                </span>
                &nbsp;
                {{ sub2menu.name }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
  <!-- /Side navigation -->
</template>

<script>
export default {
  data: function() {
    return {
      menu: {
        logoImg: 'img-logo-60',
        categories: [
          {
            name: 'Знания',
            icon: 'fa-flask',
            isActive: false,
            title: '',
            items: [
              {
                name: 'Обзор',
                icon: 'fa-file-o',
                link: '/research'
              },
              {
                name: 'Экономические',
                img: 'research-economy',
                link: '/research/economy'
              },
              {
                name: 'Военные',
                img: 'research-warfare',
                link: '/research/warfare'
              },
              {
                name: 'Шпионаж',
                img: 'research-spy',
                link: '/research/spy',
                new: true
              },
              {
                name: 'Обучение',
                img: 'research-training',
                link: '/research/training'
              },
              {
                name: 'Захватчики',
                img: 'research-invaders',
                link: '/research/invaders'
              },
              {
                name: 'Герой',
                img: 'research-hero',
                link: '/research/hero'
              },
              {
                name: 'Войска I-V тиров',
                img: 'research-tier5',
                link: '/research/tier5'
              },
              {
                name: 'Войска VI тира',
                img: 'research-tier6',
                link: '/research/tier6'
              },
              {
                name: 'Войска VII тира',
                img: 'research-tier7',
                new: true,
                link: '/research/tier7'
              },
              {
                name: 'Шаманы',
                img: 'research-shaman',
                link: '/research/shaman'
              },
              {
                name: 'Тайные I - Нападение',
                img: 'research-secreto',
                link: '/research/secreto'
              },
              {
                name: 'Тайные I - Оборона',
                img: 'research-secretd',
                link: '/research/secretd'
              },
              {
                name: 'Тайные I - Крепости I',
                img: 'research-secretf',
                link: '/research/secretf'
              },
              {
                name: 'Тайные II - Урон',
                img: 'research-secret2ofnc',
                link: '/research/secret2ofnc'
              },
              {
                name: 'Тайные II - Защита',
                img: 'research-secret2dfnc',
                link: '/research/secret2dfnc'
              },
              {
                name: 'Тайные II - Здоровье',
                img: 'research-secret2hlth',
                link: '/research/secret2hlth'
              },
              {
                name: 'Тайные II - Крепости II',
                img: 'research-secret2frtr',
                link: '/research/secret2frtr'
              },
              {
                name: 'Тайные II - Города',
                img: 'research-secret2twn',
                link: '/research/secret2twn'
              },
              {
                name: 'Тайные II - Войска VIII тира',
                img: 'research-secret2t8',
                link: '/research/secret2t8'
              }
            ]
          },
          {
            name: 'Здания',
            icon: 'fa-fort-awesome',
            isActive: false,
            title: '',
            items: [
              {
                name: 'Здания',
                icon: 'fa-file-o',
                link: '/buildings'
              },
              {
                name: 'Дворец',
                icon: 'fa-file-o',
                link: '/buildings/01'
              },
              {
                name: 'Оракул',
                icon: 'fa-file-o',
                link: '/buildings/02'
              },
              {
                name: 'Храм Одина',
                icon: 'fa-file-o',
                link: '/buildings/03'
              }
            ]
          },
          {
            name: 'Вещи',
            icon: 'fa-puzzle-piece',
            isActive: false,
            title: '',
            items: [
              {
                name: 'Вещи и материалы',
                icon: 'fa-file-o',
                link: '/equip'
              }
            ]
          },
          // {
          //   name: 'Боевка',
          //   img: 'icons8-footman',
          //   isActive: false,
          //   title: '',
          //   items: [
          //     {
          //       name: 'Бонусы знаний',
          //       icon: 'fa-file-o',
          //       link: '/war/bonus'
          //     }
          //   ]
          // },
          {
            name: 'Добыча',
            icon: 'fa-industry',
            isActive: false,
            title: 'Выработка',
            items: [
              {
                name: 'Мои наборы',
                icon: 'fa-file-o',
                link: '/prod'
              },
              {
                name: 'Дерево',
                img: 'img-lumber',
                link: '/prod/lumber1'
              },
              {
                name: 'Серебро',
                img: 'img-silver',
                link: '/prod/silver1'
              },
              {
                name: 'Железо',
                img: 'img-iron',
                link: '/prod/iron1'
              }
            ]
          },
          {
            name: 'Помощь',
            icon: 'fa-question-circle',
            isActive: false,
            title: '',
            items: [
              {
                name: 'Знания',
                icon: 'fa-file-o',
                link: '/help/research'
              }
            ]
          },
          //   {
          //     name: 'Обучение',
          //     icon: 'fa-graduation-cap',
          //     isActive: false,
          //     title: '',
          //     items: []
          //   },
          // {
          //   name: 'Прочее',
          //   icon: 'fa-book',
          //   isActive: false,
          //   title: '',
          //   items: [
          //     {
          //       name: 'sample1',
          //       icon: 'fa-flask',
          //       items: [
          //         {
          //           name: 'sub link 1',
          //           link: '/sublink1'
          //         },
          //         {
          //           name: 'sub link 1',
          //           link: '/sublink1'
          //         },
          //         {
          //           name: 'sub link 1',
          //           link: '/sublink1'
          //         }
          //       ]
          //     },
          //     {
          //       name: 'sample2',
          //       icon: 'fa-flask',
          //       new: true,
          //       items: [
          //         {
          //           name: 'sub link 2',
          //           link: '/sublink1'
          //         },
          //         {
          //           name: 'sub link 2',
          //           new: true,
          //           link: '/sublink1'
          //         },
          //         {
          //           name: 'sub link 2',
          //           link: '/sublink1'
          //         }
          //       ]
          //     },
          //     {
          //       name: 'sample3',
          //       icon: 'fa-flask',
          //       items: [
          //         {
          //           name: 'sub link 3',
          //           link: '/sublink1'
          //         },
          //         {
          //           name: 'sub link 3',
          //           link: '/sublink1'
          //         },
          //         {
          //           name: 'sub link 3',
          //           link: '/sublink1'
          //         }
          //       ]
          //     }
          //   ]
          // }
        ]
      },
      isActive: false
    };
  },
  computed: {
    isMobile() {
      return this.$store.state.isMobile;
    },
    nav() {
      return this.$store.state.nav;
    },
    currentMenu() {
      return this.menu.categories[this.nav.sideMenu];
    },
    currentMenuType() {
      if (
        this.currentMenu.items.length > 0 &&
        this.currentMenu.items[0].items
      ) {
        return 'deep';
      } else {
        return 'simple';
      }
    },
    sidePos() {
      return this.$store.getters['nav/getSidePosition'];
    }
  },
  methods: {
    closeSideNav: function() {
      this.$store.commit('nav/toggleSideNav', false);
    },
    setMenu: function(value) {
      this.$store.commit('nav/setSideMenu', value);
    },
    toggleSubMenu(value) {
      this.$store.commit('nav/toggleSideSubMenu', value);
    }
  }
};
</script>

<style lang="scss">
</style>