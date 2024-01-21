<script setup>
let currentEffect = null;

class ComputedReactive {
  subscribers = new Set();
  _value;

  constructor(getter) {
    this.getter = getter;
    this._value = this.compute();
  }

  get value() {
    this.subscribers();
    return this._value;
  }

  subscribers() {
    if (currentEffect) this.subscribers.add(currentEffect);
  }

  compute() {
    currentEffect = () => {
      this._value = this.getter();
    };
    const value = this.getter();
    currentEffect = null;

    return value;
  }

  set value(_) {
    console.warn("ComputedReactive: Cannot set computed property");
  }

  notify() {
    this.subscribers.forEach((subscriber) => subscriber());
  }
}

function ref(value) {
  return new ComputedReactive(() => value);
}

function computed(getter) {
  return new ComputedReactive(getter);
}

const channel = ref("hello world");
const computedChannel = computed(() => {
  console.log("Computed Channel:", channel.value);
  return channel.value.toUpperCase();
});

watchEffect(() => {
  console.log("Watch Effect:", computedChannel.value);
});

channel.value = "hello world 2";
</script>


<template>
  <div>
    <h1>heloo</h1>
  </div>
</template>
