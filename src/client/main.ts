import { createApp } from "vue";
import EventsSection from "./components/EventsSection.vue";

const el = document.getElementById("events-app");
if (el) {
  createApp({ components: { EventsSection } }).mount(el);
}
