import { Document, Page, View, Text, StyleSheet, Svg, Path, Rect, G } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },
    topHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: '#00786F',
        borderBottomStyle: 'solid'
    },
    logoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    logo: {
        width: 40,
        height: 40,
        marginRight: 10
    },
    logoText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    brandText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333333'
    },
    centerSection: {
        flex: 2,
        alignItems: 'center'
    },
    mainTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00786F',
        textAlign: 'center'
    },
    userSection: {
        fontSize: 10,
        color: '#666666',
        marginTop: 3
    },
    rightSection: {
        flex: 1,
        alignItems: 'flex-end'
    },
    dateText: {
        fontSize: 10,
        color: '#666666',
        fontWeight: 'bold'
    },
    mainContent: {
        flex: 1,
        borderWidth: 2,
        borderColor: '#000000',
        borderStyle: 'solid',
        padding: 20,
        marginBottom: 20
    },
    table: {
        width: '100%',
        height: '100%'
    },
    tableRow: {
        flexDirection: 'row',
        height: '16.66%'
    },
    tableHeaderCell: {
        width: '12.5%',
        borderStyle: 'solid',
        borderColor: '#bfbfbf',
        borderBottomColor: '#00786F',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: '#00786F',
        padding: 8,
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tableMealCell: {
        width: '12.5%',
        borderStyle: 'solid',
        borderColor: '#bfbfbf',
        borderBottomColor: '#D97706',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: '#D97706',
        padding: 8,
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tableCell: {
        width: '12.5%',
        borderStyle: 'solid',
        borderColor: '#bfbfbf',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 8,
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    headerText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    mealText: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    cellText: {
        fontSize: 7,
        color: '#333333',
        lineHeight: 1.2,
        textAlign: 'center'
    },
    emptyText: {
        fontSize: 7,
        color: '#999999',
        fontStyle: 'italic',
        textAlign: 'center'
    },
    footer: {
        textAlign: 'center',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#cccccc',
        borderTopStyle: 'solid'
    },
    footerText: {
        fontSize: 10,
        color: '#666666'
    }
});

const PlanningPDFDocument = ({ planningData, userName = "Usuario" }) => {
    const days = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];
    const mealTypes = ["DESAYUNO", "ALMUERZO", "COMIDA", "MERIENDA", "CENA"];

    const currentDate = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const getRecipeName = (day, meal) => {
        if (!planningData || !planningData[day] || !planningData[day][meal]) {
            return "Sin planificar";
        }
        return planningData[day][meal].receta_nombre || "Sin planificar";
    };

    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={styles.topHeader}>
                    <View style={styles.logoSection}>
                        <View style={styles.logo}>
                            <Svg width="40" height="40" viewBox="0 0 425 400">
                                <Rect width="100%" height="100%" fill="#ffffff" />
                                <G transform="translate(0,400) scale(0.1,-0.1)" fill="#00796B" stroke="none">
                                    <Path d="M1950 3713 c-400 -38 -724 -183 -997 -447 l-116 -112 84 -61 85 -62 71 68 c214 206 454 328 758 388 136 26 406 24 545 -6 262 -55 469 -152 673 -319 80 -65 189 -180 249 -262 24 -33 48 -58 53 -56 12 3 115 166 115 182 0 17 -218 242 -297 306 -343 279 -800 422 -1223 381z" />
                                    <Path d="M3675 3076 c-66 -29 -174 -176 -224 -305 -54 -141 -62 -208 -59 -497 l3 -261 38 -56 c20 -31 56 -69 78 -84 l42 -28 -5 -417 c-6 -465 -7 -460 61 -505 55 -37 144 -23 171 26 7 13 10 365 10 1059 0 977 -1 1040 -17 1054 -27 23 -64 28 -98 14z" />
                                    <Path fill="#F57C00" d="M1645 3030 c-226 -24 -411 -175 -487 -400 -22 -63 -22 -81 -26 -550 -4 -546 -1 -577 64 -710 50 -101 162 -214 257 -259 120 -57 157 -61 637 -61 339 0 450 3 503 15 196 41 371 207 434 410 16 55 18 103 18 570 0 499 0 512 -22 580 -63 198 -219 344 -416 390 -52 12 -154 16 -474 19 -224 2 -444 1 -488 -4z m49 -301 c24 -19 26 -26 26 -95 l0 -74 150 0 150 0 0 72 c0 60 4 76 22 95 27 28 51 29 94 2 34 -20 34 -21 34 -95 l0 -74 155 0 155 0 0 74 c0 69 2 76 26 95 34 27 41 26 87 -4 37 -26 37 -26 37 -95 l0 -70 58 0 c31 0 68 -6 82 -13 32 -16 38 -64 12 -97 -16 -20 -31 -24 -118 -31 -54 -4 -348 -8 -652 -9 -584 0 -599 1 -616 45 -11 29 -7 72 8 84 8 7 49 15 92 19 l79 7 2 35 c0 19 2 54 2 77 1 35 6 45 29 57 37 21 55 20 86 -5z m236 -589 l0 -140 160 0 160 0 0 140 0 140 70 0 70 0 0 -140 0 -140 185 0 185 0 0 -70 0 -70 -185 0 -185 0 0 -167 0 -168 185 3 185 3 0 -71 0 -70 -665 0 -665 0 0 70 0 70 185 0 185 0 0 165 0 165 -185 0 -185 0 0 70 0 70 185 0 186 0 -1 133 c-1 72 -1 135 -1 140 1 4 30 7 66 7 l65 0 0 -140z" />
                                    <Path fill="#F57C00" d="M1930 1693 l0 -168 160 0 160 0 0 168 0 167 -160 0 -160 0 0 -167z" />
                                    <Path d="M569 3011 c-24 -19 -24 -19 -27 -287 -2 -172 -7 -273 -14 -281 -16 -20 -66 -16 -78 6 -6 12 -10 118 -10 275 0 247 -1 257 -21 277 -17 17 -29 20 -63 16 -78 -11 -77 -8 -74 -356 l3 -306 27 -57 c34 -72 99 -143 160 -174 l49 -25 -7 -557 c-6 -431 -4 -563 5 -580 18 -33 70 -62 114 -62 30 0 46 8 80 39 l42 40 0 213 c0 117 -4 369 -8 560 l-9 347 42 21 c91 46 159 142 180 249 13 71 13 561 0 597 -6 15 -18 33 -28 40 -25 19 -76 17 -103 -5 -24 -19 -24 -20 -27 -282 -2 -168 -7 -268 -14 -276 -16 -19 -56 -16 -68 6 -6 12 -10 118 -10 274 0 242 -1 256 -21 281 -26 32 -84 36 -120 7z" />
                                    <Path d="M3326 1230 c-132 -198 -329 -373 -560 -496 -424 -225 -955 -216 -1383 23 -163 92 -359 261 -461 401 l-47 64 -8 -128 c-4 -70 -12 -133 -19 -141 -9 -11 5 -31 73 -99 197 -200 452 -352 716 -428 177 -50 256 -61 458 -60 215 0 334 18 521 79 275 90 576 294 759 514 64 77 72 100 74 232 1 55 0 57 -38 82 l-39 26 -46 -69z" />
                                </G>
                            </Svg>
                        </View>
                        <Text style={styles.brandText}>RecipePlanner</Text>
                    </View>

                    <View style={styles.centerSection}>
                        <Text style={styles.mainTitle}>Planificación semanal</Text>
                        <Text style={styles.userSection}>para {userName}</Text>
                    </View>

                    <View style={styles.rightSection}>
                        <Text style={styles.dateText}>{currentDate}</Text>
                    </View>
                </View>

                <View style={styles.mainContent}>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableHeaderCell}>
                                <Text style={styles.headerText}></Text>
                            </View>
                            {days.map(day => (
                                <View key={day} style={styles.tableHeaderCell}>
                                    <Text style={styles.headerText}>{day}</Text>
                                </View>
                            ))}
                        </View>
                        {mealTypes.map(meal => (
                            <View key={meal} style={styles.tableRow}>
                                <View style={styles.tableMealCell}>
                                    <Text style={styles.mealText}>{meal}</Text>
                                </View>
                                {days.map(day => (
                                    <View key={`${day}-${meal}`} style={styles.tableCell}>
                                        <Text style={getRecipeName(day, meal) === "Sin planificar" ? styles.emptyText : styles.cellText}>
                                            {getRecipeName(day, meal)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Planificación semanal generada por recipeplanner.adriancc.com
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default PlanningPDFDocument;