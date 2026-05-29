<script setup lang="ts">
import type { Event } from "@/types/api";

const props = defineProps<{
  event: Event;
  isPast: boolean;
}>();

function formatDate(str: string | null): string {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function scoreLabel(event: Event): string | null {
  if (event.intHomeScore == null || event.intAwayScore == null) return null;
  return `${event.intHomeScore} - ${event.intAwayScore}`;
}

const score = scoreLabel(props.event);
const date = formatDate(props.event.dateEvent);
</script>

<template>
  <div
    class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-2 hover:border-zinc-600 transition-colors"
  >
    <div class="flex items-center justify-between gap-2">
      <span class="text-xs text-zinc-500 uppercase tracking-wider">{{ event.strLeague }}</span>
      <span class="text-xs text-zinc-500">{{ date }}</span>
    </div>

    <div class="flex items-center justify-between gap-3 mt-1">
      <span class="font-semibold text-white text-sm text-right flex-1">
        {{ event.strHomeTeam }}
      </span>

      <span
        v-if="isPast && score"
        class="bg-zinc-800 border border-zinc-700 rounded-md px-2 py-0.5 text-sm font-bold text-brand-accent shrink-0"
      >
        {{ score }}
      </span>
      <span v-else class="text-zinc-500 text-xs shrink-0">vs</span>

      <span class="font-semibold text-white text-sm flex-1">
        {{ event.strAwayTeam }}
      </span>
    </div>

    <p v-if="event.strTime" class="text-xs text-zinc-500 text-center">{{ event.strTime }}</p>
  </div>
</template>
