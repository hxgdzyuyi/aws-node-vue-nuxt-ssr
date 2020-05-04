import Vue from 'vue'

import { normalize, schema } from 'normalizr'

import podcastGql from '~/gql/query/podcast.gql'
import podcastsGql from '~/gql/query/podcasts.gql'

const episodeSchema = new schema.Entity('episodes')
const podcastSchema = new schema.Entity('podcasts', {
  episodes: { data: [episodeSchema] }
})

const podcastsSchema = [podcastSchema]

export const state = () => ({
  podcastMap: {},
  latest: [],
  paging: {
    latest: {
      page: 1,
      finished: true
    }
  }
})

export const getters = {
  latest: ({ podcastMap, latest, paging }) => ({
    podcasts: latest.map((id) => podcastMap[id]),
    paging: paging.latest
  }),
  podcastMap: ({ podcastMap }) => podcastMap
}

export const mutations = {
  setLatest(state, { entities: { podcasts }, result }) {
    Object.keys(podcasts).forEach((id) => {
      Vue.set(state.podcastMap, id, podcasts[id])
    })

    state.latest = [...new Set([...state.latest, ...result])]
  },
  setPaginator(state, paginator) {
    const { key, value } = paginator

    state.paging[key] = value
  },
  setPodcast(state, { entities: { podcasts }, result: id }) {
    const podcast = podcasts[id]

    if (state.podcastMap[id]) {
      const {
        episodes: { data }
      } = state.podcastMap[id]

      podcast.episodes.data = [...new Set([...data, ...podcast.episodes.data])]
    }

    Vue.set(state.podcastMap, id, podcast)
  }
}

export const actions = {
  getPodcasts({ commit }, { page = 1 } = {}) {
    const client = this.app.apolloProvider.defaultClient

    return client.query({ query: podcastsGql, variables: { page } }).then(
      ({
        data: {
          podcasts: {
            data,
            paginatorInfo: { currentPage, hasMorePages }
          }
        }
      }) => {
        const podcasts = data.map((podcast) => ({
          ...podcast,
          episodes: {
            data: [],
            paginatorInfo: {
              currentPage: 1,
              hasMorePages: false
            }
          }
        }))
        const normalized = normalize(podcasts, podcastsSchema)
        const paging = {
          page: hasMorePages ? currentPage + 1 : currentPage,
          finished: !hasMorePages
        }

        commit('setLatest', normalized)
        commit('setPaginator', {
          key: 'latest',
          value: paging
        })
      }
    )
  },
  getPodcast({ commit }, { id, page = 1 } = {}) {
    const client = this.app.apolloProvider.defaultClient

    return client
      .query({ query: podcastGql, variables: { id, page } })
      .then(({ data: { podcast } }) => {
        const normalized = normalize(podcast, podcastSchema)

        const {
          entities: { episodes }
        } = normalized

        Object.keys(episodes).forEach((id) => {
          episodes[id].sentences = {
            data: [],
            paginatorInfo: {
              currentPage: 1,
              hasMorePages: false
            }
          }
        })

        commit('setPodcast', normalized)
        commit('episode/setEpisodes', normalized, { root: true })
      })
  }
}
