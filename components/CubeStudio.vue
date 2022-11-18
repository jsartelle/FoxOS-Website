<template>
  <div class="cube-d9764dcb-8a78-56ac-848b-9cc937426e53">
    <div class="controls">
      <button @click="copyCubeHTML">Copy cube HTML</button>

      <div class="control-row">
        <label>
          <input v-model="spin" type="checkbox" />
          Spin
        </label>
        <label>
          <input v-model="spinSeconds" type="number" min="0" max="60" />
          s
        </label>
        <label>
          <input v-model="debug" type="checkbox" />
          Show debug info
        </label>
      </div>

      <div>
        <label>
          <span>width</span>
          <input v-model="size.width" type="range" min="0" max="500" />
          <input v-model="size.width" type="number" />
        </label>
        <label>
          <span>height</span>
          <input v-model="size.height" type="range" min="0" max="500" />
          <input v-model="size.height" type="number" />
        </label>

        <label>
          <span>rotateX</span>
          <input v-model="rotation.x" type="range" min="-360" max="360" />
          <input v-model="rotation.x" type="number" />
        </label>
        <label>
          <span>rotateY</span>
          <input v-model="rotation.y" type="range" min="-360" max="360" />
          <input v-model="rotation.y" type="number" />
        </label>
        <label>
          <span>rotateZ</span>
          <input v-model="rotation.z" type="range" min="-360" max="360" />
          <input v-model="rotation.z" type="number" />
        </label>
      </div>

      <div>
        <label>
          <div class="color-swatch" :style="{ backgroundColor: colors.front }">
            <input v-model="colors.front" type="color" />
          </div>
          <span>Front</span>
          <input v-model="colors.front" />
        </label>
        <label>
          <div class="color-swatch" :style="{ backgroundColor: colors.back }">
            <input v-model="colors.back" type="color" />
          </div>
          <span>Back</span>
          <input v-model="colors.back" />
        </label>
        <label>
          <div class="color-swatch" :style="{ backgroundColor: colors.right }">
            <input v-model="colors.right" type="color" />
          </div>
          <span>Right</span>
          <input v-model="colors.right" />
        </label>
        <label>
          <div class="color-swatch" :style="{ backgroundColor: colors.left }">
            <input v-model="colors.left" type="color" />
          </div>
          <span>Left</span>
          <input v-model="colors.left" />
        </label>
        <label>
          <div class="color-swatch" :style="{ backgroundColor: colors.top }">
            <input v-model="colors.top" type="color" />
          </div>
          <span>Top</span>
          <input v-model="colors.top" />
        </label>
        <label>
          <div class="color-swatch" :style="{ backgroundColor: colors.bottom }">
            <input v-model="colors.bottom" type="color" />
          </div>
          <span>Bottom</span>
          <input v-model="colors.bottom" />
        </label>
        <label>
          <input v-model="border" type="checkbox" />
          Border
        </label>
      </div>
    </div>

    <div class="preview">
      <div
        ref="cube"
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          transform: rotate(360deg) translate3d(0em, 0em, 0em) rotateX(0deg)
            rotateY(360deg) rotateZ(0deg);
          transform-style: preserve-3d;
        "
        :style="[
          {
            width: `calc(max(${size.width}px, ${size.height}px) * 1.75)`,
            height: `calc(max(${size.width}px, ${size.height}px) * 1.75)`,
          },
          spin &&
            `animation: ${spinSeconds}s linear 0s infinite normal both running spin`,
          debug && 'background-color: rgba(0,0,0,0.5)',
        ]"
      >
        <div
          style="transform-style: preserve-3d"
          :style="{
            width: `${size.width}px`,
            height: `${size.height}px`,
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
          }"
        >
          <div
            :style="[
              faceBaseStyles,
              {
                transform: `translateZ(calc(${size.width}px / 2))`,
                backgroundColor: colors.front,
              },
            ]"
            style=""
          >
            {{ debug ? 'Front' : null }}
          </div>
          <div
            :style="[
              faceBaseStyles,
              {
                transform: `rotateY(180deg) translateZ(calc(${size.width}px / 2))`,
                backgroundColor: colors.back,
              },
            ]"
          >
            {{ debug ? 'Back' : null }}
          </div>
          <div
            :style="[
              faceBaseStyles,
              {
                transform: `rotateY(90deg) translateZ(calc(${size.width}px / 2))`,
                backgroundColor: colors.right,
              },
            ]"
          >
            {{ debug ? 'Right' : null }}
          </div>
          <div
            :style="[
              faceBaseStyles,
              {
                transform: `rotateY(-90deg) translateZ(calc(${size.width}px / 2))`,
                backgroundColor: colors.left,
              },
            ]"
          >
            {{ debug ? 'Left' : null }}
          </div>
          <div
            :style="[
              faceBaseStyles,
              {
                height: `${size.width}px`,
                transform: `rotateX(90deg) translateZ(calc(${size.width}px / 2))`,
                backgroundColor: colors.top,
              },
            ]"
          >
            {{ debug ? 'Top' : null }}
          </div>
          <div
            :style="[
              faceBaseStyles,
              {
                height: `${size.width}px`,
                /* THIS TOOK SO LONG TO FIGURE OUT */
                transform: `rotateX(-90deg) translateZ(calc(${size.height}px - (${size.width}px / 2)))`,
                backgroundColor: colors.bottom,
              },
            ]"
          >
            {{ debug ? 'Bottom' : null }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const cube = $ref<HTMLDivElement>()

const spin = $ref(false)
const spinSeconds = $ref(10)
const debug = $ref(false)
const size = $ref({ height: 200, width: 200 })
const rotation = $ref({ x: 45, y: 45, z: -20 })
const colors = $ref({
  front: 'rgba(90, 90, 90, 1)',
  back: 'rgba(0, 210, 0, 1)',
  right: 'rgba(210, 0, 0, 1)',
  left: 'rgba(0, 0, 210, 1)',
  top: 'rgba(210, 210, 0, 1)',
  bottom: 'rgba(210, 0, 210, 1)',
})
const border = $ref(true)

const faceBaseStyles: any = $computed(() => {
  return {
    position: 'absolute',
    width: `${size.width}px`,
    height: `${size.height}px`,
    backfaceVisibility: 'inherit',
    border: border ? '1px solid black' : undefined,
    transformOrigin: 'center',
  }
})

async function copyCubeHTML() {
  await navigator.clipboard.writeText(cube!.outerHTML)
}
</script>

<style lang="scss">
/* why not use <style scoped>? so we can copy the cube HTML without the data-v-whatever attributes */
.cube-d9764dcb-8a78-56ac-848b-9cc937426e53 {
  display: flex;
  flex-flow: row nowrap;
  // align-items: center;
  padding: 10px;
  gap: 50px;

  .controls {
    display: flex;
    flex-flow: column nowrap;
    gap: 10px;

    div {
      background-color: lavender;
    }

    .control-row {
      display: flex;
      flex-flow: row nowrap;
      gap: 20px;
    }

    label {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      gap: 10px;

      span {
        min-width: 75px;
      }
    }

    .color-swatch {
      position: relative;
      width: 20px;
      height: 20px;

      input[type='color'] {
        position: absolute;
        height: 100%;
        width: 100%;
        visibility: hidden;
      }
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
