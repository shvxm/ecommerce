const {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} = require("./user.service");


// ==============================
// GET PROFILE
// ==============================

const getProfileController = async (req, res, next) => {
  try {

    const user = await getProfile(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: user
    });

  } catch (error) {
    next(error);
  }
};


// ==============================
// UPDATE PROFILE
// ==============================

const updateProfileController = async (req, res, next) => {
  try {

    const user = await updateProfile(
      req.user.userId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user
    });

  } catch (error) {
    next(error);
  }
};


// ==============================
// GET ADDRESSES
// ==============================

const getAddressesController = async (req, res, next) => {
  try {

    const addresses = await getAddresses(
      req.user.userId
    );

    res.status(200).json({
      success: true,
      message: "Addresses fetched successfully",
      data: addresses
    });

  } catch (error) {
    next(error);
  }
};


// ==============================
// ADD ADDRESS
// ==============================

const addAddressController = async (req, res, next) => {
  try {

    const addresses = await addAddress(
      req.user.userId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: addresses
    });

  } catch (error) {
    next(error);
  }
};


// ==============================
// UPDATE ADDRESS
// ==============================

const updateAddressController = async (req, res, next) => {
  try {

    const addresses = await updateAddress(
      req.user.userId,
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: addresses
    });

  } catch (error) {
    next(error);
  }
};


// ==============================
// DELETE ADDRESS
// ==============================

const deleteAddressController = async (req, res, next) => {
  try {

    const addresses = await deleteAddress(
      req.user.userId,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: addresses
    });

  } catch (error) {
    next(error);
  }
};


// ==============================
// SET DEFAULT ADDRESS
// ==============================

const setDefaultAddressController = async (req, res, next) => {
  try {

    const addresses = await setDefaultAddress(
      req.user.userId,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      data: addresses
    });

  } catch (error) {
    next(error);
  }
};


// ==============================
// EXPORT
// ==============================

module.exports = {
  getProfileController,
  updateProfileController,
  getAddressesController,
  addAddressController,
  updateAddressController,
  deleteAddressController,
  setDefaultAddressController
};