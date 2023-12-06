import { Fragment, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { Button, ButtonGroup, IconButton, Tooltip, Typography } from "@mui/material";
import IconEdit from "../../../components/icons/IconEdit";
import IconDelete from "../../../components/icons/IconDelete";

import { useRequestBecaContext } from "../../../context/RequestBecaContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import sAlert, { QuestionAlertConfig } from "../../../utils/sAlert";
import Toast from "../../../utils/Toast";
import { ROLE_SUPER_ADMIN, useGlobalContext } from "../../../context/GlobalContext";
import DataTableComponent from "../../../components/DataTableComponent";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { IconCircleXFilled } from "@tabler/icons-react";
import { formatCurrency, formatDatetime } from "../../../utils/Formats";
import { useAuthContext } from "../../../context/AuthContext";
import SwitchComponent from "../../../components/SwitchComponent";

const RequestBecaDT = () => {
   const { auth } = useAuthContext();
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const {
      singularName,
      requestBeca,
      requestBecas,
      setRequestBecas,
      getRequestBecas,
      showRequestBeca,
      deleteRequestBeca,
      DisEnableRequestBeca,
      resetFormData,
      resetRequestBeca,
      setTextBtnSumbit,
      setFormTitle
   } = useRequestBecaContext();
   const globalFilterFields = ["requestBeca", "active", "created_at"];

   // #region BodysTemplate
   const RelationshipBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.relationship.toUpperCase()}</Typography>;
   const AgeBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.age}</Typography>;
   const OccupationBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.occupation}</Typography>;
   const MonthlyIcomeBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.monthly_income}</Typography>;
   // #endregion BodysTemplate

   const columns = [
      { field: "relationship", header: "Parentesco", sortable: true, functionEdit: null, body: RelationshipBodyTemplate, filterField: null },
      { field: "age", header: "Edad", sortable: true, functionEdit: null, body: AgeBodyTemplate, filterField: null },
      { field: "occupation", header: "Ocupación", sortable: true, functionEdit: null, body: OccupationBodyTemplate, filterField: null },
      { field: "monthly_income", header: "Ingresos Mensuales", sortable: true, functionEdit: null, body: MonthlyIcomeBodyTemplate, filterField: null }
   ];

   const mySwal = withReactContent(Swal);

   const handleClickAdd = () => {
      try {
         // resetRequestBeca();
         resetFormData();
         setOpenDialog(true);
         setTextBtnSumbit("AGREGAR");
         setFormTitle(`REGISTRAR ${singularName.toUpperCase()}`);
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
         mySwal.fire(QuestionAlertConfig(`Estas seguro de eliminar a ${name}`)).then(async (result) => {
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

   const ButtonsAction = ({ id, name, active }) => {
      return (
         <ButtonGroup variant="outlined">
            <Tooltip title={`Editar ${singularName}`} placement="top">
               <IconButton color="info" onClick={() => handleClickEdit(id)}>
                  <IconEdit />
               </IconButton>
            </Tooltip>
            <Tooltip title={`Eliminar ${singularName}`} placement="top">
               <IconButton color="error" onClick={() => handleClickDelete(id, name)}>
                  <IconDelete />
               </IconButton>
            </Tooltip>
         </ButtonGroup>
      );
   };

   const data = [];
   const formatData = async () => {
      try {
         console.log("cargar listado", requestBecas);
         await requestBecas.map((obj) => {
            console.log(obj);
            let register = obj;
            register.actions = <ButtonsAction id={obj.id} name={obj.requestBeca} active={obj.active} />;
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

   const addRow = () => {
      console.log("addRow - data", data);
      const newRow = {
         id: data.length + 1,
         code: "",
         name: "",
         description: "",
         image: "",
         price: "",
         category: "",
         quantity: "",
         inventoryStatus: "",
         rating: ""
      };

      // let _products = [...data];
      // console.log("_products", _products);
      // // let { newData, index } = e;

      // // _products[index] = newData;
      // _products.push(newRow);

      // setData(_products);

      // // setData(newRow);
      // console.log(data);
   };

   useEffect(() => {
      setLoading(false);
   }, []);
   return (
      <DataTableComponent
         columns={columns}
         data={data}
         setData={setRequestBecas}
         globalFilterFields={globalFilterFields}
         headerFilters={false}
         handleClickAdd={handleClickAdd}
         rowEdit={true}
         btnAdd={true}
         addRow={addRow}
         refreshTable={getRequestBecas}
         btnsExport={false}
      />
   );
};
export default RequestBecaDT;
