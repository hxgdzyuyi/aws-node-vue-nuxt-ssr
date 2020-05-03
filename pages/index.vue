<template>
  <div>
    <h1>V3 This is the Front Page.</h1>
    <pre>{{data}}</pre>
  </div>
</template>

<script>
import podcastsGql from '../gql/query/podcasts.gql'

export default {
  async asyncData(context) {
    let client = context.app.apolloProvider.defaultClient

    let data = await client.query({ query: podcastsGql, variables: { page: 1 } })
    return { data };
  }
};
</script>
