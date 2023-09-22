import { Box, Button, TextField } from "@mui/material";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { useFormik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axiosConfig from "../../API/axiosConfig";
import { useNavigate } from "react-router-dom";
import Dropzone from "react-dropzone";
import { useState } from "react";
import "../addSpeaker/style.css";

const CREATE_NEWS_URL = "/articles/add";

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  text: yup.string().required("Article body is required"),
  date: yup.date("Invalid date").required("Date is required"),
  image: yup.mixed().required("Image is required"),
});

const News = () => {
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [previewImage, setPreviewImage] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const formik = useFormik({
    initialValues: {
      title: "",
      text: "",
      date: null,
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("text", values.text);
      formData.append("date", currentDate);
      formData.append("image", values.image);
      console.log(formData);
      try {
        await axiosConfig.post(CREATE_NEWS_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });

        navigate("/speakers");
      } catch (err) {
        console.log("Error creating news article: ", err);
      }
    },
  });

  return (
    <Box m="20px">
      <Header title="ADD NEWS ARTICLE" subtitle="Add a new article" />

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
            label="Article title"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.title}
            name="title"
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />

          <TextField
            label="Article body"
            minRows={8}
            multiline
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.text}
            error={formik.touched.text && Boolean(formik.errors.text)}
            helperText={formik.touched.text && formik.errors.text}
            name="text"
            variant="filled"
          />

          {/* <Field
            as={TextField}
            label="Message"
            name="message"
            variant="filled"
            multiline
            rows={5}
            fullWidth
          /> */}

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
            Create news article
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default News;
