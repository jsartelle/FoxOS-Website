<template>
  <ContentDoc :path="path" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const path = $ref(
  route.path.replace('/content', '').replaceAll('%20', '-').toLowerCase()
)
</script>
