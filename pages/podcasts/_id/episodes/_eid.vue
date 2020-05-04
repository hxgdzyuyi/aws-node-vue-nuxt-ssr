<style lang="stylus" scoped>
.page-episode
  height 100vh
  display flex
  flex-direction column
  justify-content flex-start

  > .hd
    height 180px
    padding 20px
    box-shadow 0 1px 1px 0 rgba(0, 0, 0, 0.03)

  > .bd
    height calc(100vh - 180px)
    overflow-y scroll

.mod-podcast
  display flex
  justify-content flex-start
  align-items center

  .hd
    width 80px
    margin-right 10px

    img
      display block
      width 100%

  .bd
    flex-grow 1

  h3
    font-size 14px
    margin-bottom 5px

  h4
    font-size 12px
    color #333

.mod-episode
  margin-top 20px

  .player
    width 100%

.mod-sentence
  padding 10px 24px
  border 1px solid #fafafa

.active
  background-color #eee
</style>

<template lang="pug">
  .page-episode
    .hd
      .mod-podcast
        .hd
          img(:src="podcast.image_url" :alt="podcast.title")
        .bd
          h3 {{episode.title}}
          h4 {{podcast.title}}

      .mod-episode
        .hd
          audio.player(
            controls
            :src="episode.enclosure_url"
            @timeupdate="onTimeupdate"
            @play="onPlay"
            @ended="onEnded"
          )
            span Your browser does not support the audio element.

    .bd
      van-list.mod-sentences(
        v-if="sentences.data.length"
        v-model="loading"
        :finished="sentences.paging.finished"
        @load="getDetail"
      )
        .mod-sentence(
          v-for="(item, i) in sentences.data"
          :id="'sentence-' + item.id"
          :key="item.id"
          :class="currentIdx === i ? 'active' : ''"
        )
          .hd {{item.en_text}}
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      loading: true,
      currentIdx: -1,
      ended: false
    }
  },
  computed: {
    ...mapGetters({
      podcastMap: 'podcast/podcastMap',
      episodeMap: 'episode/episodeMap',
      sentenceMap: 'sentence/sentenceMap'
    }),
    podcast() {
      const {
        $route: {
          params: { id }
        },
        podcastMap
      } = this

      return (
        podcastMap[id] || {
          title: '',
          image_url: ''
        }
      )
    },
    episode() {
      const {
        $route: {
          params: { eid }
        },
        episodeMap
      } = this

      return (
        episodeMap[eid] || {
          title: '',
          sentences: {
            data: [],
            paginatorInfo: {
              currentPage: 1,
              hasMorePages: false
            }
          }
        }
      )
    },
    sentences() {
      const {
        episode: {
          sentences: {
            data,
            paginatorInfo: { currentPage, hasMorePages }
          }
        },
        sentenceMap
      } = this

      return {
        data: data.map((id) => sentenceMap[id]),
        paging: {
          page: hasMorePages ? currentPage + 1 : currentPage,
          finished: !hasMorePages
        }
      }
    }
  },
  watch: {
    currentIdx(idx) {
      const {
        sentences: { data }
      } = this
      const options = {
        container: '.page-episode > .bd',
        easing: 'ease-in',
        offset: 0,
        force: true,
        cancelable: true,
        onStart(element) {},
        onDone(element) {},
        onCancel() {},
        x: false,
        y: true
      }

      let id = data[0].id

      if (idx > 0) {
        id = data[idx - 1].id
      }

      this.$scrollTo(`#sentence-${id}`, 500, options)
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    ...mapActions({ getEpisode: 'episode/getEpisode' }),
    getDetail() {
      const {
        $route: {
          params: { eid: id }
        },
        sentences: {
          paging: { page }
        }
      } = this

      this.loading = true

      return this.getEpisode({ id, page }).then(() => {
        this.loading = false
      })
    },
    onTimeupdate({ target: { currentTime } }) {
      const {
        currentIdx,
        sentences: { data }
      } = this

      if (currentIdx >= data.length - 1) {
        return
      }

      if (currentIdx < 0) {
        this.currentIdx = 0
      } else if (currentTime >= data[currentIdx].end_time) {
        this.currentIdx = currentIdx + 1
      }
    },
    onPlay() {
      const { ended } = this

      if (ended) {
        this.currentIdx = 0
        this.ended = false
      }
    },
    onEnded() {
      this.ended = true
    }
  }
}
</script>
