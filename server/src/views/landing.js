import express, { Router } from 'express'
import path from 'path'
import config from '../config'

const router = Router()
router.use(express.static(config.entryFolder))
router.get('/', (req, res) => {
  try {
    res.status(200).sendFile(path.resolve(config.entryFolder, config.entry))
  } catch (e) {
    res.status(404).send('Couldnt reach landing page')
  }
})

export default router
