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
   const tableRows = [
      {
         TableCellcolSpan: 5,
         tHeadRows: [["Folio", "Fecha de Solicitud", "Fecha de Termino", "Estatus de la solicitud"]],
         tBodyCells: [obj.folio, formatDatetime(obj.created_at, true), formatDatetime(obj.end_date, true), obj.status]
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
                           <TableHead>
                              {tr.tHeadRows.map((thr) => (
                                 <TableRow>
                                    {thr.map((title) => (
                                       <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                          {title}
                                       </TableCell>
                                    ))}
                                 </TableRow>
                              ))}
                           </TableHead>
                           <TableBody>
                              <TableRow hover role="checkbox" tabIndex={-1}>
                                 {tr.tBodyCells.map((tc) => (
                                    <TableCell align={"center"}>{tc}</TableCell>
                                 ))}
                              </TableRow>
                           </TableBody>
                        </Table>
                     </TableCell>
                  </TableRow>
               ))}
               <TableRow>
                  <TableCell colSpan={5}>
                     <Table>
                        <TableHead>
                           <TableRow>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Folio"}
                              </TableCell>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Fecha de Solicitud"}
                              </TableCell>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Fecha de Termino"}
                              </TableCell>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Estatus de la solicitud"}
                              </TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           <TableRow hover role="checkbox" tabIndex={-1}>
                              <TableCell align={"center"}>{obj.folio}</TableCell>
                              <TableCell align={"center"}>{formatDatetime(obj.created_at, true)}</TableCell>
                              <TableCell align={"center"}>{formatDatetime(obj.end_date, true)}</TableCell>
                              <TableCell align={"center"}>{obj.status}</TableCell>
                           </TableRow>
                        </TableBody>
                     </Table>
                  </TableCell>
               </TableRow>
               {/* <TableRow sx={{ height: 15 }}></TableRow> SEPARADOR */}
               {/* DATOS DEL TUTOR */}
               <TableRow>
                  <TableCell colSpan={5}>
                     <Table>
                        <TableHead>
                           <TableRow>
                              <TableCell colSpan={4} align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {`DATOS DEL TUTOR `}
                              </TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"CURP"}
                              </TableCell>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Parentesco"}
                              </TableCell>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Nombre Completo"}
                              </TableCell>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Teléfono"}
                              </TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           <TableRow hover role="checkbox" tabIndex={-1}>
                              <TableCell align={"center"}>{obj.tutor_curp}</TableCell>
                              <TableCell align={"center"}>{obj.relationship}</TableCell>
                              <TableCell align={"center"}>{`${obj.tutor_name} ${obj.tutor_paternal_last_name} ${obj.tutor_maternal_last_name}`}</TableCell>
                              <TableCell align={"center"}>{formatPhone(obj.tutor_phone)}</TableCell>
                           </TableRow>
                        </TableBody>
                     </Table>
                  </TableCell>
               </TableRow>
               {/* <TableRow sx={{ height: 15 }}></TableRow> SEPARADOR */}
               {/* DATOS DEL TUTOR */}
               <TableRow>
                  <TableCell colSpan={5}>
                     <Table>
                        <TableHead>
                           <TableRow>
                              <TableCell colSpan={5} align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 DATOS DEL ALUMNO
                              </TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"CURP"}
                              </TableCell>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Nombre Completo"}
                              </TableCell>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Fecha de Nacimeinto"}
                              </TableCell>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Sexo"}
                              </TableCell>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Discapacidad"}
                              </TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           <TableRow hover role="checkbox" tabIndex={-1}>
                              <TableCell align={"center"}>{obj.curp}</TableCell>
                              <TableCell align={"center"}>{`${obj.name} ${obj.paternal_last_name} ${obj.maternal_last_name}`}</TableCell>
                              <TableCell align={"center"}>{formatDatetime(obj.birthdate, false)}</TableCell>
                              <TableCell align={"center"}>{obj.gender}</TableCell>
                              <TableCell align={"center"}>{obj.disability}</TableCell>
                           </TableRow>
                        </TableBody>
                        {/* COMUNIDAD */}
                        <TableHead>
                           <TableRow>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"C.P."}
                              </TableCell>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Estado"}
                              </TableCell>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Municipio"}
                              </TableCell>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Perímetro"}
                              </TableCell>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Colónia"}
                              </TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           <TableRow hover role="checkbox" tabIndex={-1}>
                              <TableCell align={"center"}>{obj.community.CodigoPostal}</TableCell>
                              <TableCell align={"center"}>{obj.community.Estado}</TableCell>
                              <TableCell align={"center"}>{obj.community.Municipio}</TableCell>
                              <TableCell align={"center"}>{obj.community.Perimetro}</TableCell>
                              <TableCell align={"center"}>{obj.community.Colonia}</TableCell>
                           </TableRow>
                        </TableBody>
                        <TableHead>
                           <TableRow>
                              <TableCell colSpan={5} align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Dirección"}
                              </TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           <TableRow hover role="checkbox" tabIndex={-1}>
                              <TableCell colSpan={5} align={"center"}>{`${obj.street} #${obj.num_ext} ${
                                 obj.num_int !== "S/N" ? `N° interior: ${obj.num_int}` : ""
                              }`}</TableCell>
                           </TableRow>
                        </TableBody>
                        {/* COMUNIDAD */}
                     </Table>
                  </TableCell>
               </TableRow>
               {/* <TableRow sx={{ height: 15 }}></TableRow> SEPARADOR */}

               <TableRow>
                  <TableCell colSpan={5}>
                     <Table>
                        <TableHead>
                           <TableRow>
                              <TableCell colSpan={5} align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 DATOS DEL LA ESCUELA
                              </TableCell>
                           </TableRow>
                           <TableRow>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Clave"}
                              </TableCell>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Nivel"}
                              </TableCell>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Nombre"}
                              </TableCell>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Teléfono"}
                              </TableCell>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Director"}
                              </TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           <TableRow hover role="checkbox" tabIndex={-1}>
                              <TableCell align={"center"}>{obj.code}</TableCell>
                              <TableCell align={"center"}>{obj.level}</TableCell>
                              <TableCell align={"center"}>{obj.school}</TableCell>
                              <TableCell align={"center"}>{formatPhone(obj.phone)}</TableCell>
                              <TableCell align={"center"}>{obj.director}</TableCell>
                           </TableRow>
                        </TableBody>
                        {/* COMUNIDAD */}
                        <TableHead>
                           <TableRow>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"C.P."}
                              </TableCell>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Estado"}
                              </TableCell>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Municipio"}
                              </TableCell>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Perímetro"}
                              </TableCell>
                              <TableCell align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Colónia"}
                              </TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           <TableRow hover role="checkbox" tabIndex={-1}>
                              <TableCell align={"center"}>{obj.school_community.CodigoPostal}</TableCell>
                              <TableCell align={"center"}>{obj.school_community.Estado}</TableCell>
                              <TableCell align={"center"}>{obj.school_community.Municipio}</TableCell>
                              <TableCell align={"center"}>{obj.school_community.Perimetro}</TableCell>
                              <TableCell align={"center"}>{obj.school_community.Colonia}</TableCell>
                           </TableRow>
                        </TableBody>
                        <TableHead>
                           <TableRow>
                              <TableCell colSpan={5} align={"center"} style={{ backgroundColor: "#364152", color: "whitesmoke" }}>
                                 {"Dirección"}
                              </TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           <TableRow hover role="checkbox" tabIndex={-1}>
                              <TableCell colSpan={5} align={"center"}>{`${obj.school_street} #${obj.school_num_ext} ${
                                 obj.school_num_int !== "S/N" ? `N° interior: ${obj.school_num_int}` : ""
                              }`}</TableCell>
                           </TableRow>
                        </TableBody>
                        {/* COMUNIDAD */}
                     </Table>
                  </TableCell>
               </TableRow>

               <TableRow>
                  <TableCell colSpan={5}>
                     <Table></Table>
                  </TableCell>
               </TableRow>

               <TableRow>
                  <TableCell colSpan={5}>
                     <Table></Table>
                  </TableCell>
               </TableRow>

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
