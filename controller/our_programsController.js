
const OurProgram = require('../models/Our_Programs');

exports.createProgram = async (req, res) => {
    try {
        const newProgram = new OurProgram(req.body);
        await newProgram.save();
        res.status(201).json(newProgram);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getPrograms = async (req, res) => {
    try {
        const programs = await OurProgram.find();
        res.status(200).json(programs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProgramById = async (req, res) => {
    try {
        const program = await OurProgram.findById(req.params.id);
        if (!program) {
            return res.status(404).json({ error: "Program not found" });
        }
        res.status(200).json(program);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.updateProgram = async (req, res) => {
    try {
        const program = await OurProgram.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!program) {
            return res.status(404).json({ error: "Program not found" });
        }
        res.status(200).json(program);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteProgram = async (req, res) => {
    try {
        const program = await OurProgram.findByIdAndDelete(req.params.id);
        if (!program) {
            return res.status(404).json({ error: "Program not found" });
        }
        res.status(200).json({ message: "Program deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
