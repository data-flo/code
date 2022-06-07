import Vue from "vue";
import debounce from "lodash.debounce";

const getStore = (vNode) => {
  const { context = {} } = vNode;
  const { $store = {} } = context;
  return $store;
};

// tutorial-anchor logic
const setAnchorBCR = (key, el, $store, { alignment, arrow = false, margin = {} }) => {
  const { x = 0, y = 0 } = margin;
  const bcr = el.getBoundingClientRect();
  const value = {
    bottom: bcr.bottom,
    height: bcr.height,
    left: bcr.left,
    right: bcr.right,
    top: bcr.top,
    width: bcr.width,
    x: bcr.x + x,
    y: bcr.y + y,
    alignment,
    arrow,
    userSet: false,
  };
  $store.commit("tutorial/setAnchorBCR", { key, value });
};

const updateBCR = {};
const anchorRootUpdate = (el, binding, vNode) => {
  const { value = {}, modifiers = {} } = binding;

  // I would normally do this check in the store but as we are
  // doing BCR I don't want to accidentally spam it with requests
  if (value.key === value.id) {
    const $store = getStore(vNode);
    const alignment = ["left", "top", "right", "bottom"]
      .filter((a) => Object.keys(modifiers).includes(a))
      .shift();
    const fn = updateBCR[value.key];
    fn.apply(this, [value.key, el, $store, {
      alignment,
      arrow: modifiers.arrow,
      margin: value.margin,
    }]);
  }
};

Vue.directive("tutorial-anchor", {
  bind(el, { value = {} }) {
    updateBCR[value.key] = debounce(setAnchorBCR, 300);
  },
  inserted: anchorRootUpdate,
  componentUpdated: anchorRootUpdate,
});


// tutorial-anchor-value logic
const setAnchorValue = (payload, $store) => {
  $store.commit("tutorial/setAnchorValue", payload);
};

const updateValue = {};
const valueRootUpdate = (_, binding, vNode) => {
  const { value = {} } = binding;
  const { id = [], key = "" } = value;

  if (id.includes(key)) {
    const $store = getStore(vNode);
    const fn = updateValue[key];
    fn.apply(this, [value, $store]);
  }
};
Vue.directive("tutorial-anchor-value", {
  bind(_, { value = {} }) {
    updateValue[value.key] = debounce(setAnchorValue, 300);
  },
  inserted: valueRootUpdate,
  componentUpdated: valueRootUpdate,
  unbind(el, binding, vNode) {
    binding.value.value = undefined;
    valueRootUpdate(el, binding, vNode);
  },
});
