import { Page, Text, Document, PDFDownloadLink } from "@react-pdf/renderer";

const MyPDFComponent = ({ elementID }) => {
   console.log("elem", elementID);
   const element = document.getElementById(elementID);
   console.log(element);
   // const clone = element.innerHTML;
   // const MyDocument = (
   //    <Document>
   //       <Page>{clone}</Page>
   //    </Document>
   // );

   // return (
   //    <PDFDownloadLink document={MyDocument} fileName="documento.pdf">
   //       {({ blob, url, loading, error }) => (loading ? "Cargando documento..." : "Descargar PDF")}
   //    </PDFDownloadLink>
   // );
};

export default MyPDFComponent;

// import { Page, Text, Document, PDFViewer } from "@react-pdf/renderer";

// const MyPDFComponent = ({ content }) => {
//    return (
//       <PDFViewer style={{ width: "100%", height: "500px" }}>
//          <Document>
//             <Page size="A4">{content}</Page>
//          </Document>
//       </PDFViewer>
//    );
// };

// export default MyPDFComponent;
