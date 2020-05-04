<style lang="stylus" scoped>
.mod-podcast
  padding 24px

  .hd
    margin 0 auto 10px

    img
      display block
      width 100%

.mod-episode
  margin-bottom 20px

  .hd
    padding 0 24px
</style>

<template lang="pug">
  .page-podcast
    .mod-podcast
      .hd
        img(:src="podcast.image_url" :alt="podcast.title")
      .bd
        h3.title {{podcast.title}}
        .meta
          .category {{podcast.itunes_category.join(', ')}}
      .ft {{podcast.description}}

    van-list.mod-episodes(
      v-if="episodes.data.length"
      v-model="loading"
      :finished="episodes.paging.finished"
      @load="getDetail"
    )
      .mod-episode(
        v-for="item in episodes.data"
        :key="item.id"
      )
        nuxt-link(:to="`/podcasts/${podcast.id}/episodes/${item.id}`")
          .hd
            h4.title {{item.title}}
            span {{item.updated_at}}
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      podcastMap: 'podcast/podcastMap',
      episodeMap: 'episode/episodeMap'
    }),
    podcast() {
      const { id } = this.$route.params

      return (
        this.podcastMap[id] || {
          id,
          title: '',
          image_url: '',
          itunes_category: [],
          description: '',
          episodes: {
            data: [],
            paginatorInfo: {
              currentPage: 1,
              hasMorePages: false
            }
          }
        }
      )
    },
    episodes() {
      const {
        podcast: {
          episodes: {
            data,
            paginatorInfo: { currentPage, hasMorePages }
          }
        },
        episodeMap
      } = this

      return {
        data: data.map((id) => episodeMap[id]),
        paging: {
          page: hasMorePages ? currentPage + 1 : currentPage,
          finished: !hasMorePages
        }
      }
    }
  },
  async mounted() {
    await this.getDetail()
  },
  methods: {
    ...mapActions({ getPodcast: 'podcast/getPodcast' }),
    getDetail() {
      const { id } = this.$route.params
      const {
        episodes: {
          paging: { page }
        }
      } = this
      this.loading = true

      return this.getPodcast({ id, page }).then(() => {
        this.loading = false
      })
    }
  }
}
</script>
