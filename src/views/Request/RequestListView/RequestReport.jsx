import { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import logo_gpd from "/src/assets/images/logo-gpd.png";
import { width } from "@mui/system";
import { Typography } from "@mui/material";
import { formatDatetime, formatPhone } from "../../../utils/Formats";

export default function RequestReport({ obj }) {
   // const {get}
   
   const tableRows = [
      //DATOS GENERALES
      {
         TableCellcolSpan: 5,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: null, title: null }],
                  [
                     { colSpan: null, title: "Folio" },
                     { colSpan: null, title: "Fecha de Solicitud" },
                     { colSpan: null, title: "Fecha de Termino" },
                     { colSpan: null, title: "Estatus de la solicitud" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, value: obj.folio },
                  { colSpan: null, value: formatDatetime(obj.created_at, true) },
                  { colSpan: null, value: formatDatetime(obj.end_date, true) },
                  { colSpan: null, value: obj.status }
               ]
            }
         ]
      },
      //DATOS DEL TUTOR
      {
         TableCellcolSpan: 5,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: 4, title: "DATOS DEL TUTOR" }],
                  [
                     { colSpan: null, title: "CURP" },
                     { colSpan: null, title: "Parentesco" },
                     { colSpan: null, title: "Nombre Completo" },
                     { colSpan: null, title: "Teléfono" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, value: obj.tutor_curp },
                  { colSpan: null, value: obj.relationship },
                  { colSpan: null, value: `${obj.tutor_name} ${obj.tutor_paternal_last_name} ${obj.tutor_maternal_last_name}` },
                  { colSpan: null, value: formatPhone(obj.tutor_phone) }
               ]
            }
         ]
      },
      //DATOS DEL ALUMNO
      {
         TableCellcolSpan: 5,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: 5, title: "DATOS DEL ALUMNO" }],
                  [
                     { colSpan: null, title: "CURP" },
                     { colSpan: null, title: "Nombre Completo" },
                     { colSpan: null, title: "Fecha de Nacimeinto" },
                     { colSpan: null, title: "Sexo" },
                     { colSpan: null, title: "Discapacidad" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, value: obj.curp },
                  { colSpan: null, value: `${obj.name} ${obj.paternal_last_name} ${obj.maternal_last_name}` },
                  { colSpan: null, value: formatDatetime(obj.birthdate, false) },
                  { colSpan: null, value: obj.gender },
                  { colSpan: null, value: obj.disability }
               ]
            },
            {
               //COMUNIDAD p1
               tHeadRows: [
                  [{ colSpan: null, title: null }],
                  [
                     { colSpan: null, title: "C.P." },
                     { colSpan: null, title: "Estado" },
                     { colSpan: null, title: "Municipio" },
                     { colSpan: 2, title: "Perímetro" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, value: obj.community.CodigoPostal },
                  { colSpan: null, value: obj.community.Estado },
                  { colSpan: null, value: obj.community.Municipio },
                  { colSpan: 2, value: obj.community.Perimetro }
               ]
            },
            {
               //COMUNIDAD p2
               tHeadRows: [
                  [{ colSpan: null, title: null }],
                  [
                     { colSpan: 2, title: "Colonia" },
                     { colSpan: 3, title: "Dirección" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: 2, value: obj.community.Colonia },
                  { colSpan: 3, value: `${obj.street} #${obj.num_ext} ${obj.num_int !== "S/N" ? `N° interior: ${obj.num_int}` : ""}` }
               ]
            }
         ]
      },
      //DATOS DE LA ESCUELA
      {
         TableCellcolSpan: 5,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: 5, title: "DATOS DE LA ESCUELA" }],
                  [
                     { colSpan: null, title: "Clave" },
                     { colSpan: null, title: "Nivel" },
                     { colSpan: null, title: "Nombre" },
                     { colSpan: null, title: "Teléfono" },
                     { colSpan: null, title: "Director" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, value: obj.code },
                  { colSpan: null, value: obj.level },
                  { colSpan: null, value: obj.school },
                  { colSpan: null, value: formatPhone(obj.phone) },
                  { colSpan: null, value: obj.director }
               ]
            },
            {
               //COMUNIDAD p1
               tHeadRows: [
                  [{ colSpan: null, title: null }],
                  [
                     { colSpan: null, title: "C.P." },
                     { colSpan: null, title: "Estado" },
                     { colSpan: null, title: "Municipio" },
                     { colSpan: 2, title: "Perímetro" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, value: obj.school_community.CodigoPostal },
                  { colSpan: null, value: obj.school_community.Estado },
                  { colSpan: null, value: obj.school_community.Municipio },
                  { colSpan: 2, value: obj.school_community.Perimetro }
               ]
            },
            {
               //COMUNIDAD p2
               tHeadRows: [
                  [{ colSpan: null, title: null }],
                  [
                     { colSpan: 2, title: "Colonia" },
                     { colSpan: 3, title: "Dirección" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: 2, value: obj.school_community.Colonia },
                  { colSpan: 3, value: `${obj.school_street} #${obj.school_num_ext} ${obj.school_num_int !== "S/N" ? `N° interior: ${obj.school_num_int}` : ""}` }
               ]
            }
         ]
      },
      //DATOS FAMILIARES
      {
         TableCellcolSpan: 5,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: 4, title: "DATOS FAMILIARES" }],
                  [{ colSpan: 4, title: "¿Con Quienes vive actualmente el alumno?" }],
                  [
                     { colSpan: null, title: "Parentesco" },
                     { colSpan: null, title: "Edad" },
                     { colSpan: null, title: "Ocupación" },
                     { colSpan: null, title: "Ingresos Mensuales" }
                  ]
               ],
               tBodyCells: [

                  { colSpan: null, value: obj.tutor_curp },
                  { colSpan: null, value: obj.relationship },
                  { colSpan: null, value: `${obj.tutor_name} ${obj.tutor_paternal_last_name} ${obj.tutor_maternal_last_name}` },
                  { colSpan: null, value: formatPhone(obj.tutor_phone) }
               ]
            }
         ]
      }
   ];
   console.log(tableRows);

   return (
      <Paper id="reportPaper" sx={{ width: "100%", overflow: "hidden" }}>
         <Table stickyHeader aria-label="sticky table">
            {/* ENCABEZADO */}
            <TableHead>
               <TableRow sx={{ border: "none" }}>
                  <TableCell align={"left"}>
                     <img src={logo_gpd} style={{ width: 150 }} />
                  </TableCell>
                  <TableCell align={"center"} colSpan={3}>
                     <img src={logo_gpd} style={{ width: 150 }} />
                  </TableCell>
                  <TableCell align={"right"}>
                     <img src={logo_gpd} style={{ width: 150 }} />
                  </TableCell>
               </TableRow>
               <TableRow sx={{ border: "none" }}>
                  <TableCell colSpan={5} align={"center"}>
                     <Typography variant="h1">DIRECCIÓN DE EDUCACIÓN</Typography>
                     <Typography variant="h4">PROGRAMA DE BECAS MUNICIPALES</Typography>
                     <Typography variant="p">ESTUDIO-SOCIOECONOMICO</Typography>
                  </TableCell>
               </TableRow>
               <TableRow>
                  <TableCell colSpan={5} align={"center"}>
                     <Typography variant="p" align="justify" mb={2} sx={{ fontWeight: "normal", maxWidth: "70%" }}>
                        El presente cuestionario tiene por objetivo conocer el perfil de los aspirantes a obtener una beca del <b>R. Ayuntamiento de Gómez Palacio</b>.
                        La información proporcionada de aqui debe ser completamente verdadera, por ello, lee con atención cada pregunta y contesta adecuadamente.
                     </Typography>
                  </TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {/* DATOS GENERALES */}
               {tableRows.map((tr) => (
                  <TableRow>
                     <TableCell colSpan={tr.TableCellcolSpan}>
                        <Table>
                           {tr.table.map((t) => (
                              <>
                                 <TableHead>
                                    {t.tHeadRows.map((thr, index) => {
                                       if (thr[0].title === null) return;
                                       return (
                                          <TableRow>
                                             {thr.map((tcTitle) => (
                                                <TableCell colSpan={tcTitle.colSpan} align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                                   {tcTitle.title}
                                                </TableCell>
                                             ))}
                                          </TableRow>
                                       );
                                    })}
                                 </TableHead>
                                 <TableBody>
                                    <TableRow hover role="checkbox" tabIndex={-1}>
                                       {t.tBodyCells.map((tcValue) => (
                                          <TableCell colSpan={tcValue.colSpan} align={"center"}>
                                             {tcValue.value}
                                          </TableCell>
                                       ))}
                                    </TableRow>
                                 </TableBody>
                              </>
                           ))}
                        </Table>
                     </TableCell>
                  </TableRow>
               ))}

               {/* <TableRow sx={{ height: 15 }}></TableRow> SEPARADOR */}

               <TableRow>
                  <TableCell colSpan={5}>
                     <Table></Table>
                  </TableCell>
               </TableRow>
            </TableBody>

            {/* </Table> */}
         </Table>

         {/* </Table>
         </TableContainer> */}
      </Paper>
   );
}
