<template>
  <main class="desktop" @mousemove="updateMouse" @mouseup="releaseMouse">
    <div class="panels">
      <DesktopPanel
        v-for="[id, panel] in panels"
        :key="id"
        v-bind="panel"
        :order="panelOrder.indexOf(id)"
        @focus="focusPanel"
        @grab="startDragPanel"
        @close="closePanel"
        @minimize="minimizePanel"
        @maximize="maximizePanel"
        @resize="resizePanel"
      >
        <component
          v-if="panel.component"
          :is="panel.component"
          v-bind="panel.props"
        />
        <iframe
          v-else-if="panel.href"
          width="100%"
          height="100%"
          :src="panel.href"
        ></iframe>
      </DesktopPanel>
    </div>
    <button @click="() => createMarkdownPanel()">Create Markdown Panel</button>
    <button @click="() => createWebPanel()">Create Web Panel</button>
  </main>
</template>

<script setup lang="ts">
import {
  PanelState,
  createPanel,
  type Panel,
  type PanelResizeEvent,
} from '~~/components/DesktopPanel.vue'

const panels = $ref(new Map<string, Panel>())
const panelOrder: string[] = $ref([])

function createMarkdownPanel(path?: string) {
  path = path ?? window.prompt('Enter path to Markdown content') ?? undefined
  if (!path) return
  const panel = createPanel({
    title: 'Markdown',
    component: 'ContentDoc',
    props: { path },
  })
  panels.set(panel.id, panel)
  panelOrder.push(panel.id)
}

function createWebPanel(href?: string) {
  href = href ?? window.prompt('Enter a URL') ?? undefined
  if (!href) return
  const panel = createPanel({ title: 'Web', href })
  panels.set(panel.id, panel)
  panelOrder.push(panel.id)
}

createMarkdownPanel('nested/markdown-cheatsheet')
createWebPanel('https://nuxtjs.org/')

function focusPanel(id: string) {
  const index = panelOrder.indexOf(id)
  if (index === -1) return
  panelOrder.splice(index, 1)
  panelOrder.push(id)
}

let draggedPanel = $ref<Panel>()

function startDragPanel(id: string) {
  const panel = panels.get(id)
  draggedPanel = panel

  if (panel?.state === PanelState.Maximized) {
    panel.state = null
    panel.x = mouse.x - panel.width / 2
    panel.y = mouse.y
  }
}

function releaseMouse() {
  draggedPanel = undefined
}

const mouse = $ref({ x: 0, y: 0 })
function updateMouse(event: MouseEvent) {
  mouse.x = event.clientX
  mouse.y = event.clientY

  // TODO breaks if you move cursor outside the page
  if (draggedPanel) {
    const panel = draggedPanel
    panel.x += event.movementX
    panel.y = Math.max(0, panel.y + event.movementY)
  }
}

function closePanel(id: string) {
  panels.delete(id)
  const index = panelOrder.indexOf(id)
  if (index === -1) return
  panelOrder.splice(index, 1)
}

function minimizePanel(id: string) {
  const panel = panels.get(id)
  if (!panel) return
  panel.state =
    panel.state === PanelState.Minimized ? null : PanelState.Minimized
}

function maximizePanel(id: string) {
  const panel = panels.get(id)
  if (!panel) return
  panel.state =
    panel.state === PanelState.Maximized ? null : PanelState.Maximized
}

function resizePanel({ id, width, height }: PanelResizeEvent) {
  const panel = panels.get(id)
  if (!panel) return
  panel.width = Math.ceil(width)
  panel.height = Math.ceil(height)
}
</script>

<style lang="scss" scoped>
.desktop {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: stretch;
}

.panels {
  flex-grow: 1;
  position: relative;
  background-color: #367274;
  overflow: hidden;
}
</style>
