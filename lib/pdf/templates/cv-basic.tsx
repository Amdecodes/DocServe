import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 20, marginBottom: 10 },
  text: { fontSize: 12, marginBottom: 6 }
});

export function CvPdf({ data }: { data: any }) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>{data.fullName}</Text>
        <Text style={styles.text}>{data.email}</Text>
        <Text style={styles.text}>{data.phone}</Text>
      </Page>
    </Document>
  );
}
