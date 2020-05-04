export const state = () => ({
  sentenceMap: {}
})

export const getters = {
  sentenceMap: ({ sentenceMap }) => sentenceMap
}

export const mutations = {
  setSentences(state, { entities: { sentences } }) {
    state.sentenceMap = { ...state.sentenceMap, ...sentences }
  }
}

export const actions = {
  getSentence({ commit }, { id }) {}
}
