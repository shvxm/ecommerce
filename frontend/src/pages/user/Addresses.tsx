import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  addAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
  type Address,
  type AddressInput
} from "../../services/userService";

import "./Addresses.css";


const emptyForm: AddressInput = {
  type: "HOME",
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false
};


const Addresses = () => {

  // ==============================
  // URL PARAMETERS
  // ==============================

  const [searchParams] =
    useSearchParams();


  // ==============================
  // ADDRESS STATE
  // ==============================

  const [addresses, setAddresses] =
    useState<Address[]>([]);


  // ==============================
  // FORM STATE
  // ==============================

  const [form, setForm] =
    useState<AddressInput>({
      ...emptyForm
    });


  const [editingId, setEditingId] =
    useState<string | null>(null);


  const [showForm, setShowForm] =
    useState(false);


  // ==============================
  // LOADING STATE
  // ==============================

  const [loading, setLoading] =
    useState(true);


  const [saving, setSaving] =
    useState(false);


  // ==============================
  // MESSAGE STATE
  // ==============================

  const [error, setError] =
    useState("");


  const [message, setMessage] =
    useState("");


  // ==============================
  // LOAD ADDRESSES
  // ==============================

  useEffect(() => {

    loadAddresses();

  }, []);


  // ==============================
  // HANDLE EDIT QUERY PARAM
  // ==============================

  useEffect(() => {

    if (loading || addresses.length === 0) {
      return;
    }


    const editId =
      searchParams.get("edit");


    if (!editId) {
      return;
    }


    const addressToEdit =
      addresses.find(
        (address) =>
          address._id === editId
      );


    if (addressToEdit) {

      handleEdit(addressToEdit);

    }

  }, [
    loading,
    addresses,
    searchParams
  ]);


  // ==============================
  // GET ADDRESSES FROM API
  // ==============================

  const loadAddresses = async () => {

    try {

      setLoading(true);

      setError("");


      const data =
        await getAddresses();


      // ==============================
      // IMPORTANT SAFETY CHECK
      // ==============================

      if (Array.isArray(data)) {

        setAddresses(data);

      } else {

        setAddresses([]);

      }

    } catch (err: any) {

      console.error(
        "Failed to load addresses:",
        err
      );


      setAddresses([]);


      setError(
        err?.response?.data?.message ||
        "Failed to load addresses"
      );

    } finally {

      setLoading(false);

    }

  };


  // ==============================
  // UPDATE FORM
  // ==============================

  const updateForm = (
    field: keyof AddressInput,
    value: string | boolean
  ) => {

    setForm((previous) => ({
      ...previous,
      [field]: value
    }));

  };


  // ==============================
  // RESET FORM
  // ==============================

  const resetForm = () => {

    setForm({
      ...emptyForm
    });

    setEditingId(null);

    setShowForm(false);

    setError("");

  };


  // ==============================
  // OPEN ADD FORM
  // ==============================

  const openAddForm = () => {

    setForm({
      ...emptyForm
    });

    setEditingId(null);

    setShowForm(true);

    setError("");

    setMessage("");

  };


  // ==============================
  // VALIDATE FORM
  // ==============================

  const validateForm = () => {

    if (!form.fullName.trim()) {

      return "Full name is required";

    }


    if (
      !/^[0-9]{10}$/.test(
        form.phone
      )
    ) {

      return "Enter a valid 10 digit phone number";

    }


    if (!form.addressLine1.trim()) {

      return "Address is required";

    }


    if (!form.city.trim()) {

      return "City is required";

    }


    if (!form.state.trim()) {

      return "State is required";

    }


    if (
      !/^[0-9]{6}$/.test(
        form.pincode
      )
    ) {

      return "Enter a valid 6 digit pincode";

    }


    return "";

  };


  // ==============================
  // SUBMIT ADDRESS
  // ==============================

  const handleSubmit = async (
    event: React.FormEvent
  ) => {

    event.preventDefault();


    setError("");

    setMessage("");


    const validationError =
      validateForm();


    if (validationError) {

      setError(validationError);

      return;

    }


    try {

      setSaving(true);


      let data: Address[];


      // ==============================
      // UPDATE EXISTING ADDRESS
      // ==============================

      if (editingId) {

        data =
          await updateAddress(
            editingId,
            form
          );


        setMessage(
          "Address updated successfully"
        );

      }

      // ==============================
      // ADD NEW ADDRESS
      // ==============================

      else {

        data =
          await addAddress(form);


        setMessage(
          "Address added successfully"
        );

      }


      // ==============================
      // SAFELY UPDATE STATE
      // ==============================

      if (Array.isArray(data)) {

        setAddresses(data);

      } else {

        // If API response is unexpected,
        // reload addresses from backend.

        await loadAddresses();

      }


      setEditingId(null);

      setForm({
        ...emptyForm
      });

      setShowForm(false);

    } catch (err: any) {

      console.error(
        "Failed to save address:",
        err
      );


      setError(
        err?.response?.data?.message ||
        "Failed to save address"
      );

    } finally {

      setSaving(false);

    }

  };


  // ==============================
  // EDIT ADDRESS
  // ==============================

  const handleEdit = (
    address: Address
  ) => {

    setEditingId(
      address._id
    );


    setForm({

      type: address.type,

      fullName: address.fullName,

      phone: address.phone,

      addressLine1:
        address.addressLine1,

      addressLine2:
        address.addressLine2 || "",

      city: address.city,

      state: address.state,

      pincode: address.pincode,

      isDefault:
        address.isDefault

    });


    setShowForm(true);

    setError("");

    setMessage("");

  };


  // ==============================
  // DELETE ADDRESS
  // ==============================

  const handleDelete = async (
    addressId: string
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this address?"
      );


    if (!confirmed) {

      return;

    }


    try {

      setError("");

      const data =
        await deleteAddress(
          addressId
        );


      if (Array.isArray(data)) {

        setAddresses(data);

      } else {

        await loadAddresses();

      }


      setMessage(
        "Address deleted successfully"
      );

    } catch (err: any) {

      console.error(
        "Failed to delete address:",
        err
      );


      setError(
        err?.response?.data?.message ||
        "Failed to delete address"
      );

    }

  };


  // ==============================
  // SET DEFAULT ADDRESS
  // ==============================

  const handleDefault = async (
    addressId: string
  ) => {

    try {

      setError("");

      const data =
        await setDefaultAddress(
          addressId
        );


      if (Array.isArray(data)) {

        setAddresses(data);

      } else {

        await loadAddresses();

      }


      setMessage(
        "Default address updated"
      );

    } catch (err: any) {

      console.error(
        "Failed to update default address:",
        err
      );


      setError(
        err?.response?.data?.message ||
        "Failed to update default address"
      );

    }

  };


  // ==============================
  // LOADING SCREEN
  // ==============================

  if (loading) {

    return (

      <div className="address-loading">

        Loading addresses...

      </div>

    );

  }


  // ==============================
  // MAIN UI
  // ==============================

  return (

    <main className="addresses-page">

      <div className="addresses-container">


        {/* =========================
            HEADER
        ========================== */}

        <div className="addresses-header">

          <div>

            <span className="addresses-eyebrow">

              MY ACCOUNT

            </span>


            <h1>
              My Addresses
            </h1>


            <p>
              Manage your saved delivery
              addresses
            </p>

          </div>


          {!showForm && (

            <button
              type="button"
              className="add-address-button"
              onClick={openAddForm}
            >

              + Add Address

            </button>

          )}

        </div>


        {/* =========================
            SUCCESS MESSAGE
        ========================== */}

        {message && (

          <div className="address-message success">

            ✓ {message}

          </div>

        )}


        {/* =========================
            ERROR MESSAGE
        ========================== */}

        {error && (

          <div className="address-message error">

            ! {error}

          </div>

        )}


        {/* =========================
            ADDRESS FORM
        ========================== */}

        {showForm && (

          <form
            className="address-form"
            onSubmit={handleSubmit}
          >


            <div className="address-form-header">

              <h2>

                {editingId
                  ? "Edit Address"
                  : "Add New Address"}

              </h2>


              <button
                type="button"
                onClick={resetForm}
              >

                ×

              </button>

            </div>


            {/* =========================
                ADDRESS TYPE
            ========================== */}

            <div className="address-type-row">

              {(
                [
                  "HOME",
                  "WORK",
                  "OTHER"
                ] as const
              ).map((type) => (

                <button
                  type="button"
                  key={type}
                  className={
                    form.type === type
                      ? "address-type active"
                      : "address-type"
                  }
                  onClick={() =>
                    updateForm(
                      "type",
                      type
                    )
                  }
                >

                  {type === "HOME"
                    ? "⌂ Home"
                    : type === "WORK"
                    ? "▣ Work"
                    : "⌖ Other"}

                </button>

              ))}

            </div>


            {/* =========================
                FORM GRID
            ========================== */}

            <div className="address-form-grid">


              {/* FULL NAME */}

              <div>

                <label>
                  Full Name
                </label>

                <input
                  value={
                    form.fullName
                  }
                  onChange={(event) =>
                    updateForm(
                      "fullName",
                      event.target.value
                    )
                  }
                  placeholder="Full name"
                />

              </div>


              {/* PHONE */}

              <div>

                <label>
                  Phone Number
                </label>

                <input
                  value={
                    form.phone
                  }
                  maxLength={10}
                  inputMode="numeric"
                  onChange={(event) =>
                    updateForm(
                      "phone",
                      event.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  placeholder="10 digit phone"
                />

              </div>


              {/* ADDRESS LINE 1 */}

              <div className="full-width">

                <label>
                  Address Line 1
                </label>

                <input
                  value={
                    form.addressLine1
                  }
                  onChange={(event) =>
                    updateForm(
                      "addressLine1",
                      event.target.value
                    )
                  }
                  placeholder="House / Flat / Building"
                />

              </div>


              {/* ADDRESS LINE 2 */}

              <div className="full-width">

                <label>
                  Address Line 2
                </label>

                <input
                  value={
                    form.addressLine2 || ""
                  }
                  onChange={(event) =>
                    updateForm(
                      "addressLine2",
                      event.target.value
                    )
                  }
                  placeholder="Street / Area / Landmark"
                />

              </div>


              {/* CITY */}

              <div>

                <label>
                  City
                </label>

                <input
                  value={
                    form.city
                  }
                  onChange={(event) =>
                    updateForm(
                      "city",
                      event.target.value
                    )
                  }
                  placeholder="City"
                />

              </div>


              {/* STATE */}

              <div>

                <label>
                  State
                </label>

                <input
                  value={
                    form.state
                  }
                  onChange={(event) =>
                    updateForm(
                      "state",
                      event.target.value
                    )
                  }
                  placeholder="State"
                />

              </div>


              {/* PINCODE */}

              <div>

                <label>
                  Pincode
                </label>

                <input
                  value={
                    form.pincode
                  }
                  maxLength={6}
                  inputMode="numeric"
                  onChange={(event) =>
                    updateForm(
                      "pincode",
                      event.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  placeholder="6 digit pincode"
                />

              </div>

            </div>


            {/* =========================
                DEFAULT CHECKBOX
            ========================== */}

            <label className="default-checkbox">

              <input
                type="checkbox"
                checked={
                  form.isDefault || false
                }
                onChange={(event) =>
                  updateForm(
                    "isDefault",
                    event.target.checked
                  )
                }
              />


              <span>
                Set as default address
              </span>

            </label>


            {/* =========================
                FORM BUTTONS
            ========================== */}

            <div className="address-form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
              >

                Cancel

              </button>


              <button
                type="submit"
                className="save-address-button"
                disabled={saving}
              >

                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Address"
                  : "Save Address"}

              </button>

            </div>

          </form>

        )}


        {/* =========================
            EMPTY STATE
        ========================== */}

        {!showForm &&
          addresses.length === 0 && (

            <div className="empty-addresses">

              <div className="empty-icon">
                ⌖
              </div>


              <h2>
                No saved addresses
              </h2>


              <p>
                Add an address to make
                checkout faster.
              </p>


              <button
                type="button"
                onClick={openAddForm}
              >

                Add Your First Address

              </button>

            </div>

          )}


        {/* =========================
            ADDRESS LIST
        ========================== */}

        {addresses.length > 0 && (

          <div className="address-list">

            {addresses.map(
              (address) => (

                <div
                  className="address-card"
                  key={address._id}
                >


                  {/* =====================
                      CARD HEADER
                  ====================== */}

                  <div className="address-card-top">

                    <div className="address-title">

                      <span className="address-icon">

                        {address.type === "HOME"
                          ? "⌂"
                          : address.type === "WORK"
                          ? "▣"
                          : "⌖"}

                      </span>


                      <strong>

                        {address.type}

                      </strong>


                      {address.isDefault && (

                        <span className="default-badge">

                          DEFAULT

                        </span>

                      )}

                    </div>

                  </div>


                  {/* =====================
                      ADDRESS CONTENT
                  ====================== */}

                  <div className="address-content">

                    <strong>
                      {address.fullName}
                    </strong>


                    <span>
                      {address.phone}
                    </span>


                    <p>

                      {address.addressLine1}


                      {address.addressLine2 && (

                        <>
                          ,{" "}
                          {address.addressLine2}
                        </>

                      )}


                      <br />


                      {address.city},{" "}

                      {address.state}


                      <br />


                      {address.pincode}

                    </p>

                  </div>


                  {/* =====================
                      ACTIONS
                  ====================== */}

                  <div className="address-actions">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(address)
                      }
                    >

                      Edit

                    </button>


                    <button
                      type="button"
                      className="delete-address"
                      onClick={() =>
                        handleDelete(
                          address._id
                        )
                      }
                    >

                      Delete

                    </button>


                    {!address.isDefault && (

                      <button
                        type="button"
                        className="default-address-button"
                        onClick={() =>
                          handleDefault(
                            address._id
                          )
                        }
                      >

                        Set Default

                      </button>

                    )}

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </main>

  );

};


export default Addresses;