import Commande from "../models/CommandeModel.js";

const createCommande = async (req, res) => {
  const { ProductInCart, QuentiteTotals, status } = req.body;
  const user = req.user;
  console.log("user", user);
  console.log(ProductInCart);

  try {
    if (!ProductInCart || !QuentiteTotals || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newCommande = new Commande({
      productCart: ProductInCart,
      client: user.userId,
      QuentiteTotals,
      status,
    });

    const savedCommande = await newCommande.save();

    res.status(201).json(savedCommande);
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(400)
      .json({ message: "Failed to create order", error: error.message });
  }
};
export const getCommandesByUser = async (req, res) => {
  try {
    const user = req.user;
    const commandes = await Commande.find({ client: user.userId }).populate({
      path: "productCart",
      populate: {
        path: "client",
      },
      populate: {
        path: "product",
      },
    });

    res.status(201).json(commandes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllCommands = async (req, res) => {
  try {
    const commandes = await Commande.find()
      .populate({
        path: "cart",
        populate: { path: "product" },
      })
      .populate("client");

    res.status(200).json(commandes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCommandeById = async (req, res) => {
  const { id } = req.params;
  try {
    const commande = await Commande.findById(id)
      .populate({
        path: "cart",
        populate: { path: "product" },
      })
      .populate("client");
    console.log(id);
    if (!commande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    res.status(200).json(commande);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCommande = async (req, res) => {
  const { id } = req.params;
  const { cart, client, quantiteTotale, status } = req.body;

  try {
    const updatedCommande = await Commande.findByIdAndUpdate(
      id,
      { cart, client, quantiteTotale, status },
      { new: true }
    );
    if (!updatedCommande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    res.status(200).json(updatedCommande);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Contrôleur pour supprimer une commande
const deleteCommande = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCommande = await Commande.findByIdAndRemove(id);
    if (!deletedCommande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    res.status(200).json({ message: "Commande supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateCommandStatus = async (req, res) => {
  const { id } = req.params;
  const { newStatus } = req.body;
  console.log(id);
  console.log(newStatus);
  try {
    // Update the command status
    const updatedCommand = await Commande.findByIdAndUpdate(
      id,
      { Status: newStatus },
      { new: true }
    ).lean();

    if (!updatedCommand) {
      return res
        .status(404)
        .json({ success: false, message: "Command not found" });
    }

    res.status(200).json({
      success: true,
      message: "Command status updated successfully",
      command: updatedCommand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update command status",
      error: error.message,
    });
  }
};
const setStatusConfirme = async (req, res) => {
  const { id } = req.params;
  try {
    // Update command status to "confirmé"
    const updatedCommand = await Commande.findByIdAndUpdate(
      id,
      { Status: "confirmé" },
      { new: true }
    ).lean();
    if (!updatedCommand) {
      return res
        .status(404)
        .json({ success: false, message: "Command not found" });
    }
    res.status(200).json({
      success: true,
      message: 'Command status updated to "confirmé"',
      command: updatedCommand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update command status to "confirmé"',
      error: error.message,
    });
  }
};

const setStatusRefuser = async (req, res) => {
  const { id } = req.params;
  try {
    // Update command status to "refusé"
    const updatedCommand = await Commande.findByIdAndUpdate(
      id,
      { Status: "refusé" },
      { new: true }
    ).lean();
    if (!updatedCommand) {
      return res
        .status(404)
        .json({ success: false, message: "Command not found" });
    }
    res.status(200).json({
      success: true,
      message: 'Command status updated to "refusé"',
      command: updatedCommand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update command status to "refusé"',
      error: error.message,
    });
  }
};
export {
  createCommande,
  getAllCommands,
  updateCommandStatus,
  setStatusRefuser,
  setStatusConfirme,
  getCommandeById,
  updateCommande,
  deleteCommande,
};
