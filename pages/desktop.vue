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
    <Taskbar
      :panels="panels"
      :focusedId="panelOrder[panelOrder.length - 1]"
      @focus="focusPanel"
      @newPanel="registerPanel"
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
const panelOrder: string[] = $ref([])

function registerPanel(panel: Panel) {
  panels.set(panel.id, panel)
  panelOrder.push(panel.id)
}

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
