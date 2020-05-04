<style lang="stylus" scoped>
.mod-podcast
  padding 24px

  .hd
    margin 0 auto 10px

    img
      display block
      width 100%
</style>

<template lang="pug">
  .page-index
    van-list(
      v-model="loading"
      :finished="latest.paging.finished"
      @load="getLatest"
    )
      .mod-podcast(
        v-for="item in latest.podcasts"
        :key="item.id"
      )
        nuxt-link(:to="`/podcasts/${item.id}`")
          .hd
            img(:src="item.image_url" :alt="item.title")
          .bd
            h3.title {{item.title}}
            .meta
              .category {{item.itunes_category.join(', ')}}
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import Logo from '~/components/Logo.vue'

export default {
  data() {
    return {
      loading: true
    }
  },
  computed: {
    ...mapGetters({ latest: 'podcast/latest' })
  },
  mounted() {
    this.getLatest()
  },
  methods: {
    ...mapActions({ getPodcasts: 'podcast/getPodcasts' }),
    getLatest() {
      const {
        latest: {
          paging: { page }
        }
      } = this

      this.loading = true

      this.loading = true
      return this.getPodcasts({ page }).then(() => (this.loading = false))
    }
  }
}
</script>
