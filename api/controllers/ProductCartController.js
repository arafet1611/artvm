import ProductCart from "../models/ProduitCart.js";
import Cart from "../models/CartModel.js";
export const getProductCart = async (req, res) => {
  try {
    const user = req.user;
    const productCart = await ProductCart.find({ user: user._id }).populate(
      "product"
    );
    res.status(200).json(productCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProductCart = async (req, res) => {
  try {
    const { productId, hauteur, largeur, quantite } = req.body;
    const user = req.user;

       const productCart = new ProductCart({
      product: productId,
      hauteur,
      largeur,
      quantite,
      user: user._id,
    });
    await productCart.save();

    const existingCart = await Cart.findOne({ user: user._id });

    if (existingCart) {
      existingCart.productCart.push(productCart._id);
      await existingCart.save();
    } else {
      await Cart.create({
        productCart: [productCart._id],
        user: user._id,
      });
    }

    res.status(201).json({ message: "Produit ajouté au panier avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit au panier :", error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de l'ajout du produit au panier",
    });
  }
};

export const updateProductCartQuantity = async (req, res) => {
  try {
    const { quantite } = req.body;
    const { productCartId } = req.params;
    const productCart = await ProductCart.findById(productCartId);
    if (!productCart) {
      return res
        .status(404)
        .json({ message: "Produit dans le panier introuvable" });
    }
    productCart.quantite = quantite;
    await productCart.save();
    res
      .status(200)
      .json({ message: "Quantité du produit mise à jour avec succès" });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de la quantité du produit :",
      error
    );
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la mise à jour de la quantité du produit",
    });
  }
};
