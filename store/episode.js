import Vue from 'vue'
import { normalize, schema } from 'normalizr'

import episodeGql from '~/gql/query/episode.gql'

const podcastSchema = new schema.Entity('podcasts')
const sentenceSchema = new schema.Entity('sentences')
const episodeSchema = new schema.Entity('episodes', {
  podcast: podcastSchema,
  sentences: { data: [sentenceSchema] }
})

export const state = () => ({
  episodeMap: {}
})

export const getters = {
  episodeMap: ({ episodeMap }) => episodeMap
}

export const mutations = {
  setEpisodes(state, { entities: { episodes } }) {
    Object.keys(episodes).forEach((id) => {
      Vue.set(state.episodeMap, id, episodes[id])
    })
  },
  setEpisode(state, { entities: { episodes }, result: id }) {
    const episode = episodes[id]

    if (state.episodeMap[id]) {
      const {
        sentences: { data }
      } = state.episodeMap[id]

      episode.sentences.data = [
        ...new Set([...data, ...episode.sentences.data])
      ]
    }

    Vue.set(state.episodeMap, id, episode)
  }
}

export const actions = {
  getEpisode({ commit }, { id, page = 1 } = {}) {
    const client = this.app.apolloProvider.defaultClient

    return client
      .query({ query: episodeGql, variables: { id, page } })
      .then(({ data: { episode } }) => {
        const normalized = normalize(episode, episodeSchema)

        const {
          entities: { podcasts, episodes }
        } = normalized

        const [podcastId] = Object.keys(podcasts)

        podcasts[podcastId].episodes = {
          data: Object.keys(episodes),
          paginatorInfo: {
            currentPage: 1,
            hasMorePages: false
          }
        }

        commit('setEpisode', normalized)
        commit(
          'podcast/setPodcast',
          { entities: { podcasts }, result: podcastId },
          { root: true }
        )
        commit('sentence/setSentences', normalized, { root: true })
      })
  }
}
