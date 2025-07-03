import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createClient } from "../../redux/action/user";
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const CreateClient = ({ open, setOpen, scroll }) => {
  //////////////////////////////////////// VARIABLES /////////////////////////////////////
  const { isFetching } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const initialClientState = {
    firstName: "",
    username: "",
    phone: "",
    email: "",
  };

  //////////////////////////////////////// STATES /////////////////////////////////////
  const [clientData, setClientData] = useState(initialClientState);
  const [errors, setErrors] = useState({
    firstName: "",
    username: "",
    phone: "",
    email: "",
  });

  //////////////////////////////////////// USE EFFECTS /////////////////////////////////////

  //////////////////////////////////////// FUNCTIONS /////////////////////////////////////
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstName":
        if (!value.trim()) error = "First name is required";
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

  const validateForm = () => {
    const newErrors = {
      firstName: validateField("firstName", clientData.firstName),
      username: validateField("username", clientData.username),
      phone: validateField("phone", clientData.phone),
      email: validateField("email", clientData.email),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      dispatch(createClient(clientData, setOpen));
      setClientData(initialClientState);
    }
  };

  const handleChange = (field, value) => {
    setClientData((prevFilters) => ({ ...prevFilters, [field]: value }));
  };

  const handleClose = () => {
    setOpen(false);
    setClientData(initialClientState);
  };

  return (
    <div>
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
          <div className="text-sky-400 font-primary">Add New Client</div>
          <div className="cursor-pointer" onClick={handleClose}>
            <PiXLight className="text-[25px]" />
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-2 p-3 text-gray-500 font-primary">
            <div className="text-xl flex justify-start items-center gap-2 font-normal">
              <PiNotepad size={23} />
              <span>Client Detials</span>
            </div>
            <Divider />
            <table className="mt-4">
              <tr>
                <td className="pb-4 text-lg">First Name </td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    fullWidth
                    required
                    placeholder="Enter your first name"
                    value={clientData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">User Name </td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    fullWidth
                    required
                    placeholder="Enter your username"
                    value={clientData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    error={!!errors.username}
                    helperText={errors.username}
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Email </td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    type="email"
                    fullWidth
                    required
                    placeholder="Enter your email"
                    value={clientData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </td>
              </tr>
              <tr>
                <td className="flex items-start pt-2 text-lg">Phone </td>
                <td className="pb-4">
                  <TextField
                    type="number"
                    size="small"
                    required
                    placeholder="Enter your phone"
                    value={clientData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </td>
              </tr>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleClose}
            variant="contained"
            type="reset"
            className="bg-[#d7d7d7] px-4 py-2 rounded-lg text-gray-500 mt-4 hover:text-white hover:bg-[#6c757d] border-[2px] border-[#efeeee] hover:border-[#d7d7d7] font-thin transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            variant="contained"
            className="bg-primary-red px-4 py-2 rounded-lg text-white mt-4 hover:bg-red-400 font-thin"
          >
            {isFetching ? "Submitting..." : "Submit"}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateClient;
