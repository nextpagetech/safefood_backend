
// routes/our_programsRoutes.js
const express = require('express');
const router = express.Router();
const {
    createProgram,
    getPrograms,
    getProgramById,
    updateProgram,
    deleteProgram
} = require('../controller/our_programsController');

router.post('/createprogram', createProgram);
router.get('/getall', getPrograms);
router.get('/:id', getProgramById); 

router.put('/:id', updateProgram);
router.delete('/:id', deleteProgram);

module.exports = router;
