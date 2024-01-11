import { Fragment, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import {
   Button,
   ButtonGroup,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogTitle,
   FormControlLabel,
   IconButton,
   Switch,
   Toolbar,
   Tooltip,
   Typography
} from "@mui/material";
import IconEdit from "../../../components/icons/IconEdit";
import IconDelete from "../../../components/icons/IconDelete";
import { IconX, IconWindowMaximize, IconWindowMinimize, IconFileTypePdf } from "@tabler/icons-react";

import { useRequestBecaContext } from "../../../context/RequestBecaContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import sAlert, { QuestionAlertConfig } from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { ROLE_ADMIN, ROLE_SUPER_ADMIN, useGlobalContext } from "../../../context/GlobalContext";
import DataTableComponent from "../../../components/DataTableComponent";
import { IconEye, IconPrinter } from "@tabler/icons";
import { formatDatetime } from "../../../utils/Formats";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { IconCircleXFilled } from "@tabler/icons-react";
import SwitchComponent from "../../../components/SwitchComponent";
import { object } from "prop-types";
import { Box } from "@mui/system";
import DialogComponent from "../../../components/DialogComponent";
import RequestReport from "./RequestReport";
import { getCommunityById } from "../../../components/Form/InputsCommunityComponent";
import { useFamilyContext } from "../../../context/FamilyContext";
// import { Preview, print } from "react-html2pdf";
import html2pdf from "html2pdf.js";
// import MyPDFComponent from "../../../utils/createPDF";
import { Page, Text, Document, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import RequestReportPDF from "./RequestReportPDF";
// import PuppeteerHTMLPDF from "puppeteer-html-pdf";
// import htmlPdfClient from "html-pdf-client";
// import puppeteer from "puppeteer";
// import htmlToPdf from "puppeteer-html-pdf";
// import PuppeteerHTMLPDF from "puppeteer-html-pdf";

const RequestBecaDT = () => {
   const { auth } = useAuthContext();
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const { singularName, pluralName, requestBecas, setRequestBecas, getRequestBecas, showRequestBeca, deleteRequestBeca, setTextBtnSumbit, setFormTitle } =
      useRequestBecaContext();
   const globalFilterFields = ["folio", "code", "level", "school", "curp", "name", "paternal_last_name", "maternal_last_name", "average", "status", "created_at"];
   const { getIndexByFolio } = useFamilyContext();

   const [openDialogPreview, setOpenDialogPreview] = useState(false);
   const [fullScreenDialog, setFullScreenDialog] = useState(false);
   const [objReport, setObjReport] = useState(null);

   const [downloadOptions, setDownloadOptions] = useState({
      margin: 0.5,
      filename: "Solicitud de Beca.pdf",
      image: {
         type: "png",
         quality: 1,
         width: 300
      },
      enableLinks: true,
      html2canvas: { scale: 3, useCORS: true },
      jsPDF: {
         unit: "cm",
         format: "letter",
         orientation: "portrait",
         scrollY: 0
      }
   });
   let MyDocument;

   const downloadPDF = async (elementID) => {
      const element = document.getElementById(elementID);
      const htmlContent = element.innerHTML;
      const title = "Solicitud de Beca";

      // const htmlPDF = new PuppeteerHTMLPDF();
      // const options = {
      //    format: "A4",
      //    path: `${__dirname}/sample.pdf` // you can pass path to save the file
      // };
      // htmlPDF.setOptions(options);

      // const content = "<style> h1 {color:red;} </style> <h1>Welcome to puppeteer-html-pdf</h1>";

      // try {
      //    await htmlPDF.create(content);
      // } catch (error) {
      //    console.log("PuppeteerHTMLPDF error", error);
      // }
      // -------------------------------------------------------
      // const browser = await puppeteer.launch();
      // const page = await browser.newPage();

      // await page.setContent(htmlContent);

      // // Configuración opcional, como el formato de la página, el margen, etc.
      // const pdfOptions = {
      //    format: "A4",
      //    margin: {
      //       top: "20px",
      //       bottom: "20px",
      //       left: "20px",
      //       right: "20px"
      //    }
      // };

      // // Generar PDF
      // const pdfBuffer = await PuppeteerHTMLPDF().from(page).set(pdfOptions).outputPdf();

      // // Puedes guardar el PDF o realizar otras acciones con el buffer
      // // Por ejemplo, puedes abrir una nueva ventana con el PDF:
      // const pdfBlob = new Blob([pdfBuffer], { type: "application/pdf" });
      // const pdfUrl = URL.createObjectURL(pdfBlob);
      // window.open(pdfUrl);

      // await browser.close();
      // ------------------------------------------

      setDownloadOptions({
         ...downloadOptions,
         filename: title
      });

      html2pdf().from(htmlContent).set(downloadOptions).save();
      // -------------------------------------------------

      // const worker = htmlPdfClient.from(element).save();
      // const pdfOptions = {
      //    margin: 10,
      //    filename: "documento.pdf",
      //    image: { type: "jpeg", quality: 1 },
      //    html2canvas: { scale: 3 },
      //    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      // };
      // var options = {
      //    orientation: "landscape",
      //    border: {
      //       top: "5mm", // default is 0, units: mm, cm, in, px
      //       right: "0mm",
      //       bottom: "10mm",
      //       left: "0mm"
      //    },
      //    width: "297mm",
      //    height: "210mm",
      //    footer: {
      //       height: "5mm",
      //       contents: {
      //          1: "PÁGINA 1",
      //          2: "PÁGINA 2",
      //          3: "PÁGINA 3",
      //          4: "PÁGINA 4",
      //          5: "PÁGINA 5",
      //          6: "PÁGINA 6",
      //          7: "PÁGINA 7",
      //          8: "PÁGINA 8",
      //          9: "PÁGINA 9",
      //          10: "PÁGINA 10",
      //          11: "PÁGINA 11",
      //          12: "PÁGINA 12",
      //          13: "PÁGINA 13",
      //          14: "PÁGINA 14",
      //          15: "PÁGINA 15",
      //          16: "PÁGINA 16",
      //          17: "PÁGINA 17",
      //          18: "PÁGINA 18",
      //          19: "PÁGINA 19",
      //          20: "PÁGINA 20",
      //          21: "PÁGINA 21",
      //          22: "PÁGINA 22",
      //          23: "PÁGINA 23",
      //          24: "PÁGINA 24",
      //          25: "PÁGINA 25",
      //          26: "PÁGINA 26",
      //          27: "PÁGINA 27",
      //          28: "PÁGINA 28",
      //          29: "PÁGINA 29",
      //          30: "PÁGINA 30",
      //          31: "PÁGINA 31",
      //          32: "PÁGINA 32",
      //          33: "PÁGINA 33",
      //          34: "PÁGINA 34",
      //          35: "PÁGINA 35",
      //          36: "PÁGINA 36",
      //          37: "PÁGINA 37",
      //          38: "PÁGINA 38",
      //          39: "PÁGINA 39",
      //          40: "PÁGINA 40",
      //          41: "PÁGINA 41",
      //          42: "PÁGINA 42",
      //          43: "PÁGINA 43",
      //          44: "PÁGINA 44",
      //          45: "PÁGINA 45",
      //          46: "PÁGINA 46",
      //          47: "PÁGINA 47",
      //          48: "PÁGINA 48",
      //          49: "PÁGINA 49",
      //          50: "PÁGINA 50",
      //          51: "PÁGINA 51",
      //          52: "PÁGINA 52",
      //          53: "PÁGINA 53",
      //          54: "PÁGINA 54",
      //          55: "PÁGINA 55",
      //          56: "PÁGINA 56",
      //          57: "PÁGINA 57",
      //          58: "PÁGINA 58",
      //          59: "PÁGINA 59",
      //          60: "PÁGINA 60",
      //          61: "PÁGINA 61",
      //          62: "PÁGINA 62",
      //          63: "PÁGINA 63",
      //          64: "PÁGINA 64",
      //          65: "PÁGINA 65",
      //          66: "PÁGINA 66",
      //          67: "PÁGINA 67",
      //          68: "PÁGINA 68",
      //          69: "PÁGINA 69",
      //          70: "PÁGINA 70",
      //          71: "PÁGINA 71",
      //          72: "PÁGINA 72",
      //          73: "PÁGINA 73",
      //          74: "PÁGINA 74",
      //          75: "PÁGINA 75",
      //          76: "PÁGINA 76",
      //          77: "PÁGINA 77",
      //          78: "PÁGINA 78",
      //          79: "PÁGINA 79",
      //          80: "PÁGINA 80",
      //          81: "PÁGINA 81",
      //          82: "PÁGINA 82",
      //          83: "PÁGINA 83",
      //          84: "PÁGINA 84",
      //          85: "PÁGINA 85",
      //          86: "PÁGINA 86",
      //          87: "PÁGINA 87",
      //          88: "PÁGINA 88",
      //          89: "PÁGINA 89",
      //          90: "PÁGINA 90",
      //          91: "PÁGINA 91",
      //          92: "PÁGINA 92",
      //          93: "PÁGINA 93",
      //          94: "PÁGINA 94",
      //          95: "PÁGINA 95",
      //          96: "PÁGINA 96",
      //          97: "PÁGINA 97",
      //          98: "PÁGINA 98",
      //          99: "PÁGINA 99",
      //          100: "PÁGINA 100"
      //       }
      //    }
      // };
      // -------------------------------------------------
      // await htmlPdf.create(pdf, options).toFile(path.join(__dirname,'..','..','public','pdfs',names),async(err,result)=>{

      // const pdf = await htmlPdfClient().create(element).set()
      // .from(element).set(pdfOptions).outputPdf().save();

      // `pdf` now contains the generated PDF data. You can save it, display it, etc.
      // console.log(pdf);
   };

   //#region BODY TEMPLATES
   const FolioBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         <b>{obj.folio}</b>
      </Typography>
   );
   const SchoolBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         <b style={{ borderBottom: "1px solid" }}>{obj.code}</b> <br />
         <b>{obj.level}</b> - {obj.school}
      </Typography>
   );
   const StudentBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         <b style={{ borderBottom: "1px solid" }}>{obj.curp}</b> <br />
         {obj.name} {obj.paternal_last_name} {obj.maternal_last_name}
      </Typography>
   );
   const AverageBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         <b>{obj.average}</b>
      </Typography>
   );
   const StatusBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         <b>{obj.status}</b>
      </Typography>
   );

   const ActiveBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         {obj.active ? <IconCircleCheckFilled style={{ color: "green" }} /> : <IconCircleXFilled style={{ color: "red" }} />}
      </Typography>
   );
   const CurrentBodyTemplate = (obj) => (
      <Typography textAlign={"center"}>
         <b>{obj.current_page}</b>
      </Typography>
   );
   const RequestDateBodyTemplate = (obj) => <Typography textAlign={"center"}>{formatDatetime(obj.created_at)}</Typography>;
   const EndDateBodyTemplate = (obj) => <Typography textAlign={"center"}>{formatDatetime(obj.end_date)}</Typography>;
   //#endregion BODY TEMPLATES

   const columns = [
      { field: "folio", header: "Folio", sortable: true, functionEdit: null, body: FolioBodyTemplate },
      { field: "school", header: "Escuela", sortable: true, functionEdit: null, body: SchoolBodyTemplate },
      { field: "student", header: "Alumno", sortable: true, functionEdit: null, body: StudentBodyTemplate },
      { field: "average", header: "Promedio", sortable: true, functionEdit: null, body: AverageBodyTemplate },
      { field: "status", header: "Estatus", sortable: true, functionEdit: null, body: StatusBodyTemplate },
      { field: "current_page", header: "Página", sortable: true, functionEdit: null, body: CurrentBodyTemplate, filterField: null },
      { field: "created_at", header: "Fecha de Solicitud", sortable: true, functionEdit: null, body: RequestDateBodyTemplate },
      { field: "end_date", header: "Fecha de Termino", sortable: true, functionEdit: null, body: EndDateBodyTemplate }
   ];
   auth.role_id === ROLE_SUPER_ADMIN &&
      columns.push(
         { field: "active", header: "Activo", sortable: true, functionEdit: null, body: ActiveBodyTemplate, filterField: null }
         // { field: "created_at", header: "Fecha de Solicitud", sortable: true, functionEdit: null, body: RequestDateBodyTemplate, filterField: null }
      );

   const mySwal = withReactContent(Swal);

   const handleClickView = async (obj) => {
      setLoadingAction(true);
      // console.log(obj);
      const community = await getCommunityById(obj.community_id);
      const school_community = await getCommunityById(obj.school_community_id);
      const familyData = await getIndexByFolio(obj.folio);
      obj.community = community;
      obj.school_community = school_community;
      obj.families = familyData.result.families;
      setObjReport(obj);
      setOpenDialogPreview(true);
      setLoadingAction(false);
   };

   const handleClickAdd = () => {
      try {
         location.hash = "/admin/solicitud-beca";
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickEdit = async (id) => {
      try {
         setLoadingAction(true);
         setTextBtnSumbit("GUARDAR");
         setFormTitle(`EDITAR ${singularName.toUpperCase()}`);
         await showRequestBeca(id);
         setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDelete = async (id, name) => {
      try {
         mySwal.fire(QuestionAlertConfig(`Estas seguro de eliminar la solicitu con folio #${name}`)).then(async (result) => {
            if (result.isConfirmed) {
               setLoadingAction(true);
               const axiosResponse = await deleteRequestBeca(id);
               setLoadingAction(false);
               Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   // const handleClickDisEnable = async (id, name, active) => {
   //    try {
   //       let axiosResponse;
   //       setTimeout(async () => {
   //          axiosResponse = await DisEnableUser(id, !active);
   //          Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
   //       }, 500);
   //    } catch (error) {
   //       console.log(error);
   //       Toast.Error(error);
   //    }
   // };

   const ButtonsAction = ({ id, name, current_page, obj }) => {
      return (
         <ButtonGroup variant="outlined">
            {auth.role_id <= ROLE_ADMIN && obj.status == "TERMINADA" && (
               <Tooltip title={`Ver Solicitud ${singularName}`} placement="top">
                  <Button color="dark" onClick={() => handleClickView(obj)}>
                     <IconEye />
                  </Button>
               </Tooltip>
            )}
            {obj.end_date == null && (
               <Tooltip title={`Solicitud ${name}`} placement="top">
                  <Button color="primary">
                     <Link to={`/admin/solicitud-beca/pagina/${current_page}/folio/${id}`} target="_blank" style={{ textDecoration: "none" }}>
                        {/* <IconEye /> */}
                        Continuar
                     </Link>
                  </Button>
               </Tooltip>
            )}
            <Tooltip title={`Editar ${singularName}`} placement="top">
               <Button color="info" onClick={() => handleClickEdit(id)}>
                  <IconEdit />
               </Button>
            </Tooltip>
            <Tooltip title={`Eliminar ${singularName}`} placement="top">
               <Button color="error" onClick={() => handleClickDelete(id, name)}>
                  <IconDelete />
               </Button>
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

   const data = [];
   const formatData = async () => {
      try {
         // console.log("cargar listado", requestBecas);
         await requestBecas.map((obj, index) => {
            // console.log(obj);
            let register = obj;
            register.key = index + 1;
            register.actions = <ButtonsAction id={obj.id} name={obj.folio} current_page={obj.current_page} obj={obj} />;
            data.push(register);
         });
         // if (data.length > 0) setGlobalFilterFields(Object.keys(requestBecas[0]));
         // console.log("la data del formatData", globalFilterFields);
         setLoading(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
   formatData();

   const printContent = (idContent) => {
      var content = document.getElementById(idContent).innerHTML;
      var printWindow = window.open("", "_blank");
      printWindow.document.write(`<html><head><title>Imprimir contenido</title> <script>import "@fontsource/roboto/300.css";
      // import "@fontsource/roboto/400.css";
      // import "@fontsource/roboto/500.css";
      // import "@fontsource/roboto/700.css";

      // import "./index.css";
      // import { CircularProgress, CssBaseline, ThemeProvider, Typography } from "@mui/material";
      // import "@material-ui/core/styles";
      // import themes from "./themes";
      // const customization = useSelector((state) => state.customization);
      // const { loading, loadingAction } = useGlobalContext();
      // <ThemeProvider theme={themes(customization)}>
      //    <CssBaseline />
      // </script></head><body>`);
      printWindow.document.write(content);
      printWindow.document.write(`</body><script>
      </ThemeProvider>
      </script></html>`);
      printWindow.document.close();
      printWindow.print();
   };

   useEffect(() => {
      setLoading(false);
   }, []);

   return (
      <>
         <DataTableComponent
            columns={columns}
            data={data}
            setData={setRequestBecas}
            globalFilterFields={globalFilterFields}
            headerFilters={false}
            handleClickAdd={handleClickAdd}
            rowEdit={false}
            refreshTable={getRequestBecas}
         />

         <Dialog fullWidth maxWidth={"lg"} fullScreen={fullScreenDialog} open={openDialogPreview} onClose={() => setOpenDialogPreview(false)}>
            {/* <DialogTitle> */}
            <Toolbar>
               <Typography sx={{ ml: 2, flex: 1 }} variant="h3" component="div">
                  {"title"}
               </Typography>
               <Tooltip title={`Exportar Reporte a PDF`} placement="top">
                  <IconButton color="inherit" onClick={() => downloadPDF("reportPaper")}>
                     <IconFileTypePdf color="red" />
                  </IconButton>
               </Tooltip>
               <Tooltip title={`Imprimir Reporte`} placement="top">
                  <IconButton color="inherit" onClick={() => printContent("reportPaper")}>
                     <IconPrinter />
                  </IconButton>
               </Tooltip>
               <Tooltip title={fullScreenDialog ? `Minimizar ventana` : `Maximizar ventana`} placement="top">
                  <IconButton color="inherit" onClick={() => setFullScreenDialog(!fullScreenDialog)}>
                     {fullScreenDialog ? <IconWindowMinimize /> : <IconWindowMaximize />}
                  </IconButton>
               </Tooltip>
               <Tooltip title={`Cerrar ventana`} placement="top">
                  <IconButton edge="end" color="inherit" onClick={() => setOpenDialogPreview(false)} aria-label="close">
                     <IconX />
                  </IconButton>
               </Tooltip>
            </Toolbar>
            {/* </DialogTitle> */}
            <DialogContent>
               {/* <DialogContentText>You can set my maximum width and whether to adapt or not.</DialogContentText> */}
               <Box
                  noValidate
                  component="form"
                  sx={{
                     display: "flex",
                     flexDirection: "column",
                     m: "auto",
                     width: "95%"
                  }}
               >
                  <RequestReportPDF obj={objReport} />
                  {/* <RequestReport obj={objReport} /> */}
                  {/* <PDFViewer>
                     <RequestReportPDF obj={objReport} />
                  </PDFViewer> */}
                  {/* <PDFDownloadLink document={MyDocument} fileName="documento.pdf">
                     {({ blob, url, loading, error }) => (loading ? "Cargando documento..." : "Descargar PDF")}
                  </PDFDownloadLink> */}
               </Box>
            </DialogContent>
            <DialogActions>
               <Button onClick={() => Toast.Success("Guardado")}>Guardar</Button>
            </DialogActions>
         </Dialog>
      </>
   );
};
export default RequestBecaDT;
