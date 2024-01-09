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
import { formatCurrency, formatDatetime, formatPhone, splitArroba } from "../../../utils/Formats";
import Toast from "../../../utils/Toast";
import { IconCheck } from "@tabler/icons";
import CloseIcon from "@mui/icons-material/Close";

export default function RequestReport({ obj }) {
   const checkCross = (value) => {
      try {
         return value ? <IconCheck /> : <CloseIcon />;
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

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
               // MAS DATOS
               tHeadRows: [
                  [{ colSpan: null, title: null }],
                  [
                     { colSpan: 2, title: "Grado escolar" },
                     { colSpan: 3, title: "Promedio" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: 2, value: obj.grade },
                  { colSpan: 3, value: obj.average }
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
                     { colSpan: null, title: "Local o Foranea" },
                     { colSpan: null, title: "Perímetro" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, value: obj.school_community.CodigoPostal },
                  { colSpan: null, value: obj.school_community.Estado },
                  { colSpan: null, value: obj.school_community.Municipio },
                  { colSpan: null, value: obj.loc_for ? "LOCAL" : "FORANEA" },
                  { colSpan: null, value: obj.school_community.Perimetro }
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
                  [{ colSpan: 4, title: "¿Con quienes vive actualmente el alumno?" }],
                  [
                     { colSpan: null, title: "Parentesco" },
                     { colSpan: null, title: "Edad (años)" },
                     { colSpan: null, title: "Ocupación" },
                     { colSpan: null, title: "Ingresos Mensuales" }
                  ]
               ],
               tBodyCells: obj.families.map((f) => [
                  { colSpan: null, value: f.relationship },
                  { colSpan: null, value: f.age },
                  { colSpan: null, value: f.occupation },
                  { colSpan: null, value: formatCurrency(f.monthly_income) }
               ])
            },
            {
               //INGRESOS
               tHeadRows: [
                  [{ colSpan: null, title: null }],
                  [
                     { colSpan: 2, title: "Otros Ingresos extras" },
                     { colSpan: 3, title: "Total de ingresos MENSUALES" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: 2, value: formatCurrency(obj.extra_income) },
                  { colSpan: 3, value: formatCurrency(obj.monthly_income) }
               ]
            }
         ]
      },
      //DATOS ECONOMICOS
      {
         TableCellcolSpan: 6,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: 6, title: "DATOS ECONÓMICOS" }],
                  [{ colSpan: 6, title: "Persona(s) que sostiene el hogar (Padre, Madre, Abuelo) --- Detalle de gastos MENSUALES Familiares" }],
                  [
                     { colSpan: null, title: "Alimentaciópn (Despensa)" },
                     { colSpan: null, title: "Transporte" },
                     { colSpan: null, title: "Vivienda (renta, infonavit)" },
                     { colSpan: null, title: "Servicios (agua y luz)" },
                     { colSpan: null, title: "Automóvil" },
                     { colSpan: null, title: "TOTAL DE  EGRESOS" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, value: formatCurrency(obj.b3_food) },
                  { colSpan: null, value: formatCurrency(obj.b3_transport) },
                  { colSpan: null, value: formatCurrency(obj.b3_living_place) },
                  { colSpan: null, value: formatCurrency(obj.b3_services) },
                  { colSpan: null, value: formatCurrency(obj.b3_automobile) },
                  { colSpan: null, value: formatCurrency(obj.total_expenses) }
               ]
            }
         ]
      },
      //DATOS DE LA VIVIENDA
      {
         TableCellcolSpan: 5,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: 3, title: "DATOS DE LA VIVIENDA" }],
                  [
                     { colSpan: null, title: "La casa donde vivo es" },
                     { colSpan: null, title: "Material de techo" },
                     { colSpan: null, title: "Material del piso" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, value: splitArroba(obj.b4_house_is, false) },
                  { colSpan: null, value: splitArroba(obj.b4_roof_material, false) },
                  { colSpan: null, value: splitArroba(obj.b4_floor_material, false) }
               ]
            }
         ]
      },
      //EQUIPAMIENTO DOMÉSTICO
      {
         TableCellcolSpan: 5,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: 9, title: "EQUIPAMIENTO DOMÉSTICO" }],
                  [{ colSpan: 9, title: "Aparatos/Muebles con los que cuentan en casa" }],
                  [
                     { colSpan: null, title: "Camas" },
                     { colSpan: null, title: "Lavadora de ropa" },
                     { colSpan: null, title: "Calentador de agua (boiler)" },
                     { colSpan: null, title: "Televisores" },
                     { colSpan: null, title: "Computadoras" },
                     { colSpan: null, title: "Teléfono local o celular" },
                     { colSpan: null, title: "Reprodcutor de música" },
                     { colSpan: null, title: "Estufa" },
                     { colSpan: null, title: "Refrigerador" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, value: obj.b5_beds },
                  { colSpan: null, value: obj.b5_washing_machines },
                  { colSpan: null, value: obj.b5_boilers },
                  { colSpan: null, value: obj.b5_tvs },
                  { colSpan: null, value: obj.b5_pcs },
                  { colSpan: null, value: obj.b5_phones },
                  { colSpan: null, value: obj.b5_music_player },
                  { colSpan: null, value: obj.b5_stoves },
                  { colSpan: null, value: obj.b5_refrigerators }
               ]
            },
            {
               tHeadRows: [
                  [{ colSpan: 9, title: "¿Cuáles son los servicios con que cuentas en tu casa" }],
                  [
                     { colSpan: null, title: "Agua Potable" },
                     { colSpan: 2, title: "Luz Eléctrica" },
                     { colSpan: null, title: "Drenaje" },
                     { colSpan: null, title: "Pavimento" },
                     { colSpan: null, title: "Automóvil" },
                     { colSpan: 2, title: "Línea Telefónica" },
                     { colSpan: null, title: "Internet" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, value: checkCross(obj.b5_drinking_water) },
                  { colSpan: 2, value: checkCross(obj.b5_electric_light) },
                  { colSpan: null, value: checkCross(obj.b5_sewer_system) },
                  { colSpan: null, value: checkCross(obj.b5_pavement) },
                  { colSpan: null, value: checkCross(obj.b5_automobile) },
                  { colSpan: 2, value: checkCross(obj.b5_phone_line) },
                  { colSpan: null, value: checkCross(obj.b5_internet) }
               ]
            }
         ]
      },
      //PROGRAMAS DE BECAS
      {
         TableCellcolSpan: 5,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: 4, title: "PROGRAMAS DE BECAS" }],
                  [{ colSpan: 4, title: "¿Tu familia es beneficiaria de algunas de las siguientes becas?" }],
                  [
                     { colSpan: null, title: "Transporte" },
                     { colSpan: null, title: "Beca para el bienestar Benito Juárez" },
                     { colSpan: null, title: "Jóvenes Construyendo el futuro" },
                     { colSpan: null, title: "Otra" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, value: checkCross(obj.b6_beca_transport) },
                  { colSpan: null, value: checkCross(obj.b6_beca_benito_juarez) },
                  { colSpan: null, value: checkCross(obj.b6_beca_jovenes) },
                  { colSpan: null, value: checkCross(obj.b6_other) }
               ]
            }
         ]
      }
   ];
   // console.log(tableRows);

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
               {/* DATOS */}
               {tableRows.map((tr, trIndex) => (
                  <TableRow>
                     <TableCell key={`tc_${trIndex}`} colSpan={tr.TableCellcolSpan}>
                        <Table key={`table__${trIndex}`}>
                           {tr.table.map((t) => (
                              <>
                                 <TableHead>
                                    {t.tHeadRows.map((thr, index) => {
                                       if (thr[0].title === null) return;
                                       return (
                                          <TableRow key={index}>
                                             {thr.map((tcTitle, innerIndex) => (
                                                <TableCell
                                                   key={`arrayTHCell_${index}_${innerIndex}`}
                                                   colSpan={tcTitle.colSpan}
                                                   align={"center"}
                                                   style={{ backgroundColor: "#364152", color: "whitesmoke" }}
                                                >
                                                   {tcTitle.title}
                                                </TableCell>
                                             ))}
                                          </TableRow>
                                       );
                                    })}
                                 </TableHead>
                                 <TableBody>
                                    {t.tBodyCells.map((tc, index) => {
                                       if (Array.isArray(tc)) {
                                          return (
                                             <TableRow hover role="checkbox" tabIndex={-1}>
                                                {tc.map((tcValue, innerIndex) => (
                                                   <TableCell key={`arrayTBCell_${index}_${innerIndex}`} colSpan={tcValue.colSpan} align={"center"}>
                                                      {tcValue.value}
                                                   </TableCell>
                                                ))}
                                             </TableRow>
                                          );
                                       } else if (typeof tc === "object")
                                          return (
                                             <TableCell key={`objectTBCell_${index}`} colSpan={tc.colSpan} align={"center"}>
                                                {tc.value}
                                             </TableCell>
                                          );
                                    })}
                                 </TableBody>
                              </>
                           ))}
                        </Table>
                     </TableCell>
                  </TableRow>
               ))}
               <TableRow>
                  <TableCell colSpan={5}>
                     <Typography textAlign={"center"}>
                        <span style={{ fontWeight: "bolder" }}>Nota:</span> Bajo protesta de decir la verdad, manifiesto que la información proporcionada en esta
                        solicitud es verídica.
                     </Typography>
                  </TableCell>
               </TableRow>
               <TableRow sx={{ height: 20 }}></TableRow> {/* SEPARADOR */}
               <TableRow>
                  <TableCell colSpan={5}>
                     <Typography textAlign={"center"} style={{ fontWeight: "bolder" }}>
                        <p>___________________________________________________________</p>
                        NOMBRE Y FIRMA DEL PADRE, MADRE O TUTOR.
                     </Typography>
                  </TableCell>
               </TableRow>
            </TableBody>
         </Table>
      </Paper>
   );
}
