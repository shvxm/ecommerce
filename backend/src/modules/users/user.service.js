const User = require("./user.model");


// ==========================================
// GET USER PROFILE
// ==========================================

const getProfile = async (userId) => {

  const user = await User.findById(userId)
    .select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};


// ==========================================
// UPDATE USER PROFILE
// ==========================================

const updateProfile = async (userId, data) => {

  const {
    name,
    phone
  } = data;

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }


  if (name !== undefined) {
    user.name = name;
  }


  if (phone !== undefined) {
    user.phone = phone;
  }


  await user.save();


  const updatedUser = await User.findById(userId)
    .select("-password");

  return updatedUser;
};


// ==========================================
// GET ALL ADDRESSES
// ==========================================

const getAddresses = async (userId) => {

  const user = await User.findById(userId)
    .select("addresses");

  if (!user) {
    throw new Error("User not found");
  }


  // Old users ke documents mein
  // addresses field missing ho sakti hai.
  if (!Array.isArray(user.addresses)) {
    return [];
  }


  return user.addresses;
};


// ==========================================
// ADD NEW ADDRESS
// ==========================================

const addAddress = async (
  userId,
  addressData
) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }


  // ==========================================
  // IMPORTANT
  // Old users ke liye addresses initialize karo
  // ==========================================

  if (!Array.isArray(user.addresses)) {

    user.addresses = [];

  }


  const {
    type,
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    pincode,
    isDefault
  } = addressData;


  // ==========================================
  // DEFAULT ADDRESS
  // ==========================================

  if (isDefault === true) {

    user.addresses.forEach(
      (address) => {

        address.isDefault = false;

      }
    );

  }


  // ==========================================
  // CREATE NEW ADDRESS
  // ==========================================

  const newAddress = {

    type: type || "HOME",

    fullName,

    phone,

    addressLine1,

    addressLine2:
      addressLine2 || "",

    city,

    state,

    pincode,

    // First address automatically default
    isDefault:
      isDefault === true ||
      user.addresses.length === 0

  };


  // ==========================================
  // PUSH ADDRESS INTO USER
  // ==========================================

  user.addresses.push(
    newAddress
  );


  // ==========================================
  // SAVE TO MONGODB
  // ==========================================

  await user.save();


  // ==========================================
  // FETCH SAVED DATA AGAIN
  // ==========================================

  const updatedUser =
    await User.findById(userId)
      .select("addresses");


  if (!updatedUser) {
    throw new Error("User not found");
  }


  return updatedUser.addresses;
};


// ==========================================
// UPDATE ADDRESS
// ==========================================

const updateAddress = async (
  userId,
  addressId,
  addressData
) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }


  if (!Array.isArray(user.addresses)) {

    user.addresses = [];

  }


  const address =
    user.addresses.id(addressId);


  if (!address) {

    throw new Error(
      "Address not found"
    );

  }


  const {
    type,
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    pincode,
    isDefault
  } = addressData;


  // ==========================================
  // UPDATE ONLY PROVIDED FIELDS
  // ==========================================

  if (type !== undefined) {

    address.type = type;

  }


  if (fullName !== undefined) {

    address.fullName = fullName;

  }


  if (phone !== undefined) {

    address.phone = phone;

  }


  if (
    addressLine1 !== undefined
  ) {

    address.addressLine1 =
      addressLine1;

  }


  if (
    addressLine2 !== undefined
  ) {

    address.addressLine2 =
      addressLine2;

  }


  if (city !== undefined) {

    address.city = city;

  }


  if (state !== undefined) {

    address.state = state;

  }


  if (pincode !== undefined) {

    address.pincode = pincode;

  }


  // ==========================================
  // MAKE THIS ADDRESS DEFAULT
  // ==========================================

  if (isDefault === true) {

    user.addresses.forEach(
      (item) => {

        item.isDefault = false;

      }
    );


    address.isDefault = true;

  }


  // ==========================================
  // SAVE
  // ==========================================

  await user.save();


  return user.addresses;
};


// ==========================================
// DELETE ADDRESS
// ==========================================

const deleteAddress = async (
  userId,
  addressId
) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }


  if (!Array.isArray(user.addresses)) {

    user.addresses = [];

  }


  const address =
    user.addresses.id(addressId);


  if (!address) {

    throw new Error(
      "Address not found"
    );

  }


  // Check whether deleted address
  // was the default address
  const wasDefault =
    address.isDefault;


  // ==========================================
  // DELETE ADDRESS
  // ==========================================

  address.deleteOne();


  // ==========================================
  // MAKE FIRST REMAINING ADDRESS DEFAULT
  // ==========================================

  if (
    wasDefault &&
    user.addresses.length > 0
  ) {

    user.addresses[0].isDefault =
      true;

  }


  // ==========================================
  // SAVE
  // ==========================================

  await user.save();


  return user.addresses;
};


// ==========================================
// SET DEFAULT ADDRESS
// ==========================================

const setDefaultAddress = async (
  userId,
  addressId
) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }


  if (!Array.isArray(user.addresses)) {

    user.addresses = [];

  }


  const address =
    user.addresses.id(addressId);


  if (!address) {

    throw new Error(
      "Address not found"
    );

  }


  // ==========================================
  // REMOVE DEFAULT FROM ALL
  // ==========================================

  user.addresses.forEach(
    (item) => {

      item.isDefault = false;

    }
  );


  // ==========================================
  // SET SELECTED ADDRESS DEFAULT
  // ==========================================

  address.isDefault = true;


  // ==========================================
  // SAVE
  // ==========================================

  await user.save();


  return user.addresses;
};


// ==========================================
// EXPORT ALL FUNCTIONS
// ==========================================

module.exports = {

  getProfile,

  updateProfile,

  getAddresses,

  addAddress,

  updateAddress,

  deleteAddress,

  setDefaultAddress

};