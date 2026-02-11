
const express = require('express');
const router = express.Router();
const tablesController = require('../controllers/tablesController');

router.get('/tables', tablesController.getTables);
router.put('/tables/:id/move', tablesController.updateTablePosition);
router.put('/tables/:id/status', tablesController.toggleTableStatus);

router.get('/reservations', tablesController.getReservations);
router.post('/reservations', tablesController.createReservation);
router.put('/reservations/:id/status', tablesController.updateReservationStatus);

module.exports = router;
