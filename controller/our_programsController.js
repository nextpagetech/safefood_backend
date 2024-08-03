
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

// exports.getPrograms = async (req, res) => {
//     try {
//         const programs = await OurProgram.find();
//         res.status(200).json(programs);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
exports.getPrograms = async (req, res) => {
    const { program_type } = req.query; // Retrieve program_type from req.query
    console.log("Requested program_type:", program_type); // Log the requested program_type
    try {
        let programs;
        if (program_type) {
            // Convert the program_type to lowercase for case-insensitive comparison
            const programTypeLowerCase = program_type.toLowerCase();

            // Define the filter object
            const filter = {
                program_type: { $regex: new RegExp(`^${programTypeLowerCase}$`, 'i') }
            };

            // Fetch programs based on the filter
            programs = await OurProgram.find(filter);
        } else {
            // If no program_type is specified, return all programs
            programs = await OurProgram.find();
        }
        console.log("Retrieved programs:", programs); // Log the retrieved programs
        res.status(200).json(programs);
    } catch (error) {
        console.error("Error fetching programs:", error); // Log any errors
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
         Program.program_video = req.body.program_video;
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
          program_video:updatedProgram.program_video,
          status: updatedProgram.status,
          modified_by: updatedProgram.modified_by,
          message: " Updated Successfully!",
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


// exports. deleteProgram = (req, res) => {
//     OurProgram.deleteOne({ _id: req.params.id }, (err) => {
//       if (err) {
//         res.status(500).send({
//           message: err.message,
//         });
//       } else {
//         res.status(200).send({
//           message: "Program deleted successfully!",
//         });
//       }
//     });
//   };

exports.deleteProgram = async (req, res) => {
    
  OurProgram.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: " Deleted Successfully!",
      });
    }
  });
};