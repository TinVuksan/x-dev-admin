import { Box, Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axiosConfig from "../../API/axiosConfig";
import { useNavigate } from "react-router-dom";
import Dropzone from "react-dropzone";
import { useState } from "react";
import "./style.css";

const CREATE_SPEAKER_URL = "/speakers/add";

// const phoneRegExp =
//   /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const validationSchema = yup.object().shape({
  name: yup.string().required("Required field"),
  email: yup.string().email("Invalid email").required("Email is required"),
  country: yup.string().required("Country is required"),
  position: yup.string().required("Position is required"),
  image: yup.mixed().required("Image is required"),
  bio: yup.string().required("Short biography is required"),
});

const Form = () => {
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [previewImage, setPreviewImage] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      country: "",
      position: "",
      bio: "",
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("image", values.image);
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("country", values.country);
      formData.append("position", values.position);
      formData.append("bio", values.bio);
      console.log(formData);
      try {
        await axiosConfig.post(CREATE_SPEAKER_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });

        navigate("/speakers");
      } catch (err) {
        console.log("Error creating speakear: ", err);
      }
    },
  });

  return (
    <Box m="20px">
      <Header title="ADD A SPEAKER" subtitle="Add a new speaker" />

      <form onSubmit={formik.handleSubmit}>
        <Box
          display="grid"
          width="50%"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr)"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          <TextField
            variant="filled"
            type="text"
            label="Full name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.name}
            name="name"
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField
            variant="filled"
            type="text"
            label="Email"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.email}
            name="email"
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            variant="filled"
            type="text"
            label="Country"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.country}
            name="country"
            error={formik.touched.country && Boolean(formik.errors.country)}
            helperText={formik.touched.country && formik.errors.country}
          />
          <TextField
            variant="filled"
            type="text"
            label="Position"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.position}
            name="position"
            error={formik.touched.position && Boolean(formik.errors.position)}
            helperText={formik.touched.position && formik.errors.position}
          />

          <TextField
            variant="filled"
            type="text"
            label="Short Bio"
            multiline
            maxRows={4}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.bio}
            name="bio"
            error={formik.touched.bio && Boolean(formik.errors.bio)}
            helperText={formik.touched.bio && formik.errors.bio}
          />
          <Dropzone
            onDrop={(acceptedFields) => {
              formik.setFieldValue("image", acceptedFields[0]);
              const reader = new FileReader();
              reader.onload = (e) => {
                setPreviewImage(e.target.result);
              };
              reader.readAsDataURL(acceptedFields[0]);
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <Box className="dropzone" {...getRootProps()}>
                <input {...getInputProps()} />
                <p>
                  "Drag and drop an image file here, or click to select one."
                </p>
              </Box>
            )}
          </Dropzone>
        </Box>
        {formik.errors.image && formik.touched.image && (
          <p>{formik.errors.image}</p>
        )}
        {previewImage && (
          <Box className="image-preview mt-3">
            <img width="20%" src={previewImage} alt="Preview" />
          </Box>
        )}
        <Box display="flex" justifyContent="end" mt="20px">
          <Button type="submit" color="secondary" variant="contained">
            Create new speaker
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Form;
