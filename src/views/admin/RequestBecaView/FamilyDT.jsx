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

import { useFamilyContext } from "../../../context/FamilyContext";
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
import { useParams } from "react-router-dom";

const FamilyDT = () => {
   let { folio, pagina = 0 } = useParams();

   const { auth } = useAuthContext();
   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const { singularName, family, families, setFamilies, getIndexByFolio, deleteFamily, DisEnableFamily, resetFormData, resetFamily, setTextBtnSumbit, setFormTitle } =
      useFamilyContext();
   const globalFilterFields = ["relationship", "age", "occupation", "monthly_income", "active", "created_at"];

   // #region BodysTemplate
   const RelationshipBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.relationship.toUpperCase()}</Typography>;
   const AgeBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.age}</Typography>;
   const OccupationBodyTemplate = (obj) => <Typography textAlign={"center"}>{obj.occupation}</Typography>;
   const MonthlyIcomeBodyTemplate = (obj) => <Typography textAlign={"center"}>{formatCurrency(obj.monthly_income, true, true)}</Typography>;
   // #endregion BodysTemplate

   const columns = [
      { field: "relationship", header: "Parentesco", sortable: true, functionEdit: null, body: RelationshipBodyTemplate, filterField: null },
      { field: "age", header: "Edad (años)", sortable: true, functionEdit: null, body: AgeBodyTemplate, filterField: null },
      { field: "occupation", header: "Ocupación", sortable: true, functionEdit: null, body: OccupationBodyTemplate, filterField: null },
      { field: "monthly_income", header: "Ingresos Mensuales", sortable: true, functionEdit: null, body: MonthlyIcomeBodyTemplate, filterField: null }
   ];

   const mySwal = withReactContent(Swal);

   const handleClickAdd = () => {
      try {
         // resetFamily();
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
         await showFamily(id);
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
               const axiosResponse = await deleteFamily(id);
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
         console.log("cargar listado", families);
         await families.map((obj) => {
            console.log(obj);
            let register = obj;
            register.actions = <ButtonsAction id={obj.id} name={obj.family} active={obj.active} />;
            data.push(register);
         });
         // if (data.length > 0) setGlobalFilterFields(Object.keys(families[0]));
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
         beca_id: 1,
         relationship: "",
         age: 0,
         occupation: "",
         monthly_income: 0
         // finished: false
      };

      let _data = [...data];
      console.log("_data", _data);
      // let { newData, index } = e;

      // _data[index] = newData;
      _data.push(newRow);

      setFamilies(_data);

      // setData(newRow);
      console.log(data);
   };

   useEffect(() => {
      getIndexByFolio(folio);
      setLoading(false);
   }, []);

   return (
      <DataTableComponent
         columns={columns}
         data={data}
         setData={setFamilies}
         globalFilterFields={globalFilterFields}
         headerFilters={false}
         handleClickAdd={handleClickAdd}
         rowEdit={true}
         btnAdd={true}
         addRow={addRow}
         refreshTable={getIndexByFolio(folio)}
         btnsExport={false}
      />
   );
};
export default FamilyDT;
