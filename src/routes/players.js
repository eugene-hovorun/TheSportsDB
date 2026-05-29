import { Router } from 'express'
import { getPlayerById, getNextEvents, getLastEvents } from '../api.js'

const router = Router()

// Player detail page – SSR shell
router.get('/player/:id', async (req, res, next) => {
  try {
    const player = await getPlayerById(req.params.id)
    if (!player) return res.status(404).render('error', { message: 'Player not found.' })
    res.render('player', { player, title: `${player.strPlayer} – EPL Hub` })
  } catch (err) {
    next(err)
  }
})

// ── JSON endpoints consumed by Vue components ─────────────────────────────────

router.get('/api/team/:id/events/next', async (req, res, next) => {
  try {
    const events = await getNextEvents(req.params.id)
    res.json(events)
  } catch (err) {
    next(err)
  }
})

router.get('/api/team/:id/events/last', async (req, res, next) => {
  try {
    const events = await getLastEvents(req.params.id)
    res.json(events)
  } catch (err) {
    next(err)
  }
})

export default router
