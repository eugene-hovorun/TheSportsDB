import { createApp } from "vue";
import EventsSection from "./components/EventsSection.vue";

const el = document.getElementById("events-app");

if (el) {
  createApp(EventsSection, { teamId: el.dataset.teamId }).mount(el);
}
