<template>
  <div class="tutorial-container">
    <v-card
      ref="tutorial"
      v-bind:style="tutorialUi.tutorial"
      draggable="true"
      class="tutorial"
      v-on:dragend="drop"
    >
      <div
        v-bind:style="{...tutorialUi.arrow }"
        class="arrow-container"
      >
        <span class="arrow" />
      </div>
      <div class="foreground">
        <v-card-title class="title">
          {{ step.title }}
        </v-card-title>
        <v-card-text class="text">
          <div
            class="markdown"
            v-html="$md.render(step.body || '')"
          />
        </v-card-text>
        <v-card-actions class="actions pa-1">
          <v-btn
            v-bind:disabled="disablePrev"
            icon
            v-on:click="setFirstIndex"
          >
            <v-icon>
              mdi-skip-backward
            </v-icon>
          </v-btn>
          <v-spacer />
          <v-btn
            v-bind:disabled="disablePrev"
            icon
            v-on:click="setPrevIndex"
          >
            <v-icon>
              mdi-skip-previous
            </v-icon>
          </v-btn>
          <v-spacer />
          <span class="pa-2">{{ progress }}</span>
          <v-spacer />
          <v-btn
            v-bind:disabled="disableNext"
            icon
            v-on:click="setNextIndex"
          >
            <v-icon>
              mdi-skip-next
            </v-icon>
          </v-btn>
          <v-spacer />
          <v-btn
            v-bind:disabled="disableLast"
            icon
            v-on:click="setLastIndex"
          >
            <v-icon>
              mdi-skip-forward
            </v-icon>
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import debounce from "lodash.debounce";

export default {
  props: {
    mode: String,
  },
  computed: {
    ...mapState("tutorial", [
      "step",
      "index",
      "lastIndex",
      "maxIndex",
    ]),
    ...mapGetters("tutorial", [
      "isValid",
      "postValidators",
      "tutorialUi",
    ]),
    progress() {
      return `${this.index + 1} / ${this.maxIndex}`;
    },
    disablePrev() {
      return (this.index < 1);
    },
    disableNext() {
      const nextPositionCheck = (this.index + 1 >= this.maxIndex);
      return (!this.isValid || nextPositionCheck);
    },
    disableLast() {
      const nextPositionCheck = (this.index + 1 >= this.maxIndex);
      const lastPositionCheck = (this.index >= this.lastIndex);
      return (!this.isValid || nextPositionCheck || lastPositionCheck);
    },
  },
  watch: {
    isValid: {
      handler: "postValidatorsHandler",
      immediate: true,
    },
  },
  created() {
    this.$store.commit("tutorial/init", this.mode);
    const tutorial = this.$cookies.get("tutorial");
    if (typeof tutorial !== "undefined") {
      const { index = 0 } = tutorial;
      this.$store.dispatch("tutorial/setIndex", index);
    } else {
      this.$store.dispatch("tutorial/setFirstIndex");
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setBCR();
      this.$nextTick(() => {
        this.$store.commit("tutorial/setIsVisible", true);
      });
    });
    if (process.client) {
      const debouncedSetBoundary = debounce(this.setBoundary, 300);
      window.addEventListener("resize", debouncedSetBoundary);
    }
  },
  methods: {
    ...mapActions("tutorial", [
      "setFirstIndex",
      "setPrevIndex",
      "setNextIndex",
      "setLastIndex",
    ]),
    postValidatorsHandler(value) {
      const positionCheck = (this.index === this.lastIndex);
      if (value === true && positionCheck && typeof this.postValidators !== "undefined") {
        for (const { location = "mutation", type = "", payload = "" } of this.postValidators) {
          switch (location) {
            case "mutation":
              this.$store.commit(type, payload);
              break;
            case "action":
              this.$store.dispatch(type, payload);
              break;
            case "component":
              this[type](payload);
              break;
          }
        }
      }
    },
    setBCR() {
      this.setBoundary();
      // assign or clean tutorial BoundingClientRect
      const { tutorial } = this.$refs;
      if (typeof tutorial !== "undefined") {
        const bcr = tutorial.$el.getBoundingClientRect();
        this.$store.commit("tutorial/setTutorialBCR", {
          bottom: bcr.bottom,
          height: bcr.height,
          left: bcr.left,
          right: bcr.right,
          top: bcr.top,
          width: bcr.width,
          x: bcr.x,
          y: bcr.y,
        });
      } else {
        console.warn("unable to find the tutorial element");
      }
    },
    setBoundary() {
      if (process.client) {
        // set the windows boundary
        this.$store.commit("tutorial/setBoundary", {
          width: window.innerWidth,
          height: window.innerHeight,
          scrollX: window.scrollX,
          scrollY: window.scrollY,
        });
      }
    },
    drop(event) {
      this.$store.commit("tutorial/setDragBCR", {
        x: event.clientX,
        y: event.clientY,
      });
    },
  },
};
</script>

<style>
.tutorial-container > .tutorial .markdown a {
  font-weight: 600;
}
.tutorial-container > .tutorial .markdown ul {
  margin: 16px 0px;
}
.tutorial-container > .tutorial .markdown code {
  user-select: all;
  cursor: text !important;
}
</style>

<style scoped>
.tutorial-container {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tutorial-container > .tutorial {
  position: relative;
  z-index: 2;
  min-height: 50px;
  width: 400px;
  top: 0;
  left: 0;
  will-change: transform opacity;
  transform-origin: center;
  transition: 300ms cubic-bezier(.25,.8,.5,1);
  background-color: #fcfcfc;
  z-index: 101;
  cursor: grab;
}

.tutorial-container > .tutorial:focus,
.tutorial-container > .tutorial:active {
  cursor: grabbing;
}

.tutorial-container > .tutorial > .arrow-container {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  position: absolute;
  z-index: 0;
}

.tutorial-container > .tutorial > .arrow-container > .arrow {
  --radius: 5px;
  height: 0px;
  width: 0px;
  font-size: 0px;
  margin: calc(0px - var(--radius));
  padding: var(--radius);
  background-color: #fcfcfc;
  transform: rotate(45deg);
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
}

.tutorial-container > .tutorial > .foreground {
  position: relative;
  z-index: 1;
  background-color: inherit;
}

.tutorial-container > .tutorial > .foreground .title {
  font-weight: 500 !important;
  font-family: 'Saira Semi Condensed', sans-serif !important;
}

.tutorial-container > .tutorial > .foreground .text,
.tutorial-container > .tutorial > .foreground .actions {
  font-family: Roboto;
}

.tutorial-container > .tutorial > .foreground .text {
    padding-bottom: 24px;
    padding-top: 8px;
}

</style>
