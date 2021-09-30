<template>
  <div class="hidden-sm-and-up">
    <h2>
      Your screen is too small.
    </h2>
    <h3>
      Please use a desktop device to access the Dataflow editor.
    </h3>
    <p>
      <v-btn v-on:click="$router.back()">
        Go back!
      </v-btn>
    </p>
  </div>
</template>

<style scoped>
div {
  align-items: center;
  background: black;
  bottom: 0;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  left: 0;
  opacity: 1;
  padding: 5%;
  position: fixed;
  right: 0;
  text-align: center;
  top: 0;
  transition: 0.3s;
  will-change: opacity;
  z-index: 4;
}
div a {
  color: white;
  text-decoration: underline;
}
</style>
