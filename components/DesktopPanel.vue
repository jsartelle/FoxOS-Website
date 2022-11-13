<template>
  <div class="panel" :class="state" @mousedown="$emit('focus', id)">
    <div class="title-bar">
      <div class="controls">
        <button @click="$emit('close', id)">✖️</button>
        <button @click="$emit('minimize', id)">➖</button>
        <button @click="$emit('maximize', id)">➕</button>
      </div>
      <div class="title" @mousedown="$emit('grab', id)">{{ title }}</div>
    </div>
    <div class="contents" ref="contentsRef">
      <slot>
        Position: {{ x }}, {{ y }}<br />
        Size: {{ width }}x{{ height }}<br />
        State: {{ state }}
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
export enum PanelState {
  Minimized = 'minimized',
  Maximized = 'maximized',
}

export function createPanel(opts: Partial<Panel>): Panel {
  return Object.assign(
    {
      title: '',
      id: crypto.randomUUID(),
      x: 0,
      y: 0,
      width: 500,
      height: 500,
      state: null,
    },
    opts
  )
}
</script>

<script setup lang="ts">
export interface Panel {
  title: string
  id: string
  x: number
  y: number
  width: number
  height: number
  state: PanelState | null
  component?: string
  props?: any
  href?: string
}

export interface PanelProps {
  // TODO extending Panel doesn't work
  title: string
  id: string
  x: number
  y: number
  width: number
  height: number
  state: PanelState | null
  component?: string
  props?: any
  href?: string
  order: number
}

export interface PanelResizeEvent {
  id: string
  width: number
  height: number
}

const { title, id, x, y, width, height, state, order } = defineProps<PanelProps>()

const emit = defineEmits<{
  (e: 'focus', id: string): void
  (e: 'grab', id: string): void
  (e: 'close', id: string): void
  (e: 'minimize', id: string): void
  (e: 'maximize', id: string): void
  (e: 'resize', payload: PanelResizeEvent): void
}>()

const contentsRef = $ref<HTMLDivElement | null>(null)
const resizeObserver = new ResizeObserver((entries) => {
  if (state === null) {
    emit('resize', {
      id: id,
      width: entries[0].contentBoxSize[0].inlineSize,
      height: entries[0].contentBoxSize[0].blockSize,
    })
  }
})

const unwatch = watch($$(contentsRef), (contents) => {
  resizeObserver.observe(contents!)
  unwatch()
})
</script>

<style scoped lang="scss">
.panel {
  position: absolute;
  left: v-bind('x + "px"');
  top: v-bind('y + "px"');
  display: flex;
  background-color: white;
  flex-flow: column;
  border: 1px solid black;
  z-index: v-bind(order);

  &.maximized {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}

.title-bar {
  position: relative;
  background-color: darkgray;
  display: flex;
  flex-direction: row;

  .panel:not(.minimized) & {
    border-bottom: 1px solid black;
  }
}

.title {
  padding: 0 20px;
  text-align: center;
  flex-grow: 1;
  user-select: none;
}

.contents {
  width: v-bind('width + "px"');
  height: v-bind('height + "px"');
  overflow: scroll;
  resize: both;
  min-width: 100%;

  .panel.maximized & {
    // !important is to override resize inline style
    width: 100% !important;
    height: 100% !important;
    resize: none;
  }

  .panel.minimized & {
    height: 0 !important;
  }
}
</style>
