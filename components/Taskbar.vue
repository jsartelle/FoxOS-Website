<template>
  <div class="taskbar">
    <div class="panel-buttons">
      <button
        v-for="[id, panel] in panels"
        class="panel-button"
        :class="{ focused: id === focusedId }"
        :key="id"
        @click.left="$emit('focus', id)"
        @click.middle="$emit('close', id)"
      >
        <button @click.stop="$emit('close', id)">✖️</button>
        {{ panel.title }}
      </button>
    </div>
    <button class="create-button" @click="createMarkdownPanel">
      Create Markdown Panel
    </button>
    <button class="create-button" @click="createWebPanel">
      Create Web Panel
    </button>
    <button class="create-button" @click="createCubePanel">CUBE</button>
  </div>
</template>

<script setup lang="ts">
import CubeStudio from '~~/components/CubeStudio.vue'
import { Panel, createPanel } from '~~/components/DesktopPanel.vue'

const { panels, focusedId } = defineProps<{
  panels: Map<string, Panel>
  focusedId?: string
}>()

const emit = defineEmits<{
  (e: 'focus', id: string): void
  (e: 'close', id: string): void
  (e: 'newPanel', panel: Panel): void
}>()

function createMarkdownPanel() {
  const path =
    window.prompt(
      'Enter path to Markdown content',
      'nested/markdown-cheatsheet'
    ) ?? undefined
  if (!path) return
  emit(
    'newPanel',
    createPanel({
      title: path,
      component: 'ContentDoc',
      props: { path },
    })
  )
}

function createWebPanel() {
  const href = window.prompt('Enter a URL', 'https://nuxtjs.org/') ?? undefined
  if (!href) return
  emit('newPanel', createPanel({ title: href, href }))
}

function createCubePanel() {
  emit(
    'newPanel',
    createPanel({
      title: 'Cube Construction Set',
      // FIXME not sure why this isn't working when passed as a string
      component: CubeStudio,
      width: 900,
    })
  )
}
</script>

<style scoped lang="scss">
.taskbar {
  height: 40px;
  background-color: darkgray;
  border-top: 1px solid black;
  display: flex;
  flex-flow: row nowrap;
}

.panel-buttons {
  flex-grow: 1;
  display: flex;
  flex-flow: row nowrap;
}

.panel-button {
  padding: 0 10px;

  &.focused {
    background-color: aqua;
  }
}

.create-button {
  background-color: transparent;
}
</style>
