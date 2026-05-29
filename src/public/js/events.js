/**
 * Vue 3 – Dynamic Events Section
 * Registered as a global component and mounted on the team page.
 * Fetches upcoming + recent events from our own JSON proxy endpoints
 * so the free TheSportsDB key is kept server-side.
 */
(function () {
  const { createApp, defineComponent, ref, onMounted } = Vue;

  // ── helpers ────────────────────────────────────────────────────────────────

  function formatDate(str) {
    if (!str) return "—";
    const d = new Date(str);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function scoreLabel(event) {
    const h = event.intHomeScore;
    const a = event.intAwayScore;
    if (h == null || a == null) return null;
    return `${h} – ${a}`;
  }

  // ── EventCard sub-component ────────────────────────────────────────────────

  const EventCard = defineComponent({
    name: "EventCard",
    props: {
      event: { type: Object, required: true },
      isPast: { type: Boolean, default: false },
    },
    setup(props) {
      const score = () => scoreLabel(props.event);
      const date = () => formatDate(props.event.dateEvent);
      return { score, date };
    },
    template: `
      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-2 hover:border-zinc-600 transition-colors">
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs text-zinc-500 uppercase tracking-wider">{{ event.strLeague }}</span>
          <span class="text-xs text-zinc-500">{{ date() }}</span>
        </div>
        <div class="flex items-center justify-between gap-3 mt-1">
          <span class="font-semibold text-white text-sm text-right flex-1">{{ event.strHomeTeam }}</span>
          <span v-if="isPast && score()" class="bg-zinc-800 border border-zinc-700 rounded-md px-2 py-0.5 text-sm font-bold text-brand-accent shrink-0">
            {{ score() }}
          </span>
          <span v-else class="text-zinc-500 text-xs shrink-0">vs</span>
          <span class="font-semibold text-white text-sm flex-1">{{ event.strAwayTeam }}</span>
        </div>
        <p v-if="event.strTime" class="text-xs text-zinc-500 text-center">{{ event.strTime }}</p>
      </div>
    `,
  });

  // ── EventsSection root component ──────────────────────────────────────────

  const EventsSection = defineComponent({
    name: "EventsSection",
    components: { EventCard },
    props: {
      teamId: { type: String, required: true },
    },
    setup(props) {
      const nextEvents = ref([]);
      const lastEvents = ref([]);
      const loading = ref(true);
      const error = ref(null);

      async function fetchJson(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      }

      onMounted(async () => {
        try {
          const [next, last] = await Promise.all([
            fetchJson(`/api/team/${props.teamId}/events/next`),
            fetchJson(`/api/team/${props.teamId}/events/last`),
          ]);
          nextEvents.value = next;
          lastEvents.value = last;
        } catch (err) {
          error.value = "Could not load fixture data.";
          console.error(err);
        } finally {
          loading.value = false;
        }
      });

      return { nextEvents, lastEvents, loading, error };
    },
    template: `
      <div>
        <h2 class="text-xl font-semibold text-white mb-6 border-b border-zinc-800 pb-2">Fixtures &amp; Results</h2>

        <div v-if="loading" class="flex items-center gap-3 text-zinc-500 py-8">
          <svg class="animate-spin h-5 w-5 text-brand-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          Loading fixtures…
        </div>

        <div v-else-if="error" class="text-zinc-500 italic text-sm py-4">{{ error }}</div>

        <div v-else class="grid md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-sm font-semibold text-brand-accent uppercase tracking-widest mb-3">Upcoming</h3>
            <div v-if="nextEvents.length" class="space-y-3">
              <event-card v-for="ev in nextEvents" :key="ev.idEvent" :event="ev" :is-past="false" />
            </div>
            <p v-else class="text-zinc-500 text-sm italic">No upcoming fixtures found.</p>
          </div>

          <div>
            <h3 class="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-3">Recent Results</h3>
            <div v-if="lastEvents.length" class="space-y-3">
              <event-card v-for="ev in lastEvents" :key="ev.idEvent" :event="ev" :is-past="true" />
            </div>
            <p v-else class="text-zinc-500 text-sm italic">No recent results found.</p>
          </div>
        </div>
      </div>
    `,
  });

  // ── Mount ──────────────────────────────────────────────────────────────────

  const el = document.getElementById("events-app");
  if (el) {
    createApp({ components: { EventsSection } }).mount(el);
  }
})();
