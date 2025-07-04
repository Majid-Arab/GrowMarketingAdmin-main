import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  DialogActions,
  TextField,
} from "@mui/material";
import { PiNotepad, PiXLight } from "react-icons/pi";
import { updateUser } from "../../redux/action/user";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const EditClient = ({ open, setOpen, scroll }) => {
  //////////////////////////////////////// VARIABLES /////////////////////////////////////
  const dispatch = useDispatch();
  const { currentEmployee: currentClient, isFetching } = useSelector((state) => state.user);

  //////////////////////////////////////// STATE /////////////////////////////////////
  const [clientData, setClientData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  // Populate form when client changes
  useEffect(() => {
    if (currentClient) {
      setClientData({
        firstName: currentClient.firstName || "",
        lastName: currentClient.lastName || "",
        username: currentClient.username || "",
        password: "", // do not prefill password
        phone: currentClient.phone || "",
        email: currentClient.email || "",
      });
    }
  }, [currentClient]);

  //////////////////////////////////////// HELPERS /////////////////////////////////////
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstName":
        if (!value.trim()) error = "First name is required";
        break;
      case "lastName":
        if (!value.trim()) error = "Lastname is required";
        break;
      case "username":
        if (!value.trim()) error = "Username is required";
        break;
      case "email":
        if (value && !/\S+@\S+\.\S+/.test(value))
          error = "Invalid email format";
        else if (!value.trim()) error = "Email is required";
        break;
      case "phone":
        if (!value) error = "Phone number is required";
        else if (value.length < 11)
          error = "Phone must be at least 11 characters long";
        else if (!/^\d+$/.test(value))
          error = "Phone number must contain only digits";
        break;
      default:
        break;
    }

    return error;
  };

  //////////////////////////////////////// FUNCTIONS /////////////////////////////////////
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateField();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    // Prepare payload (omit empty password)
    const payload = { ...clientData };
    if (!payload.password) delete payload.password;

    dispatch(updateUser(currentClient._id, payload));
    setOpen(false);
  };

  const handleChange = (field, value) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    setClientData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({});
  };

  //////////////////////////////////////// RENDER /////////////////////////////////////
  return (
    <Dialog
      scroll={scroll}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      fullWidth="sm"
      maxWidth="sm"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle className="flex items-center justify-between">
        <div className="text-sky-400 font-primary">Edit Client</div>
        <div className="cursor-pointer" onClick={handleClose}>
          <PiXLight className="text-[25px]" />
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-2 p-3 text-gray-500 font-primary">
          <div className="text-xl flex justify-start items-center gap-2 font-normal">
            <PiNotepad size={23} />
            <span>Client Details</span>
          </div>
          <Divider />
          <table className="mt-4">
            <tbody>
              <tr>
                <td className="pb-4 text-lg">First Name</td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    fullWidth
                    value={clientData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Last Name</td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    fullWidth
                    value={clientData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Username</td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    fullWidth
                    value={clientData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    error={!!errors.username}
                    helperText={errors.username}
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Email</td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Optional"
                    value={clientData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </td>
              </tr>
              <tr>
                <td className="flex items-start pt-2 text-lg">Password</td>
                <td className="pb-4">
                  <TextField
                    type="password"
                    size="small"
                    fullWidth
                    placeholder="Leave blank to keep current"
                    value={clientData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="flex items-start pt-2 text-lg">Phone</td>
                <td className="pb-4">
                  <TextField
                    type="number"
                    size="small"
                    fullWidth
                    value={clientData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </DialogContent>
      <DialogActions>
        <button
          onClick={handleClose}
          className="bg-[#d7d7d7] px-4 py-2 rounded-lg text-gray-500 mt-4 hover:text-white hover:bg-[#6c757d] border-[2px] border-[#efeeee] hover:border-[#d7d7d7] font-thin transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isFetching}
          className="bg-primary-red px-4 py-2 rounded-lg text-white mt-4 hover:bg-red-400 font-thin"
        >
          {isFetching ? "Updating..." : "Update"}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default EditClient;