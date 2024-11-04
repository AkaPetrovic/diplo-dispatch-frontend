import LoadItem from "@/app/types/LoadItem";
import TruckLoad from "@/app/types/TruckLoad";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import React from "react";

Font.register({
  family: "SFPro",
  src: "/fonts/SF-Pro.ttf",
});

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#E4E4E4",
    fontFamily: "SFPro",
    fontWeight: "light",
    padding: 20,
  },
  section: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 10,
    gap: 10,
    fontSize: 12,
  },

  sectionPart: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  main: {
    display: "flex",
    flexDirection: "column",
  },
  headingSection: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  heading: {
    fontSize: 25,
  },
  generatedTime: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 10,
    color: "#555",
  },

  table: {
    width: "100%",
    marginBottom: 10,
    marginTop: 15,
  },
  tableRow: {
    flexDirection: "row",
    borderColor: "#bfbfbf",
  },
  tableColHeader: {
    width: "25%",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#bfbfbf",
    backgroundColor: "#a8a8a8",
    padding: 5,
  },
  tableCol: {
    width: "25%",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#bfbfbf",
    padding: 5,
  },
  lastCol: {
    borderRightWidth: 1,
  },
  lastRow: {
    borderBottomWidth: 1,
  },
  tableCell: {
    fontSize: 10,
    textAlign: "center",
  },
  tableHeading: {
    fontSize: 12,
    marginBottom: 5,
  },
});

interface Props {
  heading: string;
  truckLoadData: TruckLoad;
  loadItems: LoadItem[];
}

const TruckLoadPDF = ({ heading, truckLoadData, loadItems }: Props) => {
  const generatedDateTime = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.main}>
          <Text style={styles.heading}>{heading}</Text>
          <Text style={styles.generatedTime}>{generatedDateTime}</Text>

          <View style={styles.section}>
            <View style={styles.sectionPart}>
              <Text>Driver:</Text>
              <Text>{`${truckLoadData.driver.id} | ${truckLoadData.driver.name} ${truckLoadData.driver.surname}`}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionPart}>
              <Text>Departure date:</Text>
              <Text>{truckLoadData.startDate}</Text>
            </View>
            <View style={styles.sectionPart}>
              <Text>Arrival date:</Text>
              <Text>{truckLoadData.endDate}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionPart}>
              <Text>Departure time:</Text>
              <Text>{truckLoadData.startTime}</Text>
            </View>
            <View style={styles.sectionPart}>
              <Text>Arrival time:</Text>
              <Text>{truckLoadData.endTime}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionPart}>
              <Text>Income per kilometer:</Text>
              <Text>{truckLoadData.incomePerKilometer}</Text>
            </View>
          </View>

          {/* Table */}
          <View style={styles.table}>
            <Text style={styles.tableHeading}>Load items:</Text>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCell}>Number</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCell}>Name</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCell}>Dangerous</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCell}>Fragile</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCell}>Weight (kg)</Text>
              </View>
              <View style={[styles.tableColHeader, styles.lastCol]}>
                <Text style={styles.tableCell}>Volume (m&sup3;)</Text>
              </View>
            </View>

            {/* Table Rows */}
            {loadItems.map((item, index) => (
              <View
                style={[
                  styles.tableRow,
                  index === loadItems.length - 1 ? styles.lastRow : {},
                ]}
                key={index}
              >
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {item.tableRow !== undefined ? item.tableRow + 1 : ""}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.name}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {item.dangerous ? "Yes" : "No"}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {item.fragile ? "Yes" : "No"}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.weight}</Text>
                </View>
                <View style={[styles.tableCol, styles.lastCol]}>
                  <Text style={styles.tableCell}>{item.volume}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TruckLoadPDF;
