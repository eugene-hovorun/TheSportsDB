<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Event } from "@/types/api";
import EventCard from "./EventCard.vue";

const props = defineProps<{
  teamId: string;
}>();

const nextEvents = ref<Event[]>([]);
const lastEvents = ref<Event[]>([]);
const loading = ref(true);
const loadError = ref<string | null>(null);

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

onMounted(async () => {
  try {
    const [next, last] = await Promise.all([
      fetchJson<Event[]>(`/api/team/${props.teamId}/events/next`),
      fetchJson<Event[]>(`/api/team/${props.teamId}/events/last`),
    ]);
    nextEvents.value = next;
    lastEvents.value = last;
  } catch (err) {
    loadError.value = "Could not load fixture data.";
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold text-white mb-6 border-b border-zinc-800 pb-2">
      Fixtures &amp; Results
    </h2>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center gap-3 text-zinc-500 py-8">
      <svg
        class="animate-spin h-5 w-5 text-brand-accent"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      Loading fixtures…
    </div>

    <!-- Error -->
    <div v-else-if="loadError" class="text-zinc-500 italic text-sm py-4">{{ loadError }}</div>

    <!-- Content -->
    <div v-else class="grid md:grid-cols-2 gap-8">
      <div>
        <h3 class="text-sm font-semibold text-brand-accent uppercase tracking-widest mb-3">
          Upcoming
        </h3>
        <div v-if="nextEvents.length" class="space-y-3">
          <EventCard
            v-for="ev in nextEvents"
            :key="ev.idEvent"
            :event="ev"
            :is-past="false"
          />
        </div>
        <p v-else class="text-zinc-500 text-sm italic">No upcoming fixtures found.</p>
      </div>

      <div>
        <h3 class="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-3">
          Recent Results
        </h3>
        <div v-if="lastEvents.length" class="space-y-3">
          <EventCard
            v-for="ev in lastEvents"
            :key="ev.idEvent"
            :event="ev"
            :is-past="true"
          />
        </div>
        <p v-else class="text-zinc-500 text-sm italic">No recent results found.</p>
      </div>
    </div>
  </div>
</template>
