<template lang="pug">
  div(:class="$style.container")
    div(:class="$style.header")
      div
        img.img-circle(:src="$util.imgPath('')")
      div 餐饮场馆

    div(v-for="menu in menuList")
      div(:class="$style.menuName") {{menu.menuName}}
      menu-item(:class="$style.menuItem", :menus="menu.children", :originMenu="menuList", v-if="menu.children && menu.children.length")
</template>

<script>
  import MenuItem from './MenuItem'

  export default {
    name: 'LeftMenu',
    components: {
      MenuItem
    },
    data() {
      return {
        menuList: []
      }
    },
    watch: {
      menuList(newVal) {
        this.recursion(newVal)
      }
    },
    async created() {
      const data = (await this.$http.post('/manage/staff-manage-pc/get-org-right')).data
      this.recursion(data.data.leftMenu)
      this.menuList = data.data.leftMenu
    },
    methods: {
      recursionByTab(menus, currTab) {
        menus.forEach(m => {
          if (currTab && m.menuRouter === currTab) {
            m.selected = true
          } else {
            m.selected = false
          }

          if (m.children.length) {
            this.recursionByTab(m.children, currTab)
          }
        })
      },
      recursion(menu) {
        menu.forEach(m => {
          m.show = false
          m.selected = false

          if (m.children.length) {
            this.recursion(m.children)
          }
        })
      },
      showIconColor(menu) {
        let show = false
        if (menu.level === '0') {
          if (menu.children.length > 0) {
            menu.children.forEach(item => {
              if (item.children.length <= 0 && item.selected) {
                show = true
              }
              if (item.children.length > 0) {
                item.children.forEach(item => {
                  if (item.selected) {
                    show = true
                  }
                })
              }
            })
          } else if (menu.selected) {
            show = true
          }
        }
        return show
      }
    }
  }
</script>

<style module lang="stylus">
  .container
    position fixed
    left 0
    top 0
    bottom 0
    width 200px
    padding-top 50px
    background-color #2a2f34
    z-index 300
    color $reverse-color
    overflow-y auto

    .menu-icon
      padding-top 10px

    .menu-icon-list
      width 80px
      height 41px
      font-size 20px
      line-height 41px
      color #7d868b
      text-align center
      display flex
      justify-content space-between
      align-items center

      .selected-line
        height 100%
        border-left 4px solid #1587cd
        position relative
        left 0

      i
        font-size 16px
        margin-right 29px


    .menu-icon-list-selected
      background-color rgba(#1587cd, 0.09)
      color #1587cd

    .menu-level-menu
      position relative
      left 0
      top 0
      width 200px
      box-shadow 5px 0 13px 1px rgba(60, 73, 82, 0.11)
      overflow-y auto
      &::-webkit-scrollbar
        display none


  .header
    position fixed
    top 0
    left 0
    width 200px
    display flex
    padding 8px 10px
    align-items center
    background-color #2a2f34
    z-index 2

    > div:first-child
      > img
        width 30px
        height 30px

    > div:nth-child(2)
      padding 0 5px
      font-weight bold
      font-size 16px
      line-height 34px
      white-space nowrap
      overflow hidden
      text-overflow ellipsis

  .menuName
    padding 10px 25px 6px
    font-size 18px
    font-weight 500


</style>
