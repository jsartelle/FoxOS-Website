<template>
  <main class="desktop" @mousemove="updateMouse" @mouseup="releaseMouse">
    <DesktopPanel
      v-for="[id, panel] in panels"
      :key="id"
      v-bind="panel"
      @focus="focusPanel"
      @grab="startDragPanel"
      @close="closePanel"
      @minimize="minimizePanel"
      @maximize="maximizePanel"
      @resize="resizePanel"
    />
  </main>
</template>

<script setup lang="ts">
import {
  PanelState,
  type Panel,
  type PanelResizeEvent,
} from '~~/components/DesktopPanel.vue'

const panels = $ref(new Map<string, Panel>())
function createPanel(options: Partial<Panel>): Panel {
  return {
    title: '',
    id: crypto.randomUUID(),
    x: 0,
    y: 0,
    width: 500,
    height: 500,
    state: null,
    ...options,
  }
}
for (let i = 0; i < 3; i++) {
  const panel = createPanel({ title: `Panel ${i + 1}`, y: i * 100 })
  panels.set(panel.id, panel)
}

function focusPanel(id: string) {
  const panel = panels.get(id)
  if (panel) {
    panels.delete(id)
    panels.set(id, panel)
  }
}

let draggedPanel = $ref<Panel | undefined>()

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
    panel.y += event.movementY
  }
}

function closePanel(id: string) {
  panels.delete(id)
}

function minimizePanel(id: string) {
  const panel = panels.get(id)
  if (panel) {
    panel.state =
      panel.state === PanelState.Minimized ? null : PanelState.Minimized
  }
}

function maximizePanel(id: string) {
  const panel = panels.get(id)
  if (panel) {
    panel.state =
      panel.state === PanelState.Maximized ? null : PanelState.Maximized
  }
}

function resizePanel({ id, width, height }: PanelResizeEvent) {
  const panel = panels.get(id)
  if (panel) {
    panel.width = Math.ceil(width)
    panel.height = Math.ceil(height)
  }
}
</script>

<style lang="scss" scoped>
.desktop {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: lightgreen;
}
</style>
