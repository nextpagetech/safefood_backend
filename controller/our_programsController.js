
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

// exports.getPrograms = async (req, res) => {
//     try {
//         const { type } = req.query;
//         console.log("dsfghgfd",req);
//         const filter = type ? { program_type: type } : {};
//         const programs = await OurProgram.find(filter);
//         res.status(200).json(programs);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

exports.getProgramById = async (req, res) => {
    
    try {
        const customer = await OurProgram.findById(req.params.id);
        res.send(customer);
      } catch (err) {
        res.status(500).send({
          message: err.message,
        });
      }
};



exports.updateProgram = async (req, res) => {
   
    try {
      const Program = await OurProgram.findById(req.params.id);
      if (Program) {
        Program.program_title = req.body.program_title;
        Program.program_type = req.body.program_type;
        Program.program_image = req.body.program_image;
        Program.program_description = req.body.program_description;
        Program.status = req.body.status;
        Program.modified_by = req.body.modified_by || null;
        const updatedProgram = await Program.save();
  
        res.send({
          _id: updatedProgram._id,
          program_title: updatedProgram.program_title,
          program_type: updatedProgram.program_type,
          program_image: updatedProgram.program_image,
          program_description: updatedProgram.program_description,
          status: updatedProgram.status,
          modified_by: updatedProgram.modified_by,
          message: "Program Updated Successfully!",
        });
      } else {
        res.status(404).send({
          message: "Program not found!",
        });
      }
    } catch (err) {
      res.status(500).send({
        message: "An error occurred while updating the vendor product.",
        error: err.message,
      });
    }
  };

// exports.deleteProgram = async (req, res) => {
//     try {
//         console.log("idsfgyugfrr",id);
//         const program = await OurProgram.deleteOne(req.params.id);
//         if (!program) {
//             return res.status(404).json({ error: "Program not found" });
//         }
//         res.status(200).json({ message: "Program deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

exports. deleteProgram = (req, res) => {
    OurProgram.deleteOne({ _id: req.params.id }, (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: "Program deleted successfully!",
        });
      }
    });
  };
