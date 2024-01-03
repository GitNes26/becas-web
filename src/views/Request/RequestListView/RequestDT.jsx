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
import { IconX, IconWindowMaximize, IconWindowMinimize } from "@tabler/icons-react";

import { useRequestBecaContext } from "../../../context/RequestBecaContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import sAlert, { QuestionAlertConfig } from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { ROLE_ADMIN, ROLE_SUPER_ADMIN, useGlobalContext } from "../../../context/GlobalContext";
import DataTableComponent from "../../../components/DataTableComponent";
import { IconEye } from "@tabler/icons";
import { formatDatetime } from "../../../utils/Formats";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { IconCircleXFilled } from "@tabler/icons-react";
import SwitchComponent from "../../../components/SwitchComponent";
import { object } from "prop-types";
import { Box } from "@mui/system";
import DialogComponent from "../../../components/DialogComponent";
import SimpleTableComponent from "../../../components/Table/SimpleTableComponent";
// import { Preview, print } from "react-html2pdf";

const RequestBecaDT = () => {
   const { auth } = useAuthContext();
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const { singularName, pluralName, requestBecas, setRequestBecas, getRequestBecas, showRequestBeca, deleteRequestBeca, setTextBtnSumbit, setFormTitle } =
      useRequestBecaContext();
   const globalFilterFields = ["folio", "code", "level", "school", "curp", "name", "paternal_last_name", "maternal_last_name", "average", "status", "created_at"];

   const [openDialogPreview, setOpenDialogPreview] = useState(false);
   const [fullScreenDialog, setFullScreenDialog] = useState(false);

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

   const handleClickView = (obj) => {
      console.log(obj);
      setOpenDialogPreview(true);
      // <Preview id={"jsx-template"}>
      //    <p>adsf</p>
      // </Preview>;
      // print("a", "jsx-template");
      // {
      //    /* <button onClick={()=>print('a', 'jsx-template')}> print</button> */
      // }
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
            {auth.role_id <= ROLE_ADMIN && (
               <Tooltip title={`Ver Solicitud ${singularName}`} placement="top">
                  <Button color="dark" onClick={() => handleClickView(obj)}>
                     <IconEye />
                  </Button>
               </Tooltip>
            )}
            <Tooltip title={`Solicitud ${name}`} placement="top">
               <Button color="primary">
                  <Link to={`/admin/solicitud-beca/pagina/${current_page}/folio/${id}`} target="_blank" style={{ textDecoration: "none" }}>
                     {/* <IconEye /> */}
                     Continuar
                  </Link>
               </Button>
            </Tooltip>
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
               <Tooltip title={`Cerrar ventana`} placement="top">
                  <Tooltip title={fullScreenDialog ? `Minimizar ventana` : `Maximizar ventana`} placement="top">
                     <IconButton autoFocus color="inherit" onClick={() => setFullScreenDialog(!fullScreenDialog)}>
                        {fullScreenDialog ? <IconWindowMinimize /> : <IconWindowMaximize />}
                     </IconButton>
                  </Tooltip>
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
                  <SimpleTableComponent />
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
