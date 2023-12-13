import { Fragment, useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../../../context/GlobalContext";
import { Box, fontWeight } from "@mui/system";
import {
   Button,
   ButtonGroup,
   Checkbox,
   Divider,
   FormControl,
   FormControlLabel,
   FormGroup,
   FormHelperText,
   FormLabel,
   IconButton,
   Input,
   Radio,
   RadioGroup,
   Step,
   StepLabel,
   Stepper,
   TextField,
   ToggleButton,
   ToggleButtonGroup,
   Tooltip,
   Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Formik } from "formik";
import * as Yup from "yup";

import { useRequestBecaContext } from "../../../context/RequestBecaContext";
import { IconEdit, IconInfoCircle } from "@tabler/icons";
import { useStudentContext } from "../../../context/StudentContext";
import Toast from "../../../utils/Toast";
import { Link, Navigate, useLoaderData, useParams } from "react-router-dom";
import { CorrectRes, ErrorRes } from "../../../utils/Response";
import { Axios } from "../../../context/AuthContext";
import sAlert from "../../../utils/sAlert";
import IconSended from "../../../components/icons/IconSended";
import Select2Component from "../../../components/Form/Select2Component";
import InputsCommunityComponent, { getCommunity } from "../../../components/Form/InputsCommunityComponent";
import { formatCurrency, handleInputFormik } from "../../../utils/Formats";

import DatePickerComponent from "../../../components/Form/DatePickerComponent";
import { useDisabilityContext } from "../../../context/DisabilityContext";
import { useSchoolContext } from "../../../context/SchoolContext";
import { useRelationshipContext } from "../../../context/RelationshipContext";
import InputFileComponent from "../../../components/Form/InputFileComponent";
import { useTutorContext } from "../../../context/TutorContext";
import SimpleTableComponent from "../../../components/SimpleTableComponent";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import InputComponentv2, { InputComponentv3 } from "../../../components/Form/InputComponent2";
import IconDelete from "../../../components/icons/IconDelete";
import FamilyDT, { monthlyIncome } from "./FamilyDT";
import { useFamilyContext } from "../../../context/FamilyContext";

const RequestBecaView = () => {
   // const { result } = useLoaderData();
   // const dataDisabilities = result.disabilities;
   // const dataSchools = result.schools;
   let { folio, pagina = 0 } = useParams();

   // const [folio, setFolio] = useState(null);

   const {
      setLoading,
      setLoadingAction,
      setDisabledState,
      setDisabledCity,
      setDisabledColony,
      setShowLoading,
      setDataStates,
      setDataCities,
      setDataColonies,
      setDataColoniesComplete
   } = useGlobalContext();

   // const { getIndexByFolio, families } = useFamilyContext();

   const { disabilities, getDisabilitiesSelectIndex } = useDisabilityContext();
   const { relationships, getRelationshipsSelectIndex } = useRelationshipContext();
   const { schools, getSchoolsSelectIndex } = useSchoolContext();
   const { getStudentByCURP } = useStudentContext();
   const { getTutorByCURP } = useTutorContext();
   const { formData, setFormData, resetFormData, getRequestBecasByFolio, createRequestBeca, updateRequestBeca, saveBeca } = useRequestBecaContext();
   const [isTutor, setIsTutor] = useState(false); // es true cuando el tutor no es el padre ni la madre
   const [imgIne, setImgIne] = useState([]);
   const [imgPowerLetter, setImgPowerLetter] = useState([]);

   const inputRefFullNameTutor = useRef(null);
   const inputRefCurp = useRef(null);
   const inputRefSchoolId = useRef(null);

   // const [monthlyIncomeChange, setMonthlyIncomeChange] = useState(0);

   const [formDataTutor, setFormDataTutor] = useState({
      id: 0,
      tutor_curp: "",
      tutor_relationship_id: 0,
      tutor_relationship: "",
      tutor_name: "",
      tutor_paternal_last_name: "",
      tutor_maternal_last_name: "",
      tutor_phone: "",
      tutor_img_ine: "",
      tutor_img_power_letter: ""
   });
   const [formDataStudent, setFormDataStudent] = useState({
      id: 0,
      curp: "",
      name: "",
      paternal_last_name: "",
      maternal_last_name: "",
      birthdate: "",
      gender: "",
      community_id: 0,
      street: "",
      num_ext: "",
      num_int: "",
      phone: "",
      director: "",
      loc_for: "1",
      zone: "U",

      zip: "",
      state: "Selecciona una opción...",
      city: "Selecciona una opción...",
      colony: "Selecciona una opción..."
   });

   // #region STEPER
   const steps = [
      "Datos del Tutor del Alumno",
      "Datos del Alumno",
      "Datos Academicos",
      "Datos Familiares",
      "Datos Económicos",
      "Datos de la Vivienda",
      "Equipamiento Doméstico",
      "Programas de Becas"
   ];

   const [activeStep, setActiveStep] = useState(Number(pagina) - 1);
   const [completed, setCompleted] = useState({});
   const [stepFailed, setStepFailed] = useState(-1);

   const totalSteps = () => {
      return steps.length;
   };

   const completedSteps = () => {
      return Object.keys(completed).length;
   };

   const isLastStep = () => {
      return activeStep === totalSteps() - 1;
   };

   const allStepsCompleted = () => {
      return completedSteps() === totalSteps();
   };

   const handleNext = () => {
      const newActiveStep =
         isLastStep() && !allStepsCompleted()
            ? // It's the last step, but not all steps have been completed,
              // find the first step that has been completed
              steps.findIndex((step, i) => !(i in completed))
            : activeStep + 1;

      setActiveStep(newActiveStep);
      location.hash = `/admin/solicitud-beca/pagina/${activeStep + 2}`;
      console.log("adelanteeeeeee");
   };

   const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      location.hash = `/admin/solicitud-beca/pagina/${activeStep}`;
      console.log("atrassssss");
   };

   const handleStep = (step) => () => {
      setActiveStep(step);
   };

   const handleComplete = () => {
      const newCompleted = completed;
      newCompleted[activeStep] = true;
      setCompleted(newCompleted);
      handleNext();
   };

   const handleReset = () => {
      setActiveStep(0);
      setCompleted({});
      resetFormData();
      // setTimeout(() => {
      //    inputRefFullNameTutor.current.focus();
      // }, 1000);
   };

   const ButtonsBeforeOrNext = ({ isSubmitting }) => (
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
         <Button color="inherit" variant="contained" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
            ATRAS
         </Button>
         <Box sx={{ flex: "1 1 auto" }} />
         {/* <Button onClick={handleNext} sx={{ mr: 1 }}>
                                       Adelante
                                    </Button> */}
         {activeStep !== steps.length &&
            (completed[activeStep] ? (
               <>
                  <Button
                     type="submit"
                     disabled={isSubmitting}
                     // loading={isSubmitting}
                     // loadingPosition="start"
                     variant="contained"
                  >
                     {console.log(completedSteps())}
                     {completedSteps() === 3 ? "REGISTRAR SOLICITUD" : "ADELANTE"}
                  </Button>

                  <Typography variant="caption" sx={{ ml: 1, display: "inline-block" }}>
                     Paso {activeStep + 1} completado
                  </Typography>
               </>
            ) : (
               <Button
                  // onClick={()=>onSubmit1(setValues)}
                  type="submit"
                  disabled={isSubmitting}
                  // loading={isSubmitting}
                  // loadingPosition="start"
                  variant="contained"
               >
                  {completedSteps() === totalSteps() - 1 ? "ENVIAR SOLICITUD" : "ADELANTE"}
               </Button>
            ))}
      </Box>
   );
   //#endregion
   const showErrorInput = (section, msg, formHelperText = false) => {
      // Toast.Error(`Error en Sección ${section}: ${msg}`);
      setTimeout(() => {
         setStepFailed(section - 1);
      }, 150);
      if (formHelperText) {
         return (
            <FormHelperText error id="ht-disability_id">
               {msg}
            </FormHelperText>
         );
      }
      return msg;
   };

   const handleChangeRelationships = (relationship, setFieldValue) => setIsTutor(relationship.id > 2 ? true : false);

   const handleChangeTutorCURP = async (e, values, setValues, setFieldValue) => {
      try {
         let curp = e.target.value.toUpperCase();
         // if (curp.length < 1) return Toast.Info("El campo CURP esta vacío");
         if (curp.length < 18) return;
         let axiosReponse = await getTutorByCURP(curp);
         // console.log(axiosReponse);

         if (axiosReponse.result == null)
            return sAlert.Info("El CURP ingresado no está registrado, veritifíca que este correcto para guardarse al finalizar esta solicitud.");

         // console.log("CURP - axiosReponse.result", axiosReponse.result);
         await setFieldValue("tutor_data_id", axiosReponse.result.id);
         await setFieldValue("tutor_relationship_id", axiosReponse.result.tutor_relationship_id);
         await setFieldValue("tutor_relationship", axiosReponse.result.relationship);
         // await setFieldValue("tutor_curp", axiosReponse.result.tutor_curp);
         await setFieldValue("tutor_name", axiosReponse.result.tutor_name);
         await setFieldValue("tutor_paternal_last_name", axiosReponse.result.tutor_paternal_last_name);
         await setFieldValue("tutor_maternal_last_name", axiosReponse.result.tutor_maternal_last_name);
         await setFieldValue("tutor_phone", axiosReponse.result.tutor_phone);
         await setFieldValue("tutor_img_ine", axiosReponse.result.tutor_img_ine);
         await setFieldValue("tutor_img_power_letter", axiosReponse.result.tutor_img_power_letter);

         await setFormData({ ...formData, ...values });
         // await setValues(formData);
         // console.log(formData);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleChangeCURP = async (e, values, setValues, setFieldValue) => {
      try {
         let curp = e.target.value.toUpperCase();
         // if (curp.length < 1) return Toast.Info("El campo CURP esta vacío");
         if (curp.length < 18) return;

         let axiosReponse = await getStudentByCURP(curp);
         // console.log(axiosReponse);

         if (axiosReponse.result == null)
            return sAlert.Info("El CURP ingresado no está registrado, veritifíca que este correcto para guardarse al finalizar esta solicitud.");

         await setFieldValue("student_data_id", axiosReponse.result.id);
         await setFieldValue("curp", axiosReponse.result.curp);
         await setFieldValue("name", axiosReponse.result.name);
         await setFieldValue("paternal_last_name", axiosReponse.result.paternal_last_name);
         await setFieldValue("maternal_last_name", axiosReponse.result.maternal_last_name);
         await setFieldValue("birthdate", axiosReponse.result.birthdate);
         await setFieldValue("gender", axiosReponse.result.gender);
         await setFieldValue("disability", axiosReponse.result.disability);
         await setFieldValue("disability_id", axiosReponse.result.disability_id);
         await setFieldValue("street", axiosReponse.result.street);
         await setFieldValue("num_ext", axiosReponse.result.num_ext);
         await setFieldValue("num_int", axiosReponse.result.num_int);

         await setFormData({ ...formData, ...values });
         // await setValues(formData);

         // hacer consulta a la api de Comunidad para sacar la localidad
         formData.community_id = axiosReponse.result.community_id;
         await setFieldValue("community_id", formData.community_id);
         await setFormData({ ...formData, ...values });

         if (formData.community_id > 0) {
            getCommunity(
               formData.zip,
               setFieldValue,
               formData.community_id,
               formData,
               setFormData,
               setDisabledState,
               setDisabledCity,
               setDisabledColony,
               setShowLoading,
               setDataStates,
               setDataCities,
               setDataColonies,
               setDataColoniesComplete
            );
         }
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const onSubmit1 = async (values, { setSubmitting, setErrors, resetForm, setValues }) => {
      try {
         if (isTutor) {
            values.tutor_img_ine = imgIne.length == 0 ? "" : imgIne[0].file;
            values.tutor_img_power_letter = imgPowerLetter.length == 0 ? "" : imgPowerLetter[0].file;
         }
         // console.log("values", values);
         await setFormData({ ...formData, ...values });
         console.log("formData-1", formData);
         // await setValues(formData);
         // console.log("formData", formData);
         // console.log("values", values);
         setStepFailed(-1);
         handleComplete();
         // setTimeout(() => {
         //    inputRefCurp.current.focus();
         // }, 500);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
         // if (error.code === "auth/user-not-found") setErrors({ email: "Usuario no registrado" });
         // if (error.code === "auth/wrong-password") setErrors({ password: "Contraseña incorrecta" });
      } finally {
         setSubmitting(false);
      }
   };

   const onSubmit2 = async (values, { setSubmitting, setErrors, resetForm, setValues }) => {
      try {
         values.num_int = values.num_int === "" ? "S/N" : values.num_int;

         console.log("values", values);
         await setFormData({ ...formData, ...values });
         console.log("formData-2", formData);
         // await setValues(values);
         // console.log("formData", formData);
         // console.log("values", values);
         setStepFailed(-1);
         handleComplete();
         // setTimeout(() => {
         //    inputRefSchoolId.current.focus();
         // }, 500);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
      } finally {
         setSubmitting(false);
      }
   };

   const onSubmit3 = async (values, { setSubmitting, setErrors, resetForm, setValues, setFieldValue }) => {
      try {
         // console.log("formData en submit3", formData);
         console.log("values", values);
         await setFormData({ ...formData, ...values });
         // console.log("formData", formData);
         // await setValues(formData);
         console.log("formData-3", formData);
         console.log("values", values);
         // console.log(formData);
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createRequestBeca(values);
         else axiosResponse = await updateRequestBeca(values);
         setSubmitting(false);
         setLoadingAction(false);

         if (axiosResponse.status_code != 200) return Toast.Error(axiosResponse.alert_text);
         sAlert.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         console.log("axiosResponse", axiosResponse);
         folio = axiosResponse.result.folio;
         sAlert.Success(
            `Tu solicitud ha sido creada, termina de llenar el formulario para que se considere tu solicitud. Tu folio es: 
            <h3>${folio}</h3> 
            <i>Puedes ver tus solicitudes guardadas y su estatus en la sección de "Mis Solicitudes" en tú menú lateral</i>`,
            null
         );
         setStepFailed(-1);
         setFieldValue("id", axiosResponse.result.id);
         setFieldValue("folio", axiosResponse.result.folio);
         // resetForm();
         // resetFormData();
         handleComplete();
         location.hash = `/admin/solicitud-beca/pagina/${activeStep + 2}/folio/${folio}`;

         // if (!checkAdd) setOpenDialog(false);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
      } finally {
         setSubmitting(false);
      }
   };

   const onSubmit4 = async (values, { setSubmitting, setErrors, resetForm, setValues }) => {
      try {
         // console.log("formData en submit3", formData);
         await setFormData({ ...formData, ...values });
         // await setFormData(values);
         // await setValues(formData);
         // return console.log(formData, values);
         setLoadingAction(true);
         const axiosResponse = await saveBeca(folio, pagina, values);
         setSubmitting(false);
         setLoadingAction(false);

         if (axiosResponse.status_code != 200) return Toast.Error(axiosResponse.alert_text);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         // console.log("axiosResponse", axiosResponse);
         setStepFailed(-1);
         // resetForm();
         // resetFormData();
         handleComplete();
         // if (!checkAdd) setOpenDialog(false);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
      } finally {
         setSubmitting(false);
      }
   };

   const onBlurCapture = () => {
      setStepFailed(-1);
   };

   const validationSchemas = (page) => {
      let validationSchema;
      switch (page) {
         case 1: // PAGINA DATOS DEL TUTOR
            validationSchema = Yup.object().shape({
               // id: 0,
               // folio: Yup.number("solo números").required("Folio requerido"),
               tutor_relationship_id: Yup.string().trim().required("Parentesco del tutor requerido"),
               tutor_curp: Yup.string()
                  .trim()
                  .matches(/^[A-Z]{4}[0-9]{6}[HM][A-Z]{2}[A-Z0-9]{4}[0-9]{1}$/, "Formato de CURP invalido")
                  .required("CURP del tutor requerido"),
               tutor_name: Yup.string().trim().required("Nombre del tutor requerido"),
               tutor_paternal_last_name: Yup.string().trim().required("Apellido Paterno requerido"),
               tutor_maternal_last_name: Yup.string().trim().required("Apellido Materno requerido"),
               tutor_phone: Yup.string().trim().min(10, "El número telefónico debe ser a 10 digitos").required("Número telefonico del tutor requerido"),
               tutor_img_ine: isTutor && Yup.string().trim().required("Imagen de INE requerida"),
               tutor_img_power_letter: isTutor && Yup.string().trim().required("Imagen de Carta Poder requerida")
            });
            break;
         case 2: // PAGINA DATOS DEL ALUMNO
            validationSchema = Yup.object().shape({
               // id: 0,
               // student_data_id: 0,
               curp: Yup.string()
                  .trim()
                  .matches(/^[A-Z]{4}[0-9]{6}[HM][A-Z]{2}[A-Z0-9]{4}[0-9]{1}$/, "Formato de CURP invalido")
                  .required("CURP del alumno requerido"),
               name: Yup.string().trim().required("Nombre(s) del alumno requerido(s)"),
               paternal_last_name: Yup.string().trim().required("Apellido Paterno requerido"),
               maternal_last_name: Yup.string().trim().required("Apellido Materno requerido"),
               birthdate: Yup.date("Fecha inválida").required("Fecha de nacimiento requerida"),
               // gender: Yup.string().trim().required("Género requerido"),
               zip: Yup.number("Solo números").required("Código Postal requerido"),
               community_id: Yup.number().min(1, "Ésta opción no es valida").required("Colonia requerida"),
               colony: Yup.string().trim().required("Colonia requerida"),
               street: Yup.string().trim().required("Dirección requerida"),
               num_ext: Yup.string().trim().required("Número exterior requerido"),
               // num_int: Yup.string().trim().required("Clave de escuela requerida"),
               disability_id: Yup.number().min(1, "Ésta opción no es valida").required("Discapacidad requerida")
            });
            break;
         case 3: // PAGINA DATOS DE LA ESCUELA
            validationSchema = Yup.object().shape({
               // id: 0,
               school_id: Yup.number("Solo números").required("Escuela requerida"),
               grade: Yup.number("Solo números").required("Grado estudiantil requerido"),
               average: Yup.number("Solo números").required("Promedio actual requerido")
               // comments: Yup.string().trim().required("Comentarios requeridos"),
            });
            break;
         case 4: // PAGINA DATOS DE LA ESCUELA
            validationSchema = Yup.object().shape({
               // id: 0,
               extra_income: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Ingresos Extra requerido"),
               monthly_income: Yup.number("Solo números").min(0, "No puedes poner valores negativos").required("Ingresos Mensuales requerido")
            });
            break;
         case 5:
            break;
         case 6:
            break;
         case 7:
            break;
         case 8:
            break;
         default:
            break;
      }
      return validationSchema;
   };

   const ButtonsAction = ({ id, name, active }) => {
      return (
         <ButtonGroup variant="outlined">
            <Tooltip title={`Editar ${name}`} placement="top">
               <IconButton color="info" onClick={() => handleClickEdit(id)}>
                  <IconEdit />
               </IconButton>
            </Tooltip>
            <Tooltip title={`Eliminar ${name}`} placement="top">
               <IconButton color="error" onClick={() => handleClickDelete(id, name)}>
                  <IconDelete />
               </IconButton>
            </Tooltip>
            {/* {auth.role_id == ROLE_SUPER_ADMIN && (
               <Tooltip title={active ? "Desactivar" : "Reactivar"} placement="right">
                  <Button color="dark" onClick={() => handleClickDisEnable(id, name, active)} sx={{}}>
                     <SwitchComponent checked={active} />
                  </Button>
               </Tooltip>
            )} */}
         </ButtonGroup>
      );
   };

   const [houseIs, setHouseIs] = useState("Porpia");
   const handleHouseIs = (event, newValue) => {
      console.log("el newValue", event.target.value);
      setHouseIs(event.target.value);
   };

   // const monthlyIncomeChange = (values, setValues) => {
   //    console.log("values", values);
   //    console.log("monthlyIncome cambio: ", monthlyIncome);
   //    formData.monthly_income = monthlyIncome;
   //    values.monthly_income = monthlyIncome;
   //    setValues(values);
   //    // setFieldValue("monthly_income", monthlyIncome);
   // };

   useEffect(() => {
      console.log("formData", formData);
      // console.log("monthlyIncome", monthlyIncome);
      if (formData.id < 1) {
         console.log("folio de params?", folio);
         console.log("pagina de params?", pagina);
         if (folio) {
            getRequestBecasByFolio(folio);
            console.log("holaaaaa familia");
            console.log("formData", formData);
         }
         getDisabilitiesSelectIndex();
         getSchoolsSelectIndex();
         getRelationshipsSelectIndex();
         setLoading(false);

         // window.location.hash = ;
         // inputRefFullNameTutor.current.focus();
         // console.log("useEffect - formData", formData);
      }
   }, []);
   // }, [formData, pagina, activeStep]);

   return (
      <Box sx={{ width: "100%", height: "100%" }}>
         <Typography variant="h1" color={"#364152"} mb={2}>
            Solicitud de Beca
         </Typography>
         {pagina == 0 ? (
            <Box sx={{ height: "85%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} p={2}>
               <Typography variant="h2" mb={2}>
                  DIRECCION DE EDUCACIÓN
               </Typography>
               <Typography variant="h3" align="justify" mb={2} sx={{ fontWeight: "normal", lineHeight: 2, maxWidth: "70%" }}>
                  El presente cuestionario tiene por objetivo conocer el perfil de los aspirantes a obtener una beca del <b>R. Ayuntamiento de Gómez Palacio</b>. La
                  información proporcionada de aqui debe ser completamente verdadera, por ello, lee con atención cada pregunta y contesta adecuadamente.
               </Typography>
               <Link to={"pagina/1"}>
                  <Button onClick={handleReset} variant="contained" fullWidth>
                     COMENZAR SOLICITUD
                  </Button>
               </Link>
            </Box>
         ) : (
            <>
               <Stepper nonLinear activeStep={activeStep}>
                  {steps.map((label, index) => {
                     const labelProps = {};
                     if (stepFailed === index) {
                        labelProps.optional = (
                           <Typography variant="caption" color="error">
                              Hay un campo invalido en esta sección.
                           </Typography>
                        );

                        labelProps.error = true;
                     }
                     return (
                        <Step key={label} completed={completed[index]}>
                           <StepLabel {...labelProps} color="inherit" onClick={handleStep(index)}>
                              {label}
                           </StepLabel>
                        </Step>
                     );
                  })}
               </Stepper>
               <Box sx={{ height: "85%", display: "flex", flexDirection: "column", justifyContent: "space-between" }} p={2}>
                  {allStepsCompleted() ? (
                     <Fragment>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 5 }}>
                           <IconSended />
                           <Typography sx={{ my: 5 }} variant={"h3"} textAlign={"center"}>
                              Toma captura a esta pantalla y guarda el Folio generado:
                              <Typography sx={{ mt: 2, fontWeight: "bolder" }} variant={"h1"} component={"p"} textAlign={"center"}>
                                 No. Folio: {folio}
                              </Typography>
                           </Typography>
                           <Button onClick={handleReset} variant="contained" fullWidth>
                              Nueva Solicitud
                           </Button>
                        </Box>
                     </Fragment>
                  ) : (
                     <Fragment>
                        {/* <Typography sx={{ mt: 2, mb: 1, py: 1 }}>ESTOY EN EL CONTENIDO STEP?? {activeStep + 1}</Typography> */}
                        <Box sx={{ mt: 2, height: "100%" }}>
                           {activeStep + 1 == 1 && (
                              <Formik initialValues={formData} validationSchema={validationSchemas(activeStep + 1)} onSubmit={onSubmit1}>
                                 {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                                    <Box
                                       sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                                       component={"form"}
                                       onSubmit={handleSubmit}
                                       onBlur={onBlurCapture}
                                    >
                                       <Grid container spacing={2}>
                                          {/* CURP tutor */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <TextField
                                                id="tutor_curp"
                                                name="tutor_curp"
                                                label="CURP *"
                                                FormHelperTextProps={{ itemScope: <IconInfoCircle /> }}
                                                type="text"
                                                value={values.tutor_curp}
                                                placeholder="Ingresa tu CURP"
                                                onChange={(e) => {
                                                   handleChange(e);
                                                   handleChangeTutorCURP(e, values, setValues, setFieldValue);
                                                }}
                                                onBlur={handleBlur}
                                                inputProps={{ maxLength: 18 }}
                                                fullWidth
                                                onInput={(e) => handleInputFormik(e, setFieldValue, "tutor_curp", true)}
                                                disabled={values.id == 0 ? false : true}
                                                // inputRef={inputRefTutorCurp}
                                                error={errors.tutor_curp && touched.tutor_curp}
                                                helperText={errors.tutor_curp && touched.tutor_curp && showErrorInput(2, errors.tutor_curp)}
                                             />
                                          </Grid>
                                          {/* Parentesco */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <Select2Component
                                                idName={"tutor_relationship_id"}
                                                label={"Parentesco *"}
                                                valueLabel={values.tutor_relationship}
                                                formDataLabel={"tutor_relationship"}
                                                placeholder={"Selecciona una opción..."}
                                                options={relationships}
                                                fullWidth={true}
                                                handleChangeValueSuccess={handleChangeRelationships}
                                                handleBlur={handleBlur}
                                                error={errors.tutor_relationship_id}
                                                touched={touched.tutor_relationship_id}
                                                disabled={false}
                                             />
                                          </Grid>
                                          {/* Nombre Tutor */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <TextField
                                                id="tutor_name"
                                                name="tutor_name"
                                                label="Nombre del Tutor *"
                                                type="text"
                                                value={values.tutor_name}
                                                placeholder="Escribe tú nombre completo"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                onInput={(e) => handleInputFormik(e, setFieldValue, "tutor_name", true)}
                                                // disabled={values.id == 0 ? false : true}
                                                inputRef={inputRefFullNameTutor}
                                                error={errors.tutor_name && touched.tutor_name}
                                                helperText={errors.tutor_name && touched.tutor_name && showErrorInput(1, errors.tutor_name)}
                                             />
                                          </Grid>
                                          {/* Apellido Paterno Tutor */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <TextField
                                                id="tutor_paternal_last_name"
                                                name="tutor_paternal_last_name"
                                                label="Apellido Paterno del Tutor *"
                                                type="text"
                                                value={values.tutor_paternal_last_name}
                                                placeholder="Escribe tú primer apellido"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                onInput={(e) => handleInputFormik(e, setFieldValue, "tutor_paternal_last_name", true)}
                                                // disabled={values.id == 0 ? false : true}
                                                inputRef={inputRefFullNameTutor}
                                                error={errors.tutor_paternal_last_name && touched.tutor_paternal_last_name}
                                                helperText={
                                                   errors.tutor_paternal_last_name &&
                                                   touched.tutor_paternal_last_name &&
                                                   showErrorInput(1, errors.tutor_paternal_last_name)
                                                }
                                             />
                                          </Grid>
                                          {/* Apellido Materno Tutor */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <TextField
                                                id="tutor_maternal_last_name"
                                                name="tutor_maternal_last_name"
                                                label="Apellido Materno del Tutor *"
                                                type="text"
                                                value={values.tutor_maternal_last_name}
                                                placeholder="Escribe tú segundo apellido"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                onInput={(e) => handleInputFormik(e, setFieldValue, "tutor_maternal_last_name", true)}
                                                // disabled={values.id == 0 ? false : true}
                                                inputRef={inputRefFullNameTutor}
                                                error={errors.tutor_maternal_last_name && touched.tutor_maternal_last_name}
                                                helperText={
                                                   errors.tutor_maternal_last_name &&
                                                   touched.tutor_maternal_last_name &&
                                                   showErrorInput(1, errors.tutor_maternal_last_name)
                                                }
                                             />
                                          </Grid>
                                          {/* Tel Tutor */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <TextField
                                                id="tutor_phone"
                                                name="tutor_phone"
                                                label="Teléfono Tutor *"
                                                type="text"
                                                value={values.tutor_phone}
                                                placeholder="10 dígitos"
                                                inputProps={{ maxLength: 10 }}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                // disabled={values.id == 0 ? false : true}
                                                error={errors.tutor_phone && touched.tutor_phone}
                                                helperText={errors.tutor_phone && touched.tutor_phone && showErrorInput(1, errors.tutor_phone)}
                                             />
                                          </Grid>

                                          {isTutor && (
                                             <>
                                                <Grid xs={12}>
                                                   <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
                                                </Grid>
                                                <Grid xs={12} sx={{ mb: 3 }}>
                                                   <Typography variant="h4">Si no eres familiar directo favor de cargar los siguientes documentos...</Typography>
                                                </Grid>
                                                {/* IMAGEN DE INE */}
                                                <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                                   <InputFileComponent
                                                      idName="tutor_img_ine"
                                                      label="Foto INE del tutor"
                                                      filePreviews={imgIne}
                                                      setFilePreviews={setImgIne}
                                                      error={errors.tutor_img_ine}
                                                      touched={touched.tutor_img_ine}
                                                      multiple={false}
                                                      accept={"image/*"}
                                                   />
                                                </Grid>
                                                {/* IMAGEN DE INE */}
                                                <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                                   <InputFileComponent
                                                      idName="tutor_img_power_letter"
                                                      label="Foto Carta Poder del tutor"
                                                      filePreviews={imgPowerLetter}
                                                      setFilePreviews={setImgPowerLetter}
                                                      error={errors.tutor_img_power_letter}
                                                      touched={touched.tutor_img_power_letter}
                                                      multiple={false}
                                                      accept={"image/*"}
                                                   />
                                                </Grid>
                                             </>
                                          )}
                                       </Grid>
                                       <ButtonsBeforeOrNext isSubmitting={isSubmitting} />
                                    </Box>
                                 )}
                              </Formik>
                           )}
                           {activeStep + 1 == 2 && (
                              <Formik initialValues={formData} validationSchema={validationSchemas(activeStep + 1)} onSubmit={onSubmit2}>
                                 {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                                    <Box
                                       sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                                       component={"form"}
                                       onSubmit={handleSubmit}
                                       onBlur={onBlurCapture}
                                    >
                                       <Grid container spacing={2}>
                                          {/* CURP */}
                                          <Grid xs={12} md={4} sx={{ mb: 3 }}>
                                             <TextField
                                                id="curp"
                                                name="curp"
                                                label="CURP *"
                                                FormHelperTextProps={{ itemScope: <IconInfoCircle /> }}
                                                type="text"
                                                value={values.curp}
                                                placeholder="Ingresa tu CURP"
                                                onChange={(e) => {
                                                   handleChange(e);
                                                   handleChangeCURP(e, values, setValues, setFieldValue);
                                                }}
                                                onBlur={handleBlur}
                                                inputProps={{ maxLength: 18 }}
                                                fullWidth
                                                onInput={(e) => handleInputFormik(e, setFieldValue, "curp", true)}
                                                disabled={values.id == 0 ? false : true}
                                                inputRef={inputRefCurp}
                                                error={errors.curp && touched.curp}
                                                helperText={errors.curp && touched.curp && showErrorInput(2, errors.curp)}
                                             />
                                          </Grid>
                                          {/* Nombre del Alumno */}
                                          <Grid xs={12} md={8} sx={{ mb: 3 }}>
                                             <TextField
                                                id="name"
                                                name="name"
                                                label="Nombre del Alumno *"
                                                type="text"
                                                value={values.name}
                                                placeholder="Juan Manuel"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                onInput={(e) => handleInputFormik(e, setFieldValue, "name", true)}
                                                disabled={values.id == 0 ? false : true}
                                                error={errors.name && touched.name}
                                                helperText={errors.name && touched.name && showErrorInput(2, errors.name)}
                                             />
                                          </Grid>
                                          {/* Apellido Paterno del Alumno */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <TextField
                                                id="paternal_last_name"
                                                name="paternal_last_name"
                                                label="Apellido Paterno *"
                                                type="text"
                                                value={values.paternal_last_name}
                                                placeholder="Perez"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                onInput={(e) => handleInputFormik(e, setFieldValue, "paternal_last_name", true)}
                                                disabled={values.id == 0 ? false : true}
                                                error={errors.paternal_last_name && touched.paternal_last_name}
                                                helperText={errors.paternal_last_name && touched.paternal_last_name && showErrorInput(2, errors.paternal_last_name)}
                                             />
                                          </Grid>
                                          {/* Apellido Materno del Alumno */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <TextField
                                                id="maternal_last_name"
                                                name="maternal_last_name"
                                                label="Apellido Materno *"
                                                type="text"
                                                value={values.maternal_last_name}
                                                placeholder="López"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                onInput={(e) => handleInputFormik(e, setFieldValue, "maternal_last_name", true)}
                                                disabled={values.id == 0 ? false : true}
                                                error={errors.maternal_last_name && touched.maternal_last_name}
                                                helperText={errors.maternal_last_name && touched.maternal_last_name && showErrorInput(2, errors.maternal_last_name)}
                                             />
                                          </Grid>
                                          {/* Fecha de Nacimiento */}
                                          <Grid xs={12} md={4} sx={{ mb: 3 }}>
                                             <DatePickerComponent
                                                idName={"birthdate"}
                                                label={"Fecha de Nacimiento"}
                                                value={values.birthdate}
                                                setFieldValue={setFieldValue}
                                                showErrorInput={showErrorInput}
                                                error={errors.birthdate}
                                                touched={touched.birthdate}
                                                formData={formData}
                                             />
                                          </Grid>
                                          {/* Genero */}
                                          <Grid xs={12} md={4} sx={{ mb: 1 }}>
                                             <FormControl fullWidth sx={{ alignItems: "center" }}>
                                                <FormLabel id="gender-label">Género</FormLabel>
                                                <RadioGroup
                                                   row
                                                   aria-labelledby="gender-label"
                                                   id="gender"
                                                   name="gender"
                                                   value={values.gender}
                                                   onChange={handleChange}
                                                   onBlur={handleBlur}
                                                >
                                                   <FormControlLabel value="MASCULINO" control={<Radio />} label="Masculino" />
                                                   <FormControlLabel value="FEMENINO" control={<Radio />} label="Femenino" />
                                                </RadioGroup>
                                                {touched.gender && errors.gender && showErrorInput(2, errors.gender, true)}
                                             </FormControl>
                                          </Grid>
                                          {/* Discapacidad */}
                                          <Grid xs={12} md={4} sx={{ mb: 1 }}>
                                             <Select2Component
                                                idName={"disability_id"}
                                                label={"Discapacidad *"}
                                                valueLabel={values.disability}
                                                values={values}
                                                formData={formData}
                                                setFormData={setFormData}
                                                formDataLabel={"disability"}
                                                placeholder={"¿Tienes alguna discapacaidad?"}
                                                options={disabilities}
                                                fullWidth={true}
                                                handleChange={handleChange}
                                                setValues={setValues}
                                                handleBlur={handleBlur}
                                                error={errors.disability_id}
                                                touched={touched.disability_id}
                                                disabled={false}
                                             />
                                          </Grid>

                                          <Grid xs={12}>
                                             <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
                                          </Grid>

                                          {/* INPUTS DE COMUNIDAD */}
                                          <InputsCommunityComponent
                                             formData={formData}
                                             setFormData={setFormData}
                                             values={values}
                                             setFieldValue={setFieldValue}
                                             setValues={setValues}
                                             handleChange={handleChange}
                                             handleBlur={handleBlur}
                                             errors={errors}
                                             touched={touched}
                                             columnsByTextField={3}
                                          />

                                          {/* <LoadingButton
                                    type="submit"
                                    disabled={isSubmitting}
                                    loading={isSubmitting}
                                    // loadingPosition="start"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                 >
                                    Registrar o Guardar
                                 </LoadingButton> */}
                                       </Grid>
                                       <ButtonsBeforeOrNext isSubmitting={isSubmitting} />
                                    </Box>
                                 )}
                              </Formik>
                           )}
                           {activeStep + 1 == 3 && (
                              <Formik initialValues={formData} validationSchema={validationSchemas(activeStep + 1)} onSubmit={onSubmit3}>
                                 {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                                    <Box
                                       sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                                       component={"form"}
                                       onSubmit={handleSubmit}
                                    >
                                       <Grid container spacing={2}>
                                          {/* Escuela */}
                                          <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                             <Select2Component
                                                idName={"school_id"}
                                                label={"Escuela *"}
                                                valueLabel={values.school}
                                                values={values}
                                                formData={formData}
                                                setFormData={setFormData}
                                                formDataLabel={"school"}
                                                placeholder={"Selecciona una opción..."}
                                                options={schools}
                                                fullWidth={true}
                                                handleChange={handleChange}
                                                setValues={setValues}
                                                handleBlur={handleBlur}
                                                error={errors.school_id}
                                                touched={touched.school_id}
                                                disabled={false}
                                                // inputref={inputRefSchoolId}
                                             />
                                          </Grid>
                                          {/* Grado */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <TextField
                                                id="grade"
                                                name="grade"
                                                label="Grado de Estudio (año)*"
                                                type="number"
                                                value={values.grade}
                                                placeholder="3"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                inputProps={{ maxLength: 1, min: 1, max: 6 }}
                                                disabled={values.id == 0 ? false : true}
                                                error={errors.grade && touched.grade}
                                                helperText={errors.grade && touched.grade && showErrorInput(3, errors.grade)}
                                             />
                                          </Grid>
                                          {/* Promedio */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <TextField
                                                id="average"
                                                name="average"
                                                label="Promedio *"
                                                type="number"
                                                value={values.average}
                                                placeholder="10.00"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                inputProps={{ step: 0.01, min: 0, max: 100 }}
                                                disabled={values.id == 0 ? false : true}
                                                error={errors.average && touched.average}
                                                helperText={errors.average && touched.average && showErrorInput(3, errors.average)}
                                             />
                                          </Grid>
                                          {/* Comentarios */}
                                          <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                             <TextField
                                                id="comments"
                                                name="comments"
                                                label="Comentarios (opcional)"
                                                type="text"
                                                value={values.comments}
                                                placeholder="¿Deseas dejar algún comentario o mensaje?"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                multiline
                                                rows={5}
                                                inputProps={{}}
                                                disabled={values.id == 0 ? false : true}
                                                error={errors.comments && touched.comments}
                                                helperText={errors.comments && touched.comments && showErrorInput(3, errors.comments)}
                                             />
                                          </Grid>
                                       </Grid>
                                       <ButtonsBeforeOrNext isSubmitting={isSubmitting} />
                                    </Box>
                                 )}
                              </Formik>
                           )}
                           {activeStep + 1 == 4 && (
                              <Formik initialValues={formData} validationSchema={validationSchemas(activeStep + 1)} onSubmit={onSubmit4}>
                                 {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                                    <Box
                                       sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                                       component={"form"}
                                       onSubmit={handleSubmit}
                                    >
                                       <Grid container spacing={2}>
                                          {/* LISTADO */}
                                          <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                             <Typography variant="h2" mb={2}>
                                                ¿Quienes viven actualmente con el alumno?
                                             </Typography>
                                             <FamilyDT becaId={formData.id} monthlyIncomeChange={() => monthlyIncomeChange(values, setValues)} />
                                          </Grid>

                                          {/* Ingresos Extra */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <TextField
                                                id="extra_income"
                                                name="extra_income"
                                                label="Ingresos Extra *"
                                                type="number"
                                                value={values.extra_income}
                                                placeholder="1,500.00"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                inputProps={{ step: 0.01, min: 0, max: 100000 }}
                                                disabled={values.id == 0 ? false : true}
                                                error={errors.extra_income && touched.extra_income}
                                                helperText={errors.extra_income && touched.extra_income && showErrorInput(4, errors.extra_income)}
                                             />
                                          </Grid>
                                          {/* Ingreso Mensuales Totales */}
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             <TextField
                                                id="monthly_income"
                                                name="monthly_income"
                                                label="Ingresos Mensuales TOTALES *"
                                                type="number"
                                                value={values.monthly_income}
                                                placeholder="9,999.00"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                inputProps={{ step: 0.01, min: 0, max: 100000 }}
                                                disabled={values.id == 0 ? false : true}
                                                error={errors.monthly_income && touched.monthly_income}
                                                helperText={errors.monthly_income && touched.monthly_income && showErrorInput(4, errors.monthly_income)}
                                             />
                                          </Grid>
                                       </Grid>

                                       <ButtonsBeforeOrNext isSubmitting={isSubmitting} />
                                    </Box>
                                 )}
                              </Formik>
                           )}
                           {activeStep + 1 == 5 && (
                              <Formik initialValues={formData} validationSchema={{}} onSubmit={{}}>
                                 {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                                    <Box
                                       sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                                       component={"form"}
                                       onSubmit={handleSubmit}
                                    >
                                       <Grid container spacing={2}>
                                          <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                             <Typography variant="h4" component={"p"} mb={1}>
                                                Persona(s) que sostiene el hogar (Padre, Madre, Abuelo)
                                             </Typography>
                                             <Typography variant="h4" component="p">
                                                Detalle de gastos <span style={{ fontWeight: "bolder", textDecorationLine: "underline" }}>MENSUALES Familiares:</span>
                                             </Typography>
                                          </Grid>

                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             {/* Alimentación */}
                                             <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                                <InputComponentv2
                                                   idName="food"
                                                   label="Alimentación (despensa) * $"
                                                   type="number"
                                                   value={values.food}
                                                   placeholder="Ingrese el gasto mensual de alimentos"
                                                   setFieldValue={setFieldValue}
                                                   onChange={handleChange}
                                                   onBlur={handleBlur}
                                                   inputProps={{ step: 0.01, min: 0, max: 100000 }}
                                                   disabled={values.id == 0 ? false : true}
                                                   error={errors.food}
                                                   touched={touched.food}
                                                   showErrorInput={showErrorInput}
                                                   step={4}
                                                   size="normal"
                                                   // error={errors.food && touched.food}
                                                   // helperText={errors.food && touched.food && showErrorInput(4, errors.food)}
                                                />
                                             </Grid>
                                             {/* Transporte */}
                                             <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                                <InputComponentv2
                                                   idName="transport"
                                                   label="Transporte * $"
                                                   type="number"
                                                   value={values.transport}
                                                   placeholder="Ingrese el gasto mensual de transporte"
                                                   setFieldValue={setFieldValue}
                                                   onChange={handleChange}
                                                   onBlur={handleBlur}
                                                   inputProps={{ step: 0.01, min: 0, max: 100000 }}
                                                   disabled={values.id == 0 ? false : true}
                                                   error={errors.transport}
                                                   touched={touched.transport}
                                                   showErrorInput={showErrorInput}
                                                   step={4}
                                                   size="normal"
                                                   // error={errors.transport && touched.transport}
                                                   // helperText={errors.transport && touched.transport && showErrorInput(4, errors.transport)}
                                                />
                                             </Grid>
                                             {/* Vivienda */}
                                             <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                                <InputComponentv2
                                                   idName="living_place"
                                                   label="Vivienda (renta, infonavit) * $"
                                                   type="number"
                                                   value={values.living_place}
                                                   placeholder="Ingrese el gasto mensual en pago de vivienda"
                                                   setFieldValue={setFieldValue}
                                                   onChange={handleChange}
                                                   onBlur={handleBlur}
                                                   inputProps={{ step: 0.01, min: 0, max: 100000 }}
                                                   disabled={values.id == 0 ? false : true}
                                                   error={errors.living_place}
                                                   touched={touched.living_place}
                                                   showErrorInput={showErrorInput}
                                                   step={4}
                                                   size="normal"
                                                   // error={errors.living_place && touched.living_place}
                                                   // helperText={errors.living_place && touched.living_place && showErrorInput(4, errors.living_place)}
                                                />
                                             </Grid>
                                          </Grid>
                                          <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                             {/* Servicios */}
                                             <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                                <InputComponentv2
                                                   idName="services"
                                                   label="Servicios (agua y luz) * $"
                                                   type="number"
                                                   value={values.services}
                                                   placeholder="Ingrese el gasto mensual de alimentos"
                                                   setFieldValue={setFieldValue}
                                                   onChange={handleChange}
                                                   onBlur={handleBlur}
                                                   inputProps={{ step: 0.01, min: 0, max: 100000 }}
                                                   disabled={values.id == 0 ? false : true}
                                                   error={errors.services}
                                                   touched={touched.services}
                                                   showErrorInput={showErrorInput}
                                                   step={4}
                                                   size="normal"
                                                   // error={errors.services && touched.services}
                                                   // helperText={errors.services && touched.services && showErrorInput(4, errors.services)}
                                                />
                                             </Grid>
                                             {/* Automovil */}
                                             <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                                <InputComponentv2
                                                   id="automobile"
                                                   name="automobile"
                                                   label="Automóvil * $"
                                                   type="number"
                                                   value={values.automobile}
                                                   placeholder="Ingrese el gasto mensual en su automóvi"
                                                   setFieldValue={setFieldValue}
                                                   onChange={handleChange}
                                                   onBlur={handleBlur}
                                                   fullWidth
                                                   inputProps={{ step: 0.01, min: 0, max: 100000 }}
                                                   disabled={values.id == 0 ? false : true}
                                                   error={errors.automobile}
                                                   touched={touched.automobile}
                                                   showErrorInput={showErrorInput}
                                                   step={4}
                                                   size="normal"
                                                   // error={errors.automobile && touched.automobile}
                                                   // helperText={errors.automobile && touched.automobile && showErrorInput(4, errors.automobile)}
                                                />
                                             </Grid>
                                             {/* Gastos Extras */}
                                             <Grid xs={12} md={12} sx={{ mb: 3 }}></Grid>
                                          </Grid>

                                          {/* Egresos Mensuales Totales */}
                                          <Grid xs={12} xsOffset={6} md={6} sx={{ mb: 3 }}>
                                             <InputComponentv2
                                                idName={"total_expenses"}
                                                label={"TOTAL DE EGRESOS $"}
                                                type="number"
                                                value={values.total_expenses}
                                                placeholder={"0.00"}
                                                setFieldValue={setFieldValue}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={errors.total_expenses}
                                                touched={touched.total_expenses}
                                                disabled={true}
                                                showErrorInput={showErrorInput}
                                                step={4}
                                                size="normal"
                                                inputProps={{ step: 0.01, min: 0, max: 100000 }}
                                             />
                                             {/* <TextField
                                          id="total_expenses"
                                          name="total_expenses"
                                          label="TOTAL DE EGRESOS *"
                                          type="number"
                                          value={values.total_expenses}
                                          placeholder="00.00"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          fullWidth
                                          inputProps={{ step: 0.01, min: 0, max: 100000 }}
                                          disabled={true}
                                          error={errors.total_expenses && touched.total_expenses}
                                          helperText={errors.total_expenses && touched.total_expenses && showErrorInput(4, errors.total_expenses)}
                                       /> */}
                                          </Grid>
                                       </Grid>

                                       <ButtonsBeforeOrNext isSubmitting={isSubmitting} />
                                    </Box>
                                 )}
                              </Formik>
                           )}
                           {activeStep + 1 == 6 && (
                              <Formik initialValues={formData} validationSchema={{}} onSubmit={{}}>
                                 {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                                    <Box
                                       sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                                       component={"form"}
                                       onSubmit={handleSubmit}
                                    >
                                       <Grid container spacing={2}>
                                          <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                             <ol>
                                                {/* La casa es */}
                                                <FormControl fullWidth sx={{ mb: 5 }}>
                                                   <FormLabel id="house_is-label">
                                                      <Typography variant="h4" component={"p"} mb={1}>
                                                         <li>La casa donde vives es:</li>
                                                      </Typography>
                                                   </FormLabel>
                                                   {/* <ToggleButtonGroup color="primary" value={houseIs} exclusive onClick={handleHouseIs}>
                                                <ToggleButton value="1@Propia">Propia</ToggleButton>
                                                <ToggleButton value="2@Prestada">Prestada</ToggleButton>
                                                <ToggleButton value="3@Alquilada">Alquilada</ToggleButton>
                                                <ToggleButton value="4@Otra">Otra</ToggleButton>
                                             </ToggleButtonGroup> */}
                                                   <RadioGroup
                                                      row
                                                      aria-labelledby="house_is-label"
                                                      id="house_is"
                                                      name="house_is"
                                                      value={values.house_is}
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                   >
                                                      <FormControlLabel sx={{ mr: 5 }} value="1@Propia" control={<Radio />} label="Propia" />
                                                      <FormControlLabel sx={{ mr: 5 }} value="2@Prestada" control={<Radio />} label="Prestada" />
                                                      <FormControlLabel sx={{ mr: 5 }} value="3@Alquilada" control={<Radio />} label="Alquilada" />
                                                      <FormControlLabel sx={{ mr: 5 }} value="4@Otra" control={<Radio />} label="Otra" />
                                                   </RadioGroup>
                                                   {touched.house_is && errors.house_is && (
                                                      <FormHelperText error id="ht-house_is">
                                                         {errors.house_is}
                                                      </FormHelperText>
                                                   )}
                                                </FormControl>
                                                {/* Material del techo */}
                                                <FormControl fullWidth sx={{ mb: 5 }}>
                                                   <FormLabel id="roof_material-label">
                                                      <Typography variant="h4" component={"p"} mb={1}>
                                                         <li>Material del techo de la vivienda (si está hecho de más de un matgerial, marca el que predomine):</li>
                                                      </Typography>
                                                   </FormLabel>
                                                   {/* <ToggleButtonGroup color="primary" value={houseIs} exclusive onClick={handleHouseIs}>
                                                <ToggleButton value="1@Lamina">Lamina (de cartón, de asbesto, madera)</ToggleButton>
                                                <ToggleButton value="2@Concreto">Firme de concreto</ToggleButton>
                                             </ToggleButtonGroup> */}
                                                   <RadioGroup
                                                      row
                                                      aria-labelledby="roof_material-label"
                                                      id="roof_material"
                                                      name="roof_material"
                                                      value={values.roof_material}
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                   >
                                                      <FormControlLabel
                                                         sx={{ mr: 5 }}
                                                         value="1@Lamina"
                                                         control={<Radio />}
                                                         label="Lamina (de cartón, de asbesto, madera)"
                                                      />
                                                      <FormControlLabel sx={{ mr: 5 }} value="2@Concreto" control={<Radio />} label="Firme de concreto" />
                                                   </RadioGroup>
                                                   {touched.roof_material && errors.roof_material && (
                                                      <FormHelperText error id="ht-roof_material">
                                                         {errors.roof_material}
                                                      </FormHelperText>
                                                   )}
                                                </FormControl>
                                                {/* Material del techo */}
                                                <FormControl fullWidth sx={{ mb: 5 }}>
                                                   <FormLabel id="roof_material-label">
                                                      <Typography variant="h4" component={"p"} mb={1}>
                                                         <li>Material del piso de la vivienda (si está hecho de más de un matgerial, marca el que predomine):</li>
                                                      </Typography>
                                                   </FormLabel>
                                                   {/* <ToggleButtonGroup color="primary" value={houseIs} exclusive onClick={handleHouseIs}>
                                                <ToggleButton value="1@Tierra">Tierra</ToggleButton>
                                                <ToggleButton value="2@Cemento">Cemento</ToggleButton>
                                                <ToggleButton value="3@Mosaico">Mosaico, loseta, madera laminada</ToggleButton>
                                             </ToggleButtonGroup> */}
                                                   <RadioGroup
                                                      row
                                                      aria-labelledby="roof_material-label"
                                                      id="roof_material"
                                                      name="roof_material"
                                                      value={values.roof_material}
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                   >
                                                      <FormControlLabel sx={{ mr: 5 }} value="1@Tierra" control={<Radio />} label="Tierra" />
                                                      <FormControlLabel sx={{ mr: 5 }} value="2@Cemento" control={<Radio />} label="Cemento" />
                                                      <FormControlLabel
                                                         sx={{ mr: 5 }}
                                                         value="2@Mosaico"
                                                         control={<Radio />}
                                                         label="Mosaico, loseta, madera laminada"
                                                      />
                                                   </RadioGroup>
                                                   {touched.roof_material && errors.roof_material && (
                                                      <FormHelperText error id="ht-roof_material">
                                                         {errors.roof_material}
                                                      </FormHelperText>
                                                   )}
                                                </FormControl>
                                             </ol>
                                          </Grid>
                                       </Grid>

                                       <ButtonsBeforeOrNext isSubmitting={isSubmitting} />
                                    </Box>
                                 )}
                              </Formik>
                           )}
                           {activeStep + 1 == 7 && (
                              <Formik initialValues={formData} validationSchema={{}} onSubmit={{}}>
                                 {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                                    <Box
                                       sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                                       component={"form"}
                                       onSubmit={handleSubmit}
                                    >
                                       <Grid container spacing={2}>
                                          <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                             <ol>
                                                {/* Equipamiento de la casa */}
                                                <FormControl fullWidth sx={{ mb: 3 }}>
                                                   <FormLabel id="household_equipment-label">
                                                      <Typography variant="h4" component={"p"} mb={1}>
                                                         <li>
                                                            Señala el número de los siguientes aparatos con que cuentas en casa (en caso de no tener, marca cero) 0 1 2
                                                            3 4+ :
                                                         </li>
                                                      </Typography>
                                                   </FormLabel>
                                                   {touched.household_equipment && errors.household_equipment && (
                                                      <FormHelperText error id="ht-household_equipment">
                                                         {errors.household_equipment}
                                                      </FormHelperText>
                                                   )}
                                                   <Grid container spacing={2}>
                                                      <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                         {/* Camas */}
                                                         <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                            <InputComponentv3
                                                               idName="beds"
                                                               label="Camas"
                                                               type="number"
                                                               value={values.beds}
                                                               placeholder="0"
                                                               setFieldValue={setFieldValue}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               inputProps={{ min: 0, max: 100000 }}
                                                               disabled={values.id == 0 ? false : true}
                                                               error={errors.beds}
                                                               touched={touched.beds}
                                                               showErrorInput={showErrorInput}
                                                               step={4}
                                                               size="normal"
                                                               // error={errors.beds && touched.beds}
                                                               // helperText={errors.beds && touched.beds && showErrorInput(4, errors.beds)}
                                                            />
                                                         </Grid>
                                                         {/* Lavadoras */}
                                                         <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                            <InputComponentv3
                                                               idName="washing_machines"
                                                               label="Lavadoras"
                                                               type="number"
                                                               value={values.washing_machines}
                                                               placeholder="0"
                                                               setFieldValue={setFieldValue}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               inputProps={{ min: 0, max: 100000 }}
                                                               disabled={values.id == 0 ? false : true}
                                                               error={errors.washing_machines}
                                                               touched={touched.washing_machines}
                                                               showErrorInput={showErrorInput}
                                                               step={4}
                                                               size="normal"
                                                            />
                                                         </Grid>
                                                         {/* Calentador de agua (boiler) */}
                                                         <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                            <InputComponentv3
                                                               idName="boilers"
                                                               label="Calentador de agua (boiler)"
                                                               type="number"
                                                               value={values.boilers}
                                                               placeholder="0"
                                                               setFieldValue={setFieldValue}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               inputProps={{ min: 0, max: 100000 }}
                                                               disabled={values.id == 0 ? false : true}
                                                               error={errors.boilers}
                                                               touched={touched.boilers}
                                                               showErrorInput={showErrorInput}
                                                               step={4}
                                                               size="normal"
                                                            />
                                                         </Grid>
                                                         {/* Televisores */}
                                                         <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                            <InputComponentv3
                                                               idName="tvs"
                                                               label="Televisores"
                                                               type="number"
                                                               value={values.tvs}
                                                               placeholder="0"
                                                               setFieldValue={setFieldValue}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               inputProps={{ min: 0, max: 100000 }}
                                                               disabled={values.id == 0 ? false : true}
                                                               error={errors.tvs}
                                                               touched={touched.tvs}
                                                               showErrorInput={showErrorInput}
                                                               step={4}
                                                               size="normal"
                                                            />
                                                         </Grid>
                                                         {/* Computadoras */}
                                                         <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                            <InputComponentv3
                                                               idName="pcs"
                                                               label="Computadoras"
                                                               type="number"
                                                               value={values.pcs}
                                                               placeholder="0"
                                                               setFieldValue={setFieldValue}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               inputProps={{ min: 0, max: 100000 }}
                                                               disabled={values.id == 0 ? false : true}
                                                               error={errors.pcs}
                                                               touched={touched.pcs}
                                                               showErrorInput={showErrorInput}
                                                               step={4}
                                                               size="normal"
                                                            />
                                                         </Grid>
                                                      </Grid>
                                                      <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                         {/* Teléfonos (local o celular) */}
                                                         <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                            <InputComponentv3
                                                               idName="phones"
                                                               label="Teléfonos (local o celular)"
                                                               type="number"
                                                               value={values.phones}
                                                               placeholder="0"
                                                               setFieldValue={setFieldValue}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               inputProps={{ min: 0, max: 100000 }}
                                                               disabled={values.id == 0 ? false : true}
                                                               error={errors.phones}
                                                               touched={touched.phones}
                                                               showErrorInput={showErrorInput}
                                                               step={4}
                                                               size="normal"
                                                            />
                                                         </Grid>
                                                         {/* Reproductores de Música */}
                                                         <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                            <InputComponentv3
                                                               idName="music_player"
                                                               label="Reproductores de Música"
                                                               type="number"
                                                               value={values.music_player}
                                                               placeholder="0"
                                                               setFieldValue={setFieldValue}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               inputProps={{ min: 0, max: 100000 }}
                                                               disabled={values.id == 0 ? false : true}
                                                               error={errors.music_player}
                                                               touched={touched.music_player}
                                                               showErrorInput={showErrorInput}
                                                               step={4}
                                                               size="normal"
                                                            />
                                                         </Grid>
                                                         {/* Estufas */}
                                                         <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                            <InputComponentv3
                                                               idName="stoves"
                                                               label="Estufas"
                                                               type="number"
                                                               value={values.stoves}
                                                               placeholder="0"
                                                               setFieldValue={setFieldValue}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               inputProps={{ min: 0, max: 100000 }}
                                                               disabled={values.id == 0 ? false : true}
                                                               error={errors.stoves}
                                                               touched={touched.stoves}
                                                               showErrorInput={showErrorInput}
                                                               step={4}
                                                               size="normal"
                                                            />
                                                         </Grid>
                                                         {/* Refrigeradores */}
                                                         <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                            <InputComponentv3
                                                               idName="refrigerators"
                                                               label="Refrigeradores"
                                                               type="number"
                                                               value={values.refrigerators}
                                                               placeholder="0"
                                                               setFieldValue={setFieldValue}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               inputProps={{ min: 0, max: 100000 }}
                                                               disabled={values.id == 0 ? false : true}
                                                               error={errors.refrigerators}
                                                               touched={touched.refrigerators}
                                                               showErrorInput={showErrorInput}
                                                               step={4}
                                                               size="normal"
                                                            />
                                                         </Grid>
                                                      </Grid>
                                                   </Grid>
                                                </FormControl>

                                                {/* Equipamiento de la casa */}
                                                <FormControl fullWidth sx={{ mb: 3 }}>
                                                   <FormLabel id="household_equipment-label">
                                                      <Typography variant="h4" component={"p"} mb={1}>
                                                         <li>¿Cuáles son los servicios con que cuentas en tu casa?</li>
                                                      </Typography>
                                                   </FormLabel>
                                                   {touched.household_equipment && errors.household_equipment && (
                                                      <FormHelperText error id="ht-household_equipment">
                                                         {errors.household_equipment}
                                                      </FormHelperText>
                                                   )}
                                                   <Grid container spacing={2}>
                                                      <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                         <FormGroup>
                                                            {/* Agua Potable */}
                                                            <FormControlLabel
                                                               control={<Checkbox defaultChecked={values.drinking_water} />}
                                                               label="Agua Potable"
                                                               id="drinking_water"
                                                               name="drinking_water"
                                                               value={2}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               disabled={values.id == 0 ? false : true}
                                                               error={errors.drinking_water}
                                                               touched={touched.drinking_water}
                                                            />
                                                            {
                                                               touched.drinking_water && errors.drinking_water && showErrorInput(4, errors.drinking_water)
                                                               // <FormHelperText error id="ht-drinking_water">
                                                               //    {errors.drinking_water}
                                                               // </FormHelperText>
                                                            }
                                                            {/* Luz Eléctrica */}
                                                            <FormControlLabel
                                                               control={<Checkbox defaultChecked={values.electric_light} />}
                                                               label="Luz Eléctrica"
                                                               id="electric_light"
                                                               name="electric_light"
                                                               value={2}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               disabled={values.id == 0 ? false : true}
                                                               error={errors.electric_light}
                                                               touched={touched.electric_light}
                                                            />
                                                            {
                                                               touched.electric_light && errors.electric_light && showErrorInput(4, errors.electric_light)
                                                               // <FormHelperText error id="ht-electric_light">
                                                               //    {errors.electric_light}
                                                               // </FormHelperText>
                                                            }
                                                            {/* Drenaje */}
                                                            <FormControlLabel
                                                               control={<Checkbox defaultChecked={values.sewer_system} />}
                                                               label="Drenaje"
                                                               id="sewer_system"
                                                               name="sewer_system"
                                                               value={2}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               disabled={values.id == 0 ? false : true}
                                                               error={errors.sewer_system}
                                                               touched={touched.sewer_system}
                                                            />
                                                            {
                                                               touched.sewer_system && errors.sewer_system && showErrorInput(4, errors.sewer_system)
                                                               // <FormHelperText error id="ht-sewer_system">
                                                               //    {errors.sewer_system}
                                                               // </FormHelperText>
                                                            }
                                                            {/* Pavimento */}
                                                            <FormControlLabel
                                                               control={<Checkbox defaultChecked={values.pavement} />}
                                                               label="Pavimento"
                                                               id="pavement"
                                                               name="pavement"
                                                               value={2}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               disabled={values.id == 0 ? false : true}
                                                               error={errors.pavement}
                                                               touched={touched.pavement}
                                                            />
                                                            {
                                                               touched.pavement && errors.pavement && showErrorInput(4, errors.pavement)
                                                               // <FormHelperText error id="ht-pavement">
                                                               //    {errors.pavement}
                                                               // </FormHelperText>
                                                            }
                                                         </FormGroup>
                                                      </Grid>
                                                      <Grid xs={12} md={6} sx={{ mb: 1 }}>
                                                         <FormGroup>
                                                            {/* Automóvil */}
                                                            <FormControlLabel
                                                               control={<Checkbox defaultChecked={values.automobile} />}
                                                               label="Automóvil"
                                                               id="automobile"
                                                               name="automobile"
                                                               value={2}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               disabled={values.id == 0 ? false : true}
                                                               error={errors.automobile}
                                                               touched={touched.automobile}
                                                            />
                                                            {
                                                               touched.automobile && errors.automobile && showErrorInput(4, errors.automobile)
                                                               // <FormHelperText error id="ht-automobile">
                                                               //    {errors.automobile}
                                                               // </FormHelperText>
                                                            }
                                                            {/* Línea Telefónica */}
                                                            <FormControlLabel
                                                               control={<Checkbox defaultChecked={values.phone_line} />}
                                                               label="Línea Telefónica"
                                                               id="phone_line"
                                                               name="phone_line"
                                                               value={2}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               disabled={values.id == 0 ? false : true}
                                                               error={errors.phone_line}
                                                               touched={touched.phone_line}
                                                            />
                                                            {
                                                               touched.phone_line && errors.phone_line && showErrorInput(4, errors.phone_line)
                                                               // <FormHelperText error id="ht-phone_line">
                                                               //    {errors.phone_line}
                                                               // </FormHelperText>
                                                            }
                                                            {/* Internet */}
                                                            <FormControlLabel
                                                               control={<Checkbox defaultChecked={values.internet} />}
                                                               label="Internet"
                                                               id="internet"
                                                               name="internet"
                                                               value={2}
                                                               onChange={handleChange}
                                                               onBlur={handleBlur}
                                                               disabled={values.id == 0 ? false : true}
                                                               error={errors.internet}
                                                               touched={touched.internet}
                                                            />
                                                            {
                                                               touched.internet && errors.internet && showErrorInput(4, errors.internet)
                                                               // <FormHelperText error id="ht-internet">
                                                               //    {errors.internet}
                                                               // </FormHelperText>
                                                            }
                                                         </FormGroup>
                                                      </Grid>
                                                   </Grid>
                                                </FormControl>
                                             </ol>
                                          </Grid>
                                       </Grid>

                                       <ButtonsBeforeOrNext isSubmitting={isSubmitting} />
                                    </Box>
                                 )}
                              </Formik>
                           )}
                           {activeStep + 1 == 8 && (
                              <Formik initialValues={formData} validationSchema={{}} onSubmit={{}}>
                                 {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                                    <Box
                                       sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                                       component={"form"}
                                       onSubmit={handleSubmit}
                                    >
                                       <Grid container spacing={2}>
                                          <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                             <ol>
                                                {/* Programa de Becas */}
                                                <FormControl fullWidth sx={{ mb: 3 }}>
                                                   <FormLabel id="scholarship_program-label">
                                                      <Typography variant="h4" component={"p"} mb={1}>
                                                         <li>¿Tu familia es beneficiaria de algunas de las siguientes becas?</li>
                                                      </Typography>
                                                   </FormLabel>
                                                   {touched.scholarship_program && errors.scholarship_program && (
                                                      <FormHelperText error id="ht-scholarship_program">
                                                         {errors.scholarship_program}
                                                      </FormHelperText>
                                                   )}
                                                   <Grid xs={12} md={12} sx={{ mb: 1 }}>
                                                      <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
                                                         {/* Beca de Transporte */}
                                                         <FormControlLabel
                                                            control={<Checkbox defaultChecked={values.beca_transport} />}
                                                            label="Beca de Transporte"
                                                            id="beca_transport"
                                                            name="beca_transport"
                                                            value={2}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            disabled={values.id == 0 ? false : true}
                                                            error={errors.beca_transport}
                                                            touched={touched.beca_transport}
                                                            sx={{ mr: 10 }}
                                                         />
                                                         {
                                                            touched.beca_transport && errors.beca_transport && showErrorInput(4, errors.beca_transport)
                                                            // <FormHelperText error id="ht-beca_transport">
                                                            //    {errors.beca_transport}
                                                            // </FormHelperText>
                                                         }
                                                         {/* Beca para el Bienestar Benito Juárez */}
                                                         <FormControlLabel
                                                            control={<Checkbox defaultChecked={values.beca_benito_juarez} />}
                                                            label="Beca para el Bienestar Benito Juárez"
                                                            id="beca_benito_juarez"
                                                            name="beca_benito_juarez"
                                                            value={2}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            disabled={values.id == 0 ? false : true}
                                                            error={errors.beca_benito_juarez}
                                                            touched={touched.beca_benito_juarez}
                                                            sx={{ mr: 10 }}
                                                         />
                                                         {
                                                            touched.beca_benito_juarez && errors.beca_benito_juarez && showErrorInput(4, errors.beca_benito_juarez)
                                                            // <FormHelperText error id="ht-beca_benito_juarez">
                                                            //    {errors.beca_benito_juarez}
                                                            // </FormHelperText>
                                                         }
                                                         {/* Otra */}
                                                         <FormControlLabel
                                                            control={<Checkbox defaultChecked={values.other} />}
                                                            label="Otra"
                                                            id="other"
                                                            name="other"
                                                            value={2}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            disabled={values.id == 0 ? false : true}
                                                            error={errors.other}
                                                            touched={touched.other}
                                                            sx={{ mr: 10 }}
                                                         />
                                                         {
                                                            touched.other && errors.other && showErrorInput(4, errors.other)
                                                            // <FormHelperText error id="ht-other">
                                                            //    {errors.other}
                                                            // </FormHelperText>
                                                         }
                                                         {/* Beca Jóvenes Construyendo el Futuro */}
                                                         <FormControlLabel
                                                            control={<Checkbox defaultChecked={values.beca_jovenes} />}
                                                            label="Beca Jóvenes Construyendo el Futuro"
                                                            id="beca_jovenes"
                                                            name="beca_jovenes"
                                                            value={2}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            disabled={values.id == 0 ? false : true}
                                                            error={errors.beca_jovenes}
                                                            touched={touched.beca_jovenes}
                                                         />
                                                         {
                                                            touched.beca_jovenes && errors.beca_jovenes && showErrorInput(4, errors.beca_jovenes)
                                                            // <FormHelperText error id="ht-beca_jovenes">
                                                            //    {errors.beca_jovenes}
                                                            // </FormHelperText>
                                                         }
                                                      </FormGroup>
                                                   </Grid>
                                                </FormControl>
                                             </ol>
                                          </Grid>
                                       </Grid>

                                       <ButtonsBeforeOrNext isSubmitting={isSubmitting} />
                                    </Box>
                                 )}
                              </Formik>
                           )}
                        </Box>
                     </Fragment>
                  )}
               </Box>
            </>
         )}
      </Box>
   );
};

export default RequestBecaView;
